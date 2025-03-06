"use client";

import { bubbleNodesAtom, viewerAtom, workOrdersAtom } from "@/stores/atoms";
import { useAtomValue, useAtom } from "jotai";
import { getIdsByProperty } from "@/utils/viewer";
import { useEffect } from "react";
import { WorkOrder } from "@/interface/WorkOrder";

const Sidebar = () => {
  const [workOrders, setWorkOrders] = useAtom(workOrdersAtom);
  const bubbleNodes = useAtomValue(bubbleNodesAtom);
  const viewer = useAtomValue(viewerAtom);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/maximo");
      const workOrders = await response.json();
      setWorkOrders(workOrders);
    };

    fetchData();
  }, []);

  const getWorkOrderNumber = (
    bubbleNode: Autodesk.Viewing.BubbleNode,
    workOrders: WorkOrder[]
  ) => {
    let levelName = (bubbleNode.data as any).levelName;
    if (levelName) {
      if (levelName === "GF SFL") levelName = "G";
      if (levelName === "1F SFL") levelName = "1";
      if (levelName === "2F SFL") levelName = "2";
      if (levelName === "RF SFL") levelName = "R";
      if (levelName === "URF SFL") levelName = "R";

      if (levelName.includes("/F"))
        levelName = (levelName as string).replace("/F", "");

      return workOrders.filter((wo) => wo.floor === levelName).length;
    } else return 0;
  };

  const clickHandler = (bubbleNode: Autodesk.Viewing.BubbleNode) => {
    if (null == viewer) return;
    const doc = viewer?.model.getDocumentNode().getDocument();
    if (null == doc) return;

    viewer?.loadDocumentNode(doc, bubbleNode).then(async () => {
      // dim all room first
      const roomIds = await getIdsByProperty(viewer, "Category", [
        "Revit Rooms",
      ]);
      roomIds.map((id) => {
        viewer.setThemingColor(id, new THREE.Vector4(1, 1, 1, 1));
      });
      //viewer.hide(roomIds);

      // if rooms is good then show it
      const uniqueAreaCodes = Array.from(
        new Set(
          workOrders.map((workOrder) => workOrder.location.replace("UST", ""))
        )
      );

      //console.log(uniqueAreaCodes);

      const ids = await getIdsByProperty(
        viewer,
        "COBie.Space.Name",
        uniqueAreaCodes
      );

      // console.log(uniqueAreaCodes);
      //console.log("interest", ids);

      ids.map((id) => {
        viewer.show(id);
        viewer.setThemingColor(id, new THREE.Vector4(1, 0, 0, 0.7));
      });
    });
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col p-4 space-y-2">
        {bubbleNodes.map((bubbleNode) => {
          const orderNumber = getWorkOrderNumber(bubbleNode, workOrders);
          return (
            <div
              key={bubbleNode.data.guid}
              className="hover:font-semibold cursor-pointer"
              onClick={() => clickHandler(bubbleNode)}
            >
              {bubbleNode.data.name}
              {orderNumber > 0 && (
                <span className="text-red-500">({orderNumber})</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
