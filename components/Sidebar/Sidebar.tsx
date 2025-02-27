"use client";

import { bubbleNodesAtom, viewerAtom, workOrdersAtom } from "@/stores/atoms";
import { useAtomValue, useAtom } from "jotai";
import { useEffect } from "react";
import { getIdsByProperty } from "@/utils/viewer";
import { WorkOrder } from "@/interface/WorkOrder";
import data from "@/data/shaw.json";

// const WorkOrders: WorkOrder[] = [
//   {
//     location: "WSC",
//     ust_areacode: "SAR221",
//     description: "The A/C is dripping water in master bedroom.",
//   },
//   {
//     location: "WSC",
//     ust_areacode: "R2-XX Lecture Room 23A",
//   },
//   {
//     location: "WSC",
//     ust_areacode: "R2-XX Air Duct",
//   },
//   {
//     location: "WSC",
//     ust_areacode: "R2-21 Lecture Room 27",
//   },
// ];

const WorkOrders: WorkOrder[] = data.member.map((d) => {
  return {
    location: d.location.location,
    floor: d.location.ust_floor,
    description: d.description,
    statusdate: d.statusdate,
    wonum: d.wonum,
    ust_areacode: d.ust_areacode,
  };
});

const Sidebar = () => {
  const [workOrders, setWorkOrders] = useAtom(workOrdersAtom);

  //console.log(WorkOrders[0]);

  setWorkOrders(WorkOrders);
  const bubbleNodes = useAtomValue(bubbleNodesAtom);
  const viewer = useAtomValue(viewerAtom);
  useEffect(() => {}, [bubbleNodes]);

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
        new Set(workOrders.map((workOrder) => workOrder.location))
      );

      console.log(uniqueAreaCodes);

      const ids = await getIdsByProperty(
        viewer,
        "COBie.Space.Name",
        uniqueAreaCodes

      );

      // console.log(uniqueAreaCodes);
      console.log("interest", ids);

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
          return (
            <div
              key={bubbleNode.data.guid}
              className="hover:font-semibold cursor-pointer"
              onClick={() => clickHandler(bubbleNode)}
            >
              {bubbleNode.data.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
