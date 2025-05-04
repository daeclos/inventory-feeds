"use client";   
import { create } from "zustand";

type SidebarState = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  expanded: true,
  setExpanded: (value) => set({ expanded: value }),
}));
