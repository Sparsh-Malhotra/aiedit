"use client"

import {Button} from "@/components/ui/button"
import {useState} from "react"
import {toast} from "sonner"
import {initiateTranscription} from "@/server/transcribe"
import {Captions} from "lucide-react"
import {useLayerStore} from "@/store/layer-store";
import {useImageStore} from "@/store/image-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function VideoTranscription() {
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const updateLayer = useLayerStore((state) => state.updateLayer)
    const [transcribing, setTranscribing] = useState(false)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const [open, setOpen] = useState(false)

    const handleTranscribe = async () => {
        if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
            toast.error("Please select a video layer first")
            return
        }

        setTranscribing(true)
        setGenerating(true)

        try {
            const result = await initiateTranscription({
                publicId: activeLayer.publicId,
            })

            if (result) {
                if (result.data && "success" in result.data) {
                    toast.success(result.data.success)
                    if (result.data.subtitledVideoUrl) {
                        updateLayer({
                            ...activeLayer,
                            transcriptionURL: result.data.subtitledVideoUrl,
                        })
                        setActiveLayer(activeLayer.id)
                    }
                    setOpen(false)
                } else if (result.data && "error" in result.data) {
                    toast.error('Hey 😅 Google just made their AI Video Transcription a paid feature. We\'re looking into alternatives to keep this feature accessible.')
                } else {
                    toast.error("Unexpected response from server")
                }
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'API credits exhausted. Please try again tomorrow.')
            console.error("Transcription error:", error)
        } finally {
            setTranscribing(false)
            setGenerating(false)
        }
    }

    if (activeLayer.transcriptionURL) {
        return (
            <Button className="py-8 w-full" variant="outline" asChild>
                <a
                    href={activeLayer.transcriptionURL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        View Transcription
                        <Captions size={18}/>
                    </span>
                </a>
            </Button>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="py-8 w-full"
                    disabled={transcribing || activeLayer.resourceType !== "video"}
                    variant="outline"
                >
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        {transcribing ? "Transcribing..." : "Transcribe"}
                        <Captions size={18}/>
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Video Transcription</DialogTitle>
                    <DialogDescription>
                        Generate subtitles and transcription for your video using AI.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This will analyze your video and generate:
                    </p>
                    <ul className="list-disc pl-4 text-sm space-y-2">
                        <li>Subtitles embedded in the video</li>
                        <li>Text transcription of all spoken content</li>
                        <li>Timestamped captions</li>
                    </ul>

                    <Button
                        className="w-full"
                        onClick={handleTranscribe}
                        disabled={transcribing}
                    >
                        {transcribing ? "Processing..." : "Start Transcription"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}