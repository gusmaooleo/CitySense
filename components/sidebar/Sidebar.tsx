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
    url: "#",
    icon: Layers,
  },
  {
    title: "Alertas",
    url: "#",
    icon: TriangleAlert,
  },
  {
    title: "Inteligência",
    url: "#",
    icon: BrainCircuit,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar className="bg-(--darkgray)">
      <SidebarHeader>
        <div className="flex flex-row items-center gap-3 p-2">
          <Image src="/citysense.svg" alt="logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-(--green-tone)">CitySense</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup />
        {items.map((item) => (
          <SidebarMenuButton className="mb-1 text-white" asChild key={item.title}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        ))}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
