import {createStore} from "zustand/vanilla";
import {createJSONStorage, persist} from "zustand/middleware";
import {createZustandContext} from "@/store/zustand-context";
import {useContext} from "react";
import {useStore} from "zustand";

type StateType = {
    generating: boolean;
    setGenerating: (generating: boolean) => void;
}

const getStore = (initialState: { generating: boolean }) => {
    return createStore<StateType>()(
        persist(
            (set) => ({
                generating: initialState.generating,
                setGenerating: (generating: boolean) => set({generating})
            }),
            {name: "image-store", storage: createJSONStorage(() => localStorage)}
        )
    )
}

export const ImageStore = createZustandContext(getStore);

export function useImageStore<T>(selector: (state: StateType) => T) {
    const store = useContext(ImageStore.Context)

    if (!store) {
        throw new Error("Missing image store provider");
    }

    return useStore(store, selector)
}