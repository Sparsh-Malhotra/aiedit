import React from 'react';
import Layers from "@/components/Layers";
import ModeToggle from "@/components/theme/ModeToggle";
import ActiveImage from "@/components/ActiveImage";
import UploadForm from "@/components/upload/UploadForm";


function Editor() {
    return (
        <div className='flex h-full'>
            <div className='py-6 px-4 basis-[240px] shrink-0'>
                <div className='pb-12 text-center'>
                    <ModeToggle/>
                </div>
            </div>
            <UploadForm/>
            <ActiveImage/>
            <Layers/>
        </div>
    );
}

export default Editor;