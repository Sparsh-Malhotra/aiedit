import React from 'react';
import {useDropzone} from "react-dropzone";
import {uploadImage} from "@/server/upload-image";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";

function UploadImage() {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
            "image/webp": [".webp"]
        },
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length) {
                const formData = new FormData();
                formData.append("image", acceptedFiles[0]);
                const objectUrl = URL.createObjectURL(acceptedFiles[0]);
                //TODO: STATE MANAGEMENT STUFF LATER
                const response = await uploadImage({formData})
                console.log(response)
            }
        }
    })

    return (
        <Card {...getRootProps()}
              className={cn(
                  " hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out ",
                  `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
              )}>
            <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
                <input {...getInputProps()}/>
                <div className="flex items-center flex-col justify-center gap-4">
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