"use client"

import {useImageStore} from "@/store/image-store";
import {Button} from "@/components/ui/button"
import {Image as ImageIcon} from "lucide-react"
import {toast} from "sonner"
import {useLayerStore} from "@/store/layer-store";
import {bgRemove} from "@/server/bg-remove";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";

export default function BgRemove() {
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const generating = useImageStore((state) => state.generating)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const [open, setOpen] = useState(false)

    const handleRemoveBackground = async () => {
        try {
            setGenerating(true)
            const res = await bgRemove({
                activeImage: activeLayer.url!,
                format: activeLayer.format!,
            })
            if (res?.data?.success) {
                const newLayerId = crypto.randomUUID()
                addLayer({
                    id: newLayerId,
                    name: "bg-removed" + activeLayer.name,
                    format: "png",
                    height: activeLayer.height,
                    width: activeLayer.width,
                    url: res.data.success,
                    publicId: activeLayer.publicId,
                    resourceType: "image",
                })
                setActiveLayer(newLayerId)
                setOpen(false)
            }
            if (res?.serverError) {
                toast.error(res.serverError)
                setGenerating(false)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'API credits exhausted. Please try again tomorrow.')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        BG Removal
                        <ImageIcon size={18}/>
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-md">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Background Removal</h4>
                        <p className="text-sm max-w-xs text-muted-foreground">
                            Remove the background of an image with one simple click.
                        </p>
                    </div>
                </div>

                <Button
                    disabled={!activeLayer?.url || generating}
                    className="w-full mt-4"
                    onClick={handleRemoveBackground}
                >
                    {generating ? "Removing..." : "Remove Background"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}