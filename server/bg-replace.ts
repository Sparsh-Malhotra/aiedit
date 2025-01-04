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

const BGReplaceSchema = z.object({
    activeImage: z.string(),
    prompt: z.string()
})

export const replaceBackground = actionClient
    .schema(BGReplaceSchema)
    .action(async ({parsedInput: {prompt, activeImage}}) => {
        const parts = activeImage.split("/upload/")
        const bgReplaceUrl = prompt
            ? `${
                parts[0]
            }/upload/e_gen_background_replace:prompt_${encodeURIComponent(
                prompt
            )}/${parts[1]}`
            : `${parts[0]}/upload/e_gen_background_replace/${parts[1]}`

        // Poll the URL to check if the image is processed
        let isProcessed = false
        const maxAttempts = 50
        const delay = 1000 // 1 second
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            isProcessed = await checkImageProcessing(bgReplaceUrl)
            if (isProcessed) {
                break
            }
            await new Promise((resolve) => setTimeout(resolve, delay))
        }

        if (!isProcessed) {
            throw new Error("Image processing timed out")
        }
        console.log(bgReplaceUrl)
        return {success: bgReplaceUrl}
    })