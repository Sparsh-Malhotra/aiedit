'use client'

import {useImageStore} from "@/store/image-store";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import loadingAnimation from '@/public/assets/loading.json'
import {useLayerStore} from "@/store/layer-store";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {ssr: false});

function Loader() {
    const generating = useImageStore((state) => state.generating)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    return (
        <Dialog open={generating} onOpenChange={setGenerating}>
            <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle>{activeLayer.name}</DialogTitle>
                    <DialogDescription>
                        Please note that this operation might take up to a couple of
                        seconds.
                    </DialogDescription>
                </DialogHeader>
                <Lottie className="w-36" animationData={loadingAnimation}/>
            </DialogContent>
        </Dialog>
    )
}

export default Loader;