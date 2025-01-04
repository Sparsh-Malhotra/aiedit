import React, {useMemo} from 'react';
import {useImageStore} from "@/store/image-store";
import {type Layer, useLayerStore} from "@/store/layer-store";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import LayerComparison from "@/components/layers/LayerComparison";
import {useDevice} from "@/lib/hooks/useDevice";
import {Button} from "@/components/ui/button";
import {Layers2} from "lucide-react";

function ActiveImage() {
    const {isMobile} = useDevice()
    const generating = useImageStore((state) => state.generating)
    const activeLayer = useLayerStore((store) => store.activeLayer)
    const layers = useLayerStore((store) => store.layers)
    const layerComparisonMode = useLayerStore(
        (state) => state.layerComparisonMode
    )
    const addLayer = useLayerStore((state) => state.addLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const comparedLayers = useLayerStore((state) => state.comparedLayers)

    const MButton = useMemo(() => motion(Button), [])

    if (!activeLayer?.url && comparedLayers.length === 0) return null;

    const handleCreateLayer = () => {
        const newLayerId = crypto.randomUUID();
        addLayer({
            id: newLayerId,
            url: "",
            height: 0,
            width: 0,
            publicId: "",
            name: "",
            format: "",
        });
        setActiveLayer(newLayerId);
    };

    const renderLayer = (layer: Layer) => {
        return <div className='w-full h-full relative flex items-center justify-center'>
            {layer.resourceType === "image" && (
                <Image
                    alt={layer.name || "Image"}
                    src={layer.url || ""}
                    fill={true}
                    className={cn(
                        "rounded-lg object-contain",
                        generating ? "animate-pulse" : ""
                    )}
                />
            )}
            {layer.resourceType === "video" && (
                <video
                    width={layer.width}
                    height={layer.height}
                    controls
                    className="rounded-lg object-contain max-w-full max-h-full"
                    src={layer.transcriptionURL || layer.url}
                />
            )}
        </div>
    }

    if (layerComparisonMode && comparedLayers.length > 0) {
        const comparisonLayers = comparedLayers
            .map((id) => layers.find((l) => l.id === id))
            .filter(Boolean) as Layer[]

        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="w-full relative h-svh p-8 md:p-24 bg-secondary flex flex-col items-center justify-center"
            >
                <LayerComparison layers={comparisonLayers}/>
            </motion.div>
        )
    }

    return (
        <div className="w-full relative h-full p-8 bg-secondary flex flex-col items-center justify-center">
            {renderLayer(activeLayer)}
            {isMobile &&
                <MButton
                    layout
                    onClick={handleCreateLayer}
                    variant="outline"
                    className="w-full flex gap-2 mt-4"
                >
                    <span className="text-xs">Create Layer</span>
                    <Layers2 className="text-secondary-foreground" size={18}/>
                </MButton>
            }
        </div>
    );
}

export default ActiveImage;