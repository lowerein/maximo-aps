import ForgeViewer from "@/components/ForgeViewer/ForgeViewer";
import Sidebar from "@/components/Sidebar/Sidebar";
import Detailbar from "@/components/Detailbar/Detailbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-row">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-full">
        <ForgeViewer />
      </div>
      <div className="w-2/5">
        <Detailbar/>
      </div>
    </div>
  );
}
