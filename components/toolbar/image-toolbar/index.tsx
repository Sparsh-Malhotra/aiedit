import React from 'react';
import GenRemove from "@/components/toolbar/image-toolbar/GenRemove";
import BgRemove from "@/components/toolbar/image-toolbar/BGRemove";
import BgReplace from "@/components/toolbar/image-toolbar/BGReplace";

function ImageToolbar() {
    return (
        <>
            <GenRemove/>
            <BgRemove/>
            <BgReplace/>
        </>
    );
}

export default ImageToolbar;