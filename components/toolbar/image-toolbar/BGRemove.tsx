"use client"

import {useImageStore} from "@/store/image-store";
import {Button} from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Image as ImageIcon} from "lucide-react"
import {toast} from "sonner"
import {useLayerStore} from "@/store/layer-store";
import {bgRemove} from "@/server/bg-remove";

export default function BgRemove() {
    // const activeTag = useImageStore((state) => state.activeTag)
    // const activeColor = useImageStore((state) => state.activeColor)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const generating = useImageStore((state) => state.generating)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

    return (
        <Popover>
            <PopoverTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Removal
            <ImageIcon size={18}/>
          </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Background Removal</h4>
                        <p className="text-sm max-w-xs text-muted-foreground">
                            Remove the background of an image with one simple click.
                        </p>
                    </div>
                </div>

                <Button
                    disabled={
                        // !activeLayer?.url || !activeTag || !activeColor || generating
                        !activeLayer?.url || generating
                    }
                    className="w-full mt-4"
                    onClick={async () => {
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
                            setGenerating(false)
                            setActiveLayer(newLayerId)
                        }
                        if (res?.serverError) {
                            toast.error(res.serverError)
                            setGenerating(false)
                        }
                    }}
                >
                    {generating ? "Removing..." : "Remove Background"}
                </Button>
            </PopoverContent>
        </Popover>
    )
}