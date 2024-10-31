"use client"

import Editor from "@/components/Editor";
import {ImageStore} from "@/store/image-store";
import {LayerStore} from "@/store/layer-store";

export default function Home() {
    return (
        <LayerStore.Provider initialValue={{
            layerComparisonMode: false,
            layers: []
        }}>
            <ImageStore.Provider initialValue={{generating: false}}>
                <main>
                    <Editor/>
                </main>
            </ImageStore.Provider>
        </LayerStore.Provider>
    );
}
