'use client'

import React from 'react';
import {ReactCompareSlider, ReactCompareSliderImage} from "react-compare-slider";
import {type Layer} from "@/store/layer-store";

function LayerComparison({layers}: { layers: Layer[] }) {
    if (layers.length === 0) {
        return <div>No layers selected for comparison</div>
    }

    if (layers.length === 1) {
        return (
            <div className="h-full ">
                <ReactCompareSliderImage
                    src={layers[0].url || ""}
                    srcSet={layers[0].url || ""}
                    alt={layers[0].name || "Single image"}
                    className="rounded-lg object-contain"
                />
            </div>
        )
    }

    return (
        <ReactCompareSlider
            itemOne={
                <ReactCompareSliderImage
                    src={layers[0].url || ""}
                    srcSet={layers[0].url || ""}
                    alt={layers[0].name || "Image one"}
                    style={{
                        objectFit: 'contain'
                    }}
                />
            }
            itemTwo={
                <ReactCompareSliderImage
                    src={layers[1].url || ""}
                    srcSet={layers[1].url || ""}
                    alt={layers[1].name || "Image two"}
                    style={{
                        objectFit: 'contain'
                    }}
                />
            }
            className='h-[80vh]'
        />
    )
}

export default LayerComparison;