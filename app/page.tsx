"use client"

import Editor from "@/components/Editor";
import {Toaster} from "sonner";
import {LayerStoreProvider} from "@/store/layer-store";
import {ImageStoreProvider} from "@/store/image-store";
import { generateId } from "@/lib/utils";

export default function Home() {
    return (
        <>
            <Toaster/>
            <LayerStoreProvider
                initialState={{
                    layerComparisonMode: false,
                    layers: [
                        {
                            id: generateId(),
                            url: "",
                            height: 0,
                            width: 0,
                            publicId: "",
                        },
                    ],
                }}
            >
                <ImageStoreProvider initialState={{generating: false}}>
                    <main className="h-full">
                        <Editor/>
                    </main>
                </ImageStoreProvider>
            </LayerStoreProvider>
        </>
    );
}
