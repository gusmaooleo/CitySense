"use client";

import { useState, useMemo, useEffect } from "react";
import { mapService } from "@/lib/map/mapService";
import { Eye, EyeClosed, LocateIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AlertDrawer() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(true);
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const alerts = mapService.getFeaturesByLayer("Alertas");
    setFeatures(alerts ?? []);
  }, []);

  const focusFeature = (id: string, layerId: string) => mapService.focusFeature(id, layerId);

  const filtered = useMemo(() => {
    if (!query.trim()) return features;
    return features.filter((f) => {
      const props = f.getProperties();
      return (
        props.name?.toLowerCase().includes(query.toLowerCase()) ||
        props.alertType?.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [query, features]);

  useEffect(() => {
    if (visible) mapService.showLayer("Alertas");
    else mapService.hideLayer("Alertas");
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
        Risk alerts and active events
      </h1>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-2.5 text-(--muted-foreground)"
          size={18}
        />
        <Input
          placeholder="Search alert..."
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

      <div className="flex flex-col grow-1 overflow-y-auto pr-2 gap-2">
        {filtered.length === 0 ? (
          <p className="text-(--muted-foreground) text-sm italic px-2">
            Any alerts found.
          </p>
        ) : (
          filtered.map((f) => {
            const p = f.getProperties();
            
            return (
              <div
                key={p.name}
                className="flex flex-row w-full justify-between px-4 border border-(--muted-foreground)/30 rounded-lg text-background duration-150 hover:bg-background/10"
              >
                <div className="flex flex-col gap-2 py-3">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="font-bold text-(--lightblue)">{p.name}</p>
                    <span
                      className={`w-[10px] h-[10px] rounded-full ${
                        p.severity === "muito_grave"
                          ? "bg-red-500"
                          : "bg-orange-400"
                      }`}
                    ></span>
                  </div>

                  <div className="flex flex-col text-sm text-(--muted-foreground)">
                    <p>Alert type: {p.alertType}</p>
                    {p.area && <p>Area (ha): {p.area}</p>}
                    {p.idesh && <p>IDESH: {p.idesh}</p>}
                  </div>
                </div>

                <button
                  className="pl-4 cursor-pointer h-full border-l border-(--muted-foreground)/30 flex items-center"
                  onClick={() => focusFeature(p.id.toString(), "Alertas")}
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
