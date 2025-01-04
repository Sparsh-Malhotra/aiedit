import React, {useState} from 'react';
import Layers from "@/components/Layers";
import ModeToggle from "@/components/theme/ModeToggle";
import ActiveImage from "@/components/ActiveImage";
import UploadForm from "@/components/upload/UploadForm";
import {useLayerStore} from "@/store/layer-store";
import ImageToolbar from "@/components/toolbar/image-toolbar";
import Loader from "@/components/Loader";
import VideoToolbar from "@/components/toolbar/video-toolbar";
import ExportAsset from "@/components/toolbar/Export";
import {useDevice} from "@/lib/hooks/useDevice";
import {MobileMenu} from "@/components/MobileMenu";

function Editor() {
    const {isMobile, hasMounted} = useDevice();
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const activeLayer = useLayerStore((store) => store.activeLayer);

    if (!hasMounted) {
        return null;
    }

    const ToolbarContent = (
        <div className='flex flex-col gap-4'>
            {activeLayer.resourceType === 'image' && <ImageToolbar/>}
            {activeLayer.resourceType === "video" && <VideoToolbar/>}
            <ExportAsset resource={activeLayer.resourceType!}/>
        </div>
    );

    if (isMobile) {
        return (
            <div className='flex flex-col h-full bg-secondary'>
                <div className='flex items-center justify-between px-2'>

                    <MobileMenu
                        isOpen={leftMenuOpen}
                        onToggle={() => setLeftMenuOpen(!leftMenuOpen)}
                        side="left"
                    >
                        <div className='pb-12 text-center'>
                            <ModeToggle/>
                        </div>
                        {ToolbarContent}
                    </MobileMenu>

                    <MobileMenu
                        isOpen={rightMenuOpen}
                        onToggle={() => setRightMenuOpen(!rightMenuOpen)}
                        side="right"
                    >
                        <Layers/>
                    </MobileMenu>
                </div>

                <main className='h-full'>
                    <UploadForm/>
                    <ActiveImage/>
                </main>

                <Loader/>
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className='flex h-full'>
            <div className='py-6 px-4 basis-[240px] shrink-0'>
                <div className='pb-12 text-center'>
                    <ModeToggle/>
                </div>
                {ToolbarContent}
            </div>
            <UploadForm/>
            <ActiveImage/>
            <Layers/>
            <Loader/>
        </div>
    );
}

export default Editor;