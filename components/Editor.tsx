import React from 'react';
import Layers from "@/components/Layers";
import ModeToggle from "@/components/theme/ModeToggle";
import ActiveImage from "@/components/ActiveImage";
import UploadForm from "@/components/upload/UploadForm";
import {useLayerStore} from "@/store/layer-store";
import ImageToolbar from "@/components/toolbar/image-toolbar";
import Loader from "@/components/Loader";
import VideoToolbar from "@/components/toolbar/video-toolbar";
import ExportAsset from "@/components/toolbar/Export";


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
                    {activeLayer.resourceType === "video" ? <VideoToolbar/> : null}
                    <ExportAsset resource={activeLayer.resourceType!}/>
                </div>
            </div>
            <UploadForm/>
            <ActiveImage/>
            <Layers/>
            <Loader/>
        </div>
    );
}

export default Editor;