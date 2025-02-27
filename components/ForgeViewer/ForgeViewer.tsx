"use client";

import Script from "next/script";
import { useRef } from "react";
import { initViewer, loadModel } from "@/utils/viewer";
import { useAtom, useAtomValue } from "jotai";
import {
  viewerAtom,
  bubbleNodesAtom,
  workOrdersAtom,
  roomIdAtom,
} from "@/stores/atoms";

const ForgeViewer = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [, setViewer] = useAtom(viewerAtom);
  const [, setBubbleNodes] = useAtom(bubbleNodesAtom);
  const workOrders = useAtomValue(workOrdersAtom);
  const [, setRoomId] = useAtom(roomIdAtom);

  // load viewer
  const onPageLoaded = async () => {
    const response = await fetch("/api/auth");
    if (!response.ok) return;
    const token = await response.json();

    const urnResponse = await fetch("/api/urn");
    if (!urnResponse.ok) return;
    const urn = await urnResponse.json();

    initViewer(viewerRef.current as HTMLElement, token).then(async (view) => {
      const viewer = view as Autodesk.Viewing.GuiViewer3D;

      viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        (event) => {
          
          const doc = viewer.model.getDocumentNode().getDocument();
          setRoomId(null);
          if (doc) {
            const uniqueAreaCodes = Array.from(
              new Set(workOrders.map((workOrder) => workOrder.location))
            );

            //console.log(uniqueAreaCodes);

            if (event.dbIdArray?.length > 0) {
              const dbId = event.dbIdArray[0] as number;
              viewer.model.getProperties(dbId, (result) => {
                const property = result.properties.find(
                  (p) => p.displayName === "COBie.Space.Name"
                );
                const value = String(property?.displayValue);

                // console.log("HEY");
                // console.log(value);



                if (uniqueAreaCodes.includes(value)) {
                  //console.log("SSS");
                  setRoomId(value);
                }
              });
            }
          }
        }
      );

      loadModel(viewer, urn.urn).then(() => {
        setViewer(viewer);
        const doc = viewer.model.getDocumentNode().getDocument();
        const bubbleNodes = doc.getRoot().search({ type: "geometry" });
        setBubbleNodes(bubbleNodes);
      });
    });
  };

  return (
    <>
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
        strategy="afterInteractive"
        onLoad={onPageLoaded}
      />

      <link
        rel="stylesheet"
        href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css"
      />

      <div ref={viewerRef} className="relative w-full h-full" />
    </>
  );
};

export default ForgeViewer;
