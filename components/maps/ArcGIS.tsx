"use client";

import { MapLayers } from "@/lib/map/layers";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { useEffect, useRef } from "react";
import { mapService } from "@/lib/map/mapService";

proj4.defs(
  "EPSG:31984",
  "+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
register(proj4);

export default function ArcGISMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;
      await mapService.initialize(mapRef.current);
  
      MapLayers.forEach((layer) => {
        mapService.loadGeoJSONLayer(layer);
      })
    }

    loadMap();

    return () => {};
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
