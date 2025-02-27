"use client";

import { atom, useAtom } from "jotai";
import { WorkOrder } from "@/interface/WorkOrder";

const viewerAtom = atom<Autodesk.Viewing.GuiViewer3D | null>(null);
const bubbleNodesAtom = atom<Autodesk.Viewing.BubbleNode[]>([]);
const workOrdersAtom = atom<WorkOrder[]>([]);
const roomIdAtom = atom<string | null>();
const dbIdAtom = atom<number | null>();

export { viewerAtom, bubbleNodesAtom, workOrdersAtom, roomIdAtom, dbIdAtom };
