'use server'

import {v2 as cloudinary} from 'cloudinary';
import z from 'zod';
import {actionClient} from "@/lib/action-client";
import {UploadResultType} from "@/server/types";

if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
    throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const UploadImageSchema = z.object({
    formData: z.instanceof(FormData)
});

export const uploadImage = actionClient
    .schema(UploadImageSchema)
    .action(async ({parsedInput: {formData}}): Promise<UploadResultType> => {
        const image = formData.get('image') as File;

        if (!formData || !image) {
            return {error: 'Please upload an image'};
        }

        try {
            const fileBuffer = await image.arrayBuffer();
            const base64Data = Buffer.from(fileBuffer).toString('base64');
            const fileUri = `data:${image.type};base64,${base64Data}`;

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(fileUri, {
                    folder: 'aiedit',
                    invalidate: true
                })
                    .then(resolve)
                    .catch(reject);
            });

            // @ts-ignore
            return {success: result};
        } catch (error) {
            console.error(error);
            return {error: 'Failed to upload image'};
        }
    });