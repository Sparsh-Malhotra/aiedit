'use server'

import {v2 as cloudinary} from 'cloudinary';
import z from 'zod'
import {actionClient} from "@/lib/action-client";
import {checkImageProcessing} from "@/lib/utils";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const GenRemoveSchema = z.object({
    prompt: z.string(),
    activeImage: z.string()
})

export const genRemove = actionClient
    .schema(GenRemoveSchema)
    .action(async ({parsedInput: {activeImage, prompt}}) => {
        const parts = activeImage.split('/upload/')
        const removeUrl = `${parts[0]}/upload/e_gen_remove:${prompt}/${parts[1]}`

        let isProcessed = false
        const maxAttempts = 50
        const delay = 500

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            isProcessed = await checkImageProcessing(removeUrl)
            if (isProcessed) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay))
        }

        if (!isProcessed) {
            throw new Error('Image processing timed out');
        }

        return {success: removeUrl}
    })