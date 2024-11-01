"use client"

import Editor from "@/components/Editor";
import {ImageStore} from "@/store/image-store";
import {LayerStore} from "@/store/layer-store";
import {Toaster} from "sonner";

export default function Home() {
    return (
        <>
            <Toaster/>
            <LayerStore.Provider initialValue={{
                layerComparisonMode: false,
                layers: [
                    {
                        id: crypto.randomUUID(),
                        url: "",
                        height: 0,
                        width: 0,
                        publicId: "",
                    }
                ]
            }}>
                <ImageStore.Provider initialValue={{generating: false}}>
                    <main className='h-full'>
                        <Editor/>
                    </main>
                </ImageStore.Provider>
            </LayerStore.Provider>
        </>
    );
}
