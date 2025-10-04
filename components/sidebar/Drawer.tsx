"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import LayersDrawer from "./drawers/LayersDrawer";
import AppSidebar from "./Sidebar";

const drawerContent = {
  Camadas: <LayersDrawer />,
  Alertas: <p>Alertas de risco e eventos ativos</p>,
  Inteligência: <p>Inferências automáticas e IA ambiental</p>,
  Configurações: <p>Preferências e integrações</p>,
};

export default function AppDrawer() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex flex-row h-screen">
      <AppSidebar
        onSelect={(title) => setActive(title === active ? null : title)}
      />

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col w-[470px] bg-(--darkgray) border-l border-background/10 shadow-lg p-4 overflow-y-auto rounded-r-lg relative"
          >
            <div className="flex flex-row w-full gap-2 items-center mb-3 text-(--green-tone)">
              <button
                onClick={() => setActive(null)}
                className="cursor-pointer"
              >
                <ArrowLeft />
              </button>
              <h2 className="text-lg font-bold">{active}</h2>
            </div>
            {drawerContent[active as keyof typeof drawerContent]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
