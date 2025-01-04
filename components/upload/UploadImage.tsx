import React from 'react';
import {useDropzone} from "react-dropzone";
import {uploadImage} from "@/server/upload-image";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useImageStore} from "@/store/image-store";
import {useLayerStore} from "@/store/layer-store";
import imageAnimation from '@/public/assets/image-upload.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {ssr: false});

function UploadImage() {
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const updateLayer = useLayerStore((state) => state.updateLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
            "image/webp": [".webp"]
        },
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length) {
                const formData = new FormData();
                formData.append("image", acceptedFiles[0]);
                const objectUrl = URL.createObjectURL(acceptedFiles[0]);

                setGenerating(true);
                updateLayer({
                    id: activeLayer.id,
                    url: objectUrl,
                    width: 0,
                    height: 0,
                    name: 'Uploading',
                    publicId: "",
                    format: '',
                    resourceType: 'image'
                });
                setActiveLayer(activeLayer.id);

                const response = await uploadImage({formData})
                console.log(response)
                if (response?.data?.success) {
                    updateLayer({
                        id: activeLayer.id,
                        url: response.data.success.url,
                        width: response.data.success.width,
                        height: response.data.success.height,
                        name: response.data.success.original_filename,
                        publicId: response.data.success.public_id,
                        format: response.data.success.format,
                        resourceType: response.data.success.resource_type,
                    })
                    setActiveLayer(activeLayer.id);
                }
                setGenerating(false);
            }
        }
    })

    if (!activeLayer.url)
        return (
            <Card {...getRootProps()}
                  className={cn(
                      " hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out ",
                      `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
                  )}>
                <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
                    <input {...getInputProps()}/>
                    <div className="flex items-center flex-col justify-center gap-4">
                        <Lottie className="h-48" animationData={imageAnimation}/>
                        <p className="text-muted-foreground text-2xl">
                            {isDragActive
                                ? "Drop your image here!"
                                : "Start by uploading an image"}
                        </p>
                        <p className="text-muted-foreground">
                            Supported Formats .jpeg .jpg .png .webp
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
}

export default UploadImage;