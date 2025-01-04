'use client'

import React from 'react';
import {type Layer, useLayerStore} from "@/store/layer-store";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Ellipsis, Trash} from "lucide-react";

function LayerInfo({layer, layerIndex}: { layer: Layer, layerIndex: number }) {
    const layers = useLayerStore((state) => state.layers)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const removeLayer = useLayerStore((state) => state.removeLayer)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size='icon'>
                    <Ellipsis size={14}/>
                </Button>
            </DialogTrigger>
            <DialogContent className="text-xs max-w-[340px] md:max-w-[425px]">
                <DialogTitle className='pt-2 md:pt-4'>Layer {layer.id}</DialogTitle>
                <div className="py-4 space-y-0.5">
                    <p>
                        <span className="font-bold">Filename:</span> {layer.name}
                    </p>
                    <p>
                        <span className="font-bold">Format:</span> {layer.format}
                    </p>
                    <p>
                        <span className="font-bold"> Size:</span> {layer.width}X
                        {layer.height}
                    </p>
                </div>
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        setActiveLayer(layerIndex === 0 ? layers[1].id : layers[0].id)
                        removeLayer(layer.id)
                    }}
                    variant={"destructive"}
                    className="flex items-center gap-2 w-full"
                >
                    <span> Delete Layer</span>
                    <Trash size={14}/>
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default LayerInfo;