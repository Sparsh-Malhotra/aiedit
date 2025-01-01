"use client";

import {createStore} from "zustand";
import {createContext, useContext, useRef} from "react";
import {useStore} from "zustand";

export type Layer = {
    publicId?: string;
    width?: number;
    height?: number;
    url?: string;
    id: string;
    name?: string;
    format?: string;
    poster?: string;
    resourceType?: string;
    transcriptionURL?: string;
};

type State = {
    layers: Layer[];
    addLayer: (layer: Layer) => void;
    removeLayer: (id: string) => void;
    setActiveLayer: (id: string) => void;
    activeLayer: Layer;
    updateLayer: (layer: Layer) => void;
    setPoster: (id: string, posterUrl: string) => void;
    setTranscription: (id: string, transcriptionURL: string) => void;
    layerComparisonMode: boolean;
    setLayerComparisonMode: (mode: boolean) => void;
    comparedLayers: string[];
    setComparedLayers: (layers: string[]) => void;
    toggleComparedLayer: (id: string) => void;
};

const createLayerStore = (initialState: {
    layers: Layer[];
    layerComparisonMode: boolean;
}) => {
    return createStore<State>((set) => ({
        layers: initialState.layers,
        addLayer: (layer) =>
            set((state) => ({
                layers: [...state.layers, {...layer}],
            })),
        removeLayer: (id: string) =>
            set((state) => ({
                layers: state.layers.filter((l) => l.id !== id),
            })),
        setActiveLayer: (id: string) =>
            set((state) => ({
                activeLayer: state.layers.find((l) => l.id === id) || state.layers[0],
            })),
        activeLayer: initialState.layers[0],
        updateLayer: (layer) =>
            set((state) => ({
                layers: state.layers.map((l) => (l.id === layer.id ? layer : l)),
            })),
        setPoster: (id: string, posterUrl: string) =>
            set((state) => ({
                layers: state.layers.map((l) =>
                    l.id === id ? {...l, poster: posterUrl} : l
                ),
            })),
        setTranscription: (id: string, transcriptionURL: string) =>
            set((state) => ({
                layers: state.layers.map((l) =>
                    l.id === id ? {...l, transcriptionURL} : l
                ),
            })),
        layerComparisonMode: initialState.layerComparisonMode,
        setLayerComparisonMode: (mode: boolean) =>
            set(() => ({
                layerComparisonMode: mode,
                comparedLayers: mode ? [] : [],
            })),
        comparedLayers: [],
        setComparedLayers: (layers: string[]) =>
            set(() => ({
                comparedLayers: layers,
                layerComparisonMode: layers.length > 0,
            })),
        toggleComparedLayer: (id: string) =>
            set((state) => {
                const newComparedLayers = state.comparedLayers.includes(id)
                    ? state.comparedLayers.filter((layerId) => layerId !== id)
                    : [...state.comparedLayers, id].slice(-2);
                return {
                    comparedLayers: newComparedLayers,
                    layerComparisonMode: newComparedLayers.length > 0,
                };
            }),
    }));
};

export const LayerStoreContext = createContext<ReturnType<typeof createLayerStore> | null>(null);

export function LayerStoreProvider({
                                       children,
                                       initialState,
                                   }: {
    children: React.ReactNode;
    initialState: { layers: Layer[]; layerComparisonMode: boolean };
}) {
    const storeRef = useRef<ReturnType<typeof createLayerStore>>();
    if (!storeRef.current) {
        storeRef.current = createLayerStore(initialState);
    }
    return (
        <LayerStoreContext.Provider value={storeRef.current}>
            {children}
        </LayerStoreContext.Provider>
    );
}

export function useLayerStore<T>(selector: (state: State) => T) {
    const store = useContext(LayerStoreContext);
    if (!store) throw new Error("Missing LayerStoreProvider");
    return useStore(store, selector);
}