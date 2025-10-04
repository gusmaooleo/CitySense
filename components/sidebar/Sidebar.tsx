import { BrainCircuit, Layers, Settings, TriangleAlert } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Image from "next/image";

const items = [
  {
    title: "Camadas",
    icon: Layers,
  },
  {
    title: "Alertas",
    icon: TriangleAlert,
  },
  {
    title: "Inteligência",
    icon: BrainCircuit,
  },
  {
    title: "Configurações",
    icon: Settings,
  },
];

export default function AppSidebar({
  onSelect,
}: {
  onSelect?: (title: string) => void;
}) {
  return (
    <Sidebar className="bg-(--darkgray) border-none">
      <SidebarHeader>
        <div className="flex flex-row items-center gap-3 p-2">
          <Image src="/citysense.svg" alt="logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-(--green-tone)">CitySense</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup />
        {items.map((item) => (
          <SidebarMenuButton
            className="mb-1 text-white cursor-pointer"
            asChild
            key={item.title}
            onClick={() => onSelect?.(item.title)}
          >
            <p>
              <item.icon />
              <span>{item.title}</span>
            </p>
          </SidebarMenuButton>
        ))}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
