'use client'

import React, {useState} from 'react';
import {useImageStore} from "@/store/image-store";
import {useLayerStore} from "@/store/layer-store";
import {Button} from "@/components/ui/button";
import {Eraser} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {genRemove} from "@/server/gen-remove";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

function GenRemove() {
    const generating = useImageStore((state) => state.generating)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const [open, setOpen] = useState(false)
    const [activeTag, setActiveTag] = useState('')

    const handleRemove = async () => {
        setGenerating(true)
        const res = await genRemove({
            activeImage: activeLayer.url!,
            prompt: activeTag,
        })
        if (res?.data?.success) {
            setGenerating(false)
            const newLayerId = crypto.randomUUID()
            addLayer({
                id: newLayerId,
                url: res.data.success,
                format: activeLayer.format,
                height: activeLayer.height,
                width: activeLayer.width,
                name: "genRemoved_" + activeLayer.name,
                publicId: activeLayer.publicId,
                resourceType: "image",
            })
            setActiveLayer(newLayerId)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="p-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Content Aware Delete <Eraser size={20}/>
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-md">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Smart AI Remove</h4>
                        <p className="text-sm text-muted-foreground">
                            Generative Remove any part of the image
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <h3 className="text-xs">Suggested selections</h3>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Selection</Label>
                            <Input
                                className="col-span-2 h-8"
                                value={activeTag}
                                name="tag"
                                onChange={(e) => {
                                    setActiveTag(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    className="w-full mt-4"
                    disabled={!activeTag || !activeLayer.url || generating}
                    onClick={handleRemove}
                >
                    Magic Remove 🎨
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default GenRemove;