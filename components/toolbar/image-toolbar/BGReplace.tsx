import React, {useState} from 'react';
import {useImageStore} from "@/store/image-store";
import {useLayerStore} from "@/store/layer-store";
import {Button} from "@/components/ui/button";
import {ImageOff} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {replaceBackground} from "@/server/bg-replace";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "sonner";

function BgReplace() {
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const generating = useImageStore((state) => state.generating)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState("")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        AI BG Replace
                        <ImageOff size={18}/>
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-md">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            Generative Background Replace
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Replace the background of your image with AI-generated content.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="prompt">Prompt (optional)</Label>
                            <Input
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the new background"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </div>
                <Button
                    disabled={!activeLayer?.url || generating}
                    className="w-full mt-4"
                    onClick={async () => {
                        try {
                            setGenerating(true)
                            const res = await replaceBackground({
                                prompt: prompt,
                                activeImage: activeLayer.url!,
                            })

                            if (res?.data?.success) {
                                const newLayerId = crypto.randomUUID()
                                addLayer({
                                    id: newLayerId,
                                    name: "bg-replaced-" + activeLayer.name,
                                    format: activeLayer.format,
                                    height: activeLayer.height,
                                    width: activeLayer.width,
                                    url: res.data.success,
                                    publicId: activeLayer.publicId,
                                    resourceType: "image",
                                })
                                setActiveLayer(newLayerId)
                                setOpen(false)
                            }
                        } catch (error) {
                            toast.error(error instanceof Error ? error.message : 'API credits exhausted. Please try again tomorrow.')
                        } finally {
                            setGenerating(false)
                        }
                    }}
                >
                    {generating ? "Generating..." : "Replace Background"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default BgReplace;