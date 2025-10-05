import { Feature } from "ol";
import { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

export type GeoLayer = {
  name: string;
  url: string;
  source: VectorSource<Feature<Geometry>>;
  style?: Style;
};

export const MapLayers: GeoLayer[] = [
  {
    name: "Bairros",
    url: "https://geo.salvador.ba.gov.br/arcgis/services/Hosted/dec_32791_20_bairros_a/MapServer/WFSServer?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dec_32791_20_bairros_a:dec_32791_20_bairros_a&OUTPUTFORMAT=GEOJSON&SRSNAME=EPSG:31984&STARTINDEX=0&COUNT=3000",
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({ color: "rgba(59, 59, 59, 1)", width: 1 }),
      fill: new Fill({ color: "rgba(176, 255, 130, 0.3)" }),
    }),
  },
  {
    name: "Áreas de risco",
    url: "https://geo.salvador.ba.gov.br/arcgis/services/Hosted/idesh_zeis_priorizacao_a/MapServer/WFSServer?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=idesh_zeis_priorizacao_a:IDESH_ZEIS_Priorizacao&OUTPUTFORMAT=GEOJSON&SRSNAME=EPSG:31984&STARTINDEX=0&COUNT=3000",
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({ color: "rgba(255, 128, 55, 1)", width: 1 }),
      fill: new Fill({ color: "rgba(255, 168, 55, 0.3)" }),
    }),
  },
];
