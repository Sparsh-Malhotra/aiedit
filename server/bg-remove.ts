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

const BgRemoveSchema = z.object({
    activeImage: z.string(),
    format: z.string()
})

export const bgRemove = actionClient
    .schema(BgRemoveSchema)
    .action(async ({parsedInput: {format, activeImage}}) => {
        const image = activeImage.split(format)
        const pngImage = image[0] + 'png'
        const parts = pngImage.split('/upload/')
        const bgRemoveUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`

        let isProcessed = false
        const maxAttempts = 50
        const delay = 500

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            isProcessed = await checkImageProcessing(bgRemoveUrl)
            if (isProcessed) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay))
        }

        if (!isProcessed) {
            throw new Error('Image processing timed out');
        }

        return {success: bgRemoveUrl}
    })