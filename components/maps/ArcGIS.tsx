"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

// Definir a projeção EPSG:31984
proj4.defs(
  "EPSG:31984",
  "+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
register(proj4);



export type GeoLayer = {
  url: string,
  source: VectorSource<Feature<Geometry>>
}

export default function ArcGISMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Camada base
    const osmLayer = new TileLayer({ source: new OSM() });

    // Camada GeoJSON
    // https://geo.salvador.ba.gov.br/arcgis/services/Hosted/idesh_zeis_priorizacao_a/MapServer/WFSServer?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=idesh_zeis_priorizacao_a:IDESH_ZEIS_Priorizacao&OUTPUTFORMAT=GEOJSON&SRSNAME=EPSG:31984&STARTINDEX=0&COUNT=3000
    const bairrosSource = new VectorSource();

    const bairrosLayer = new VectorLayer({
      source: bairrosSource,
      style: new Style({
        stroke: new Stroke({ color: "rgba(255, 235, 55, 1)", width: 1 }),
        fill: new Fill({ color: "rgba(55, 255, 115, 0.3)" }),
      }),
    });

    const riskAreaSource = new VectorSource();

    
    const riskAreaLayer = new VectorLayer({
      source: riskAreaSource,
      style: new Style({
        stroke: new Stroke({ color: "rgba(255, 128, 55, 1)", width: 1 }),
        fill: new Fill({ color: "rgba(255, 168, 55, 0.3)" }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, bairrosLayer, riskAreaLayer],
      view: new View({
        projection: "EPSG:3857",
        center: [-4340000, -750000], // Coordenadas Web Mercator para Salvador
        zoom: 11,
      }),
    });

    const loadGeoJSON = async () => {
      try {
        const geoJsonUrl = "https://geo.salvador.ba.gov.br/arcgis/services/Hosted/dec_32791_20_bairros_a/MapServer/WFSServer?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dec_32791_20_bairros_a:dec_32791_20_bairros_a&OUTPUTFORMAT=GEOJSON&SRSNAME=EPSG:31984&STARTINDEX=0&COUNT=3000";
        
        console.log("Fetching GeoJSON from:", geoJsonUrl);
        
        const response = await fetch(geoJsonUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const geoJsonData = await response.json();
        console.log("GeoJSON data received:", geoJsonData);

        // Verificar se há features
        if (!geoJsonData.features || geoJsonData.features.length === 0) {
          console.warn("No features found in GeoJSON");
          return;
        }

        // Configurar o parser GeoJSON com a projeção correta
        const geoJsonFormat = new GeoJSON();

        // Ler as features especificando as projeções
        const features = geoJsonFormat.readFeatures(geoJsonData, {
          dataProjection: "EPSG:31984", // Projeção dos dados de origem
          featureProjection: "EPSG:3857" // Projeção do mapa (Web Mercator)
        });

        console.log(`Parsed ${features.length} features`);

        // Adicionar features à source
        bairrosSource.addFeatures(features);

        // Ajustar a view para mostrar todas as features
        if (features.length > 0) {
          setTimeout(() => {
            const extent = bairrosSource.getExtent();
            if (extent && extent.every(coord => !isNaN(coord))) {
              map.getView().fit(extent, {
                padding: [50, 50, 50, 50],
                duration: 1000,
                maxZoom: 15
              });
              console.log("Map fitted to extent:", extent);
            }
          }, 100);
        }

      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    loadGeoJSON();

    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}