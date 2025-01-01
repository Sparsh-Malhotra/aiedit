'use server'

import {v2 as cloudinary} from 'cloudinary';
import z from 'zod';
import {actionClient} from "@/lib/action-client";
import {UploadResultType} from "@/server/types";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const UploadImageSchema = z.object({
    formData: z.instanceof(FormData)
})

export const uploadImage = actionClient
    .schema(UploadImageSchema)
    .action(async ({parsedInput: {formData}}): Promise<UploadResultType> => {
        const image = formData.get('image') as File;

        if (!formData || !image) {
            return {error: 'Please upload an image'};
        }

        try {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new Promise<UploadResultType>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'aiedit'
                }, (error, result) => {
                    if (error || !result) {
                        return reject({error: 'Failed to upload image'});
                    } else {
                        resolve({success: result});
                    }
                })
                uploadStream.end(buffer);
            })
        } catch (error) {
            console.error(error);
            return {error: 'Failed to upload image'};
        }
    })
