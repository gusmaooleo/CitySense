"use client";

import { useState, useMemo, useEffect } from "react";
import { mapService } from "@/lib/map/mapService";
import { Eye, EyeClosed, LocateIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LayersDrawer() {
  const [query, setQuery] = useState("");
  const [currentLayer, setCurrentLayer] = useState<string>("Bairros");
  const [visible, setVisible] = useState<boolean>(true);

  const features = useMemo(() => mapService.getAllFeatures(), []);
  const focusFeature = (id: string) => mapService.focusFeature(id);

  const filtered = useMemo(() => {
    if (!query.trim()) return features;
    return features.filter(
      (f) =>
        f
          .get("NOME_BAIRR")
          ?.toLowerCase()
          .includes(query.trim().toLowerCase()) ||
        f.get("Zeisnome")?.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, features, currentLayer]);

  useEffect(() => {
    if (currentLayer === "Todos") {
      const keyList = Object.keys(mapService.getRawLayers());
      if (visible) keyList.forEach((key) => mapService.showLayer(key));
      else keyList.forEach((key) => mapService.hideLayer(key));

      return;
    }
    console.log(visible);
    if (visible) mapService.showLayer(currentLayer);
    else mapService.hideLayer(currentLayer);
  }, [visible]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <button
        className="absolute top-0 right-0 p-4 text-background"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <Eye /> : <EyeClosed />}
      </button>
      <h1 className="font-semibold text-background mb-3">
        Settings and map layers management
      </h1>

      <div className="flex flex-row gap-2">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-2.5 text-(--muted-foreground)"
            size={18}
          />
          <Input
            placeholder="Search for a neighborhood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-(--muted-foreground)/40 rounded-md pl-9 pr-9 py-2 text-(--darkgray) placeholder-(--darkgray) outline-none focus:border-(--lightblue) duration-150"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 text-(--muted-foreground) hover:text-(--lightblue) transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Select
          onValueChange={(value) =>
            setCurrentLayer(value as "Bairros" | "Áreas de risco")
          }
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select a layer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">All</SelectItem>
            <SelectItem value="Bairros">Neighborhood's</SelectItem>
            <SelectItem value="Áreas de risco">Risk Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col grow-1 overflow-y-auto pr-2 gap-2">
        {filtered.length === 0 ? (
          <p className="text-(--muted-foreground) text-sm italic px-2">
            Any neighborhood found.
          </p>
        ) : (
          filtered.map((f) => {
            const property = f.getProperties();
            if (property["NOME_BAIRR"] && currentLayer === "Áreas de risco") {
              return null;
            }
            if (!property["NOME_BAIRR"] && currentLayer === "Bairros") {
              return null;
            }

            return (
              <div
                key={f.getId()}
                className="flex flex-row w-full justify-between px-4 border border-(--muted-foreground)/30 rounded-lg text-background duration-150 hover:bg-background/10"
              >
                <div className="flex flex-col gap-2 py-3">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="font-bold text-(--lightblue)">
                      {property["NOME_BAIRR"] ?? property["Zeisnome"]}
                    </p>
                    <span
                      className={`w-[10px] h-[10px] rounded-full ${
                        property["Zeisnome"]
                          ? "bg-(--chart-1)"
                          : "bg-(--chart-2)"
                      }`}
                    ></span>
                  </div>
                  <div className="flex flex-row gap-2">
                    {property["INSTITUIDO"] && (
                      <p className="text-sm text-(--muted-foreground)">
                        Instituted: {property["INSTITUIDO"]}
                      </p>
                    )}
                    {property["IDESH"] && (
                      <p className="text-sm text-(--muted-foreground)">
                        IDESH: {property["IDESH"]}
                      </p>
                    )}
                    {property["area_ha"] && (
                      <p className="text-sm text-(--muted-foreground)">
                        Area (HA): {property["area_ha"]}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="pl-4 cursor-pointer h-full border-l border-(--muted-foreground)/30 flex items-center"
                  onClick={() => focusFeature(f.getId() as string)}
                >
                  <LocateIcon size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
