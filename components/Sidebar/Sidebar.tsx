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

  const getPropertyAsync = (id: number, property: string) => {
    return new Promise((resolve) => {
      if (null == viewer) return;
      viewer.getProperties(id, (result) => {
        const value = result.properties.find(
          (p) => p.displayName == property
        )?.displayValue;
        resolve(value);
      });
    });
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

      ids.map(async (id) => {
        viewer.show(id);

        const roomId = await getPropertyAsync(id, "COBie.Space.Name");
        const status = workOrders.find(
          (wo) => wo.location === "UST" + roomId
        )?.status;

        if (status === "INPRG" || status === "WHDL")
          viewer.setThemingColor(id, new THREE.Vector4(1, 0, 0, 0.7));
        else viewer.setThemingColor(id, new THREE.Vector4(0, 1, 0, 0.7));
      });
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col p-4 space-y-2">
        <div className="font-semibold">Select Buildings and Floors:</div>
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

      <div className="w-full flex flex-row space-x-2 m-4">
        <div>Search:</div>
        <input type="text" className="border w-full"></input>
      </div>
    </div>
  );
};

export default Sidebar;
