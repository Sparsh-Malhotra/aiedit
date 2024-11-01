import React from 'react';
import Layers from "@/components/Layers";
import ModeToggle from "@/components/theme/ModeToggle";
import ActiveImage from "@/components/ActiveImage";
import UploadForm from "@/components/upload/UploadForm";
import {useLayerStore} from "@/store/layer-store";
import ImageToolbar from "@/components/toolbar/image-toolbar";


function Editor() {
    const activeLayer = useLayerStore((store) => store.activeLayer);

    return (
        <div className='flex h-full'>
            <div className='py-6 px-4 basis-[240px] shrink-0'>
                <div className='pb-12 text-center'>
                    <ModeToggle/>
                </div>
                <div className='flex flex-col gap-4'>
                    {activeLayer.resourceType === 'image' && <ImageToolbar/>}
                </div>
            </div>
            <UploadForm/>
            <ActiveImage/>
            <Layers/>
        </div>
    );
}

export default Editor;