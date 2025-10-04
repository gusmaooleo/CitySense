import { Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { Style, Text } from "ol/style";
import { GeoLayer } from "./layers";
import { WMTS } from "ol/source";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";

class MapService {
  private layers: { [key: string]: VectorLayer<VectorSource> } = {};
  private baseLayer: TileLayer<OSM> | null = null;
  private map: Map | null = null;

  async initialize(container: HTMLDivElement) {
    this.baseLayer = new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      }),
    });

    this.map = new Map({
      target: container,
      layers: [this.baseLayer],
      view: new View({
        projection: "EPSG:3857",
        center: [-4340000, -750000],
        zoom: 11,
      }),
    });

    await this.addWMTSTileLayer(
      "https://api.ellipsis-drive.com/v3/ogc/wmts/085f5e10-63b6-4e8f-a4c6-dce9689100d3?request=getCapabilities",
      "Perfil de elevação"
    );

    await this.addWMTSTileLayer(
      "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml",
      "Impermeabilização do solo",
      "Landsat_Global_Man-made_Impervious_Surface",
      0.4
    );
  }

  async addWMTSTileLayer(
    wmtsUrl: string,
    layerName: string,
    identifier?: string,
    opacity?: number
  ): Promise<void> {
    if (!this.map) throw new Error("Map not initialized");

    try {
      const response = await fetch(wmtsUrl);
      const text = await response.text();

      const parser = new WMTSCapabilities();
      const result = parser.read(text);

      console.log("WMTS Capabilities for", layerName, ":", result);

      let layerIdentifier: string;
      let matrixSetIdentifier: string;

      if (wmtsUrl.includes("nasa.gov")) {
        layerIdentifier = identifier || result.Contents.Layers[0].Identifier;
        matrixSetIdentifier = result.Contents.TileMatrixSet[0].Identifier;
      }
      else {
        layerIdentifier = identifier || result.Contents.Layer[0].Identifier;
        matrixSetIdentifier = result.Contents.TileMatrixSet[0].Identifier;
      }

      const options = optionsFromCapabilities(result, {
        layer: layerIdentifier,
        matrixSet: matrixSetIdentifier,
      });

      if (options) {
        const wmtsLayer = new TileLayer({
          source: new WMTS(options),
          opacity: opacity ?? 0.8,
        });

        this.map.addLayer(wmtsLayer);

        console.log(`Layer ${layerName} adicionada com sucesso!`);
      } else {
        throw new Error(
          `Could not create options for layer ${layerIdentifier}`
        );
      }
    } catch (error) {
      console.error(`Error loading WMTS layer ${layerName}:`, error);
      throw error;
    }
  }

  async loadGeoJSONLayer(layerConfig: GeoLayer): Promise<string> {
    if (!this.map) throw new Error("Map not initialized");

    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source,
    });

    try {
      const response = await fetch(layerConfig.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const geoJsonData = await response.json();

      if (!geoJsonData.features || geoJsonData.features.length === 0) {
        console.warn("No features found in GeoJSON");
        return layerConfig.name;
      }

      const geoJsonFormat = new GeoJSON();
      const features = geoJsonFormat.readFeatures(geoJsonData, {
        dataProjection: "EPSG:31984",
        featureProjection: "EPSG:3857",
      });

      console.log(features);
      source.addFeatures(features);

      if (features.length > 0) {
        setTimeout(() => {
          const extent = source.getExtent();
          if (extent && extent.every((coord) => !isNaN(coord))) {
            this.map!.getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 1000,
              maxZoom: 15,
            });
          }
        }, 100);
      }

      source.forEachFeature((f) => {
        f.setStyle(
          new Style({
            text: new Text({
              text:
                f.getProperties()["NOME_BAIRR"] ??
                f.getProperties()["Zeisnome"],
            }),
            stroke: layerConfig.style?.getStroke()!,
            fill: layerConfig.style?.getFill()!,
          })
        );

        f.setId(f.getProperties()["GmlID"]);
      });

      this.layers[layerConfig.name] = vectorLayer;
      this.map!.addLayer(vectorLayer);

      return layerConfig.name;
    } catch (error) {
      console.error(`Error loading layer ${layerConfig.name}:`, error);
      throw error;
    }
  }

  showLayer(layerId: string) {
    const layer = this.layers[layerId];
    if (layer) {
      layer.setVisible(true);
    }
  }

  hideLayer(layerId: string) {
    const layer = this.layers[layerId];
    if (layer) {
      layer.setVisible(false);
    }
  }

  removeLayer(layerId: string) {
    const layer = this.layers[layerId];
    if (layer && this.map) {
      this.map.removeLayer(layer);
      delete this.layers[layerId];
    }
  }

  getLayer(layerId: string): VectorLayer<VectorSource> | undefined {
    return this.layers[layerId];
  }

  getAllLayerIds(): string[] {
    return Object.keys(this.layers);
  }

  destroy() {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
    this.layers = {};
  }

  getAllFeatures(layerId?: string) {
    if (layerId) {
      const layer = this.layers[layerId];
      return layer ? layer.getSource()?.getFeatures() ?? [] : [];
    }

    return Object.values(this.layers).flatMap(
      (layer) => layer.getSource()?.getFeatures() ?? []
    );
  }

  focusFeature(featureId: string, layerId?: string) {
    if (!this.map) return;

    const layers = layerId
      ? [this.layers[layerId]]
      : Object.values(this.layers);
    for (const layer of layers) {
      const feature = layer?.getSource()?.getFeatureById(featureId);
      if (feature) {
        const extent = feature.getGeometry()?.getExtent();
        if (extent) {
          this.map.getView().fit(extent, {
            duration: 800,
            padding: [50, 50, 50, 50],
            maxZoom: 15,
          });
        }
        return feature;
      }
    }

    console.warn(`Feature com ID ${featureId} não encontrada`);
  }


  getRawLayers() {
    return this.layers;
  }
}

export const mapService = new MapService();
