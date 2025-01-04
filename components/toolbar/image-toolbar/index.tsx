import React from 'react';
import GenRemove from "@/components/toolbar/image-toolbar/GenRemove";
import BgRemove from "@/components/toolbar/image-toolbar/BGRemove";
import GenerativeFill from "@/components/toolbar/image-toolbar/GenerativeFill";
import ExtractPart from "@/components/toolbar/image-toolbar/ExtractPart";


function ImageToolbar() {
    return (
        <>
            <GenRemove/>
            <BgRemove/>
            {/*<BgReplace/>*/}
            <GenerativeFill/>
            <ExtractPart/>
        </>
    );
}

export default ImageToolbar;