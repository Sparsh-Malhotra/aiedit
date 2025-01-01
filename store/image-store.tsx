"use client";

import {createStore} from "zustand";
import {createContext, useContext, useRef} from "react";
import {useStore} from "zustand";

type StateType = {
    generating: boolean;
    setGenerating: (generating: boolean) => void;
};

const createImageStore = (initialState: { generating: boolean }) => {
    return createStore<StateType>((set) => ({
        generating: initialState.generating,
        setGenerating: (generating: boolean) => set({generating}),
    }));
};

export const ImageStoreContext = createContext<ReturnType<typeof createImageStore> | null>(null);

export function ImageStoreProvider({
                                       children,
                                       initialState,
                                   }: {
    children: React.ReactNode;
    initialState: { generating: boolean };
}) {
    const storeRef = useRef<ReturnType<typeof createImageStore>>();
    if (!storeRef.current) {
        storeRef.current = createImageStore(initialState);
    }
    return (
        <ImageStoreContext.Provider value={storeRef.current}>
            {children}
        </ImageStoreContext.Provider>
    );
}

export function useImageStore<T>(selector: (state: StateType) => T) {
    const store = useContext(ImageStoreContext);
    if (!store) throw new Error("Missing ImageStoreProvider");
    return useStore(store, selector);
}