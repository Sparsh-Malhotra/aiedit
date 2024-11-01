import React from 'react';
import UploadImage from "@/components/upload/UploadImage";
import Layers from "@/components/Layers";
import ModeToggle from "@/components/theme/ModeToggle";


function Editor() {
    return (
        <div className='flex h-full'>
            <div className='py-6 px-4 basis-[240px] shrink-0'>
                <div className='pb-12 text-center'>
                    <ModeToggle/>
                </div>
            </div>
            <UploadImage/>
            <Layers/>
        </div>
    );
}

export default Editor;