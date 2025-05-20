import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NegativeKeyword {
  keyword: string;
  match: string;
}

export interface NegativeKeywordList {
  name: string;
  createdAt: string;
  updatedAt: string;
  keywords: NegativeKeyword[];
}

interface NegativeKeywordStore {
  lists: NegativeKeywordList[];
  addList: (list: NegativeKeywordList) => void;
  updateList: (idx: number, list: NegativeKeywordList) => void;
  deleteList: (idx: number) => void;
  setLists: (lists: NegativeKeywordList[]) => void;
}

export const useNegativeKeywordStore = create<NegativeKeywordStore>()(
  persist(
    (set) => ({
      lists: [],
      addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
      updateList: (idx, list) =>
        set((state) => ({
          lists: state.lists.map((l, i) => (i === idx ? list : l)),
        })),
      deleteList: (idx) =>
        set((state) => ({
          lists: state.lists.filter((_, i) => i !== idx),
        })),
      setLists: (lists) => set({ lists }),
    }),
    { name: "negative-keyword-lists" }
  )
); 