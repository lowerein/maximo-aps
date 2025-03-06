"use client";
import { useAtomValue } from "jotai";
import { roomIdAtom, workOrdersAtom } from "@/stores/atoms";
import Link from "next/link";

const Detailbar = () => {
  const roomId = useAtomValue(roomIdAtom);
  const workOrders = useAtomValue(workOrdersAtom);
  const filteredWorkOrders = workOrders.filter(
    (wo) => wo.location === roomId
  );

  return (
    <div className="p-4 w-full flex flex-col space-y-2 overflow-y-auto max-h-screen">
      <div className=" font-semibold">Work Order Details</div>

      {filteredWorkOrders?.length > 0 ? (
        <div className="w-full h-full flex flex-col space-y-2">
          <div className="font-semibold">{filteredWorkOrders[0].location}</div>

          {filteredWorkOrders.map((workOrder, index) => {
            return (
              <div
                key={"workOrder" + index}
                className="flex flex-col border p-2"
              >
                <div>WO: {workOrder.wonum}</div>
                <div>Created by: {workOrder.createdBy}</div>
                <div>Date: {workOrder.statusdate}</div>
                <div>Status: {workOrder.status}</div>
                <div>Floor: {workOrder.floor}</div>
                <div>Description: {workOrder.description}</div>
                <Link
                  className="text-blue-400 hover:text-blue-600 pt-4"
                  href={
                    "https://maximo.ust.hk/maximo/ui/maximo.jsp?event=loadapp&value=wotrack&additionalevent=useqbe&additionaleventvalue=wonum=" +
                    workOrder.wonum
                  }
                  target="_blank"
                >
                  View in Maximo
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          Select any rooms to show work order details.
        </div>
      )}
    </div>
  );
};

export default Detailbar;
