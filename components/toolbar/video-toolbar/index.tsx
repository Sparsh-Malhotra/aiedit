"use client"

import {useLayerStore} from "@/store/layer-store";
import VideoTranscription from "@/components/toolbar/video-toolbar/VideoTranscription";
import SmartCrop from "@/components/toolbar/video-toolbar/SmartCrop";

export default function VideoToolbar() {
    const activeLayer = useLayerStore((state) => state.activeLayer)
    if (activeLayer.resourceType === "video")
        return (
            <>
                <VideoTranscription/>
                <SmartCrop/>
            </>
        )
}