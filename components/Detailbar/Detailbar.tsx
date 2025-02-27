"use client";
import { useAtomValue } from "jotai";
import { roomIdAtom, workOrdersAtom } from "@/stores/atoms";

const Detailbar = () => {
  const roomId = useAtomValue(roomIdAtom);
  const workOrders = useAtomValue(workOrdersAtom);
  const filteredWorkOrders = workOrders.filter(
    (wo) => wo.ust_areacode === roomId
  );

  return (
    <div className="p-4 h-full w-full flex flex-col space-y-2">
      <div className=" font-semibold">Work Order Details</div>

      {filteredWorkOrders?.length > 0 ? (
        <div className="w-full h-full flex flex-col space-y-2">
          {filteredWorkOrders.map((workOrder, index) => {
            return (
              <div key={"workOrder" + index} className="flex flex-col">
                <div>{workOrder.wonum}</div>
                <div>{workOrder.location}</div>
                <div>{workOrder.floor}</div>
                <div>{workOrder.description}</div>
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
