"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { initViewer, loadModel } from "@/utils/viewer";
import { useAtom, useAtomValue } from "jotai";
import {
  viewerAtom,
  bubbleNodesAtom,
  workOrdersAtom,
  roomIdAtom,
  dbIdAtom,
} from "@/stores/atoms";

const ForgeViewer = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useAtom(viewerAtom);
  const [, setBubbleNodes] = useAtom(bubbleNodesAtom);
  const workOrders = useAtomValue(workOrdersAtom);
  const [, setRoomId] = useAtom(roomIdAtom);
  const [dbId, setDbId] = useAtom(dbIdAtom);

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
          if (event.dbIdArray?.length > 0) setDbId(event.dbIdArray[0]);
          else setDbId(null);
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

  useEffect(() => {
    //console.log(workOrders);

    if (!viewer) return;
    if (!dbId) return;

    const doc = viewer.model.getDocumentNode().getDocument();
    if (!doc) return;

    const uniqueAreaCodes = Array.from(
      new Set(workOrders.map((workOrder) => workOrder.location))
    );

    //console.log(uniqueAreaCodes);

    viewer.model.getProperties(dbId, (result) => {
      const property = result.properties.find(
        (p) => p.displayName === "COBie.Space.Name"
      );
      const value = "UST" + String(property?.displayValue);

      if (uniqueAreaCodes.includes(value)) {
        //console.log("SSS");
        setRoomId(value);
      }
    });
  }, [dbId]);

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
