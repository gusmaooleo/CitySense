import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/Sidebar";
import ArcGISMap from "@/components/maps/ArcGIS";

export default function Home() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full h-[100vh] items-center justify-center relative">
          <SidebarTrigger className="p-5 cursor-pointer absolute top-0 left-0 z-1000" />
          <ArcGISMap />
        </div>
      </SidebarProvider>
    </>
  );
}
