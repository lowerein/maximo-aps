import ForgeViewer from "@/components/ForgeViewer/ForgeViewer";
import Sidebar from "@/components/Sidebar/Sidebar";
import Detailbar from "@/components/Detailbar/Detailbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-row">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-full flex flex-col">
        <div className="py-2 flex flex-row space-x-8 justify-between">
          <div className="font-semibold">Filters:</div>
          <div className="flex">
            <div className="flex flex-row">
              <div>Owner group</div>
              <input
                type="text"
                className="border mx-2 text-center"
                placeholder="BS"
              ></input>
            </div>

            <div className="flex flex-row">
              <div>Status</div>
              <input
                type="text"
                className="border mx-2 text-center"
                placeholder="COMP"
              ></input>
            </div>

            <div className="flex flex-row">
              <div>Date</div>
              <input
                type="text"
                className="border mx-2 text-center"
                placeholder="Last 7 Days"
              ></input>
            </div>
          </div>
        </div>
        <ForgeViewer />
      </div>
      <div className="w-2/5">
        <Detailbar />
      </div>
    </div>
  );
}
