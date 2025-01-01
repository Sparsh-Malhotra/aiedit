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
    prompts: z.array(z.string()),
    activeImage: z.string(),
    multiple: z.boolean().optional(),
    mode: z.enum(["default", "mask"]).optional(),
    invert: z.boolean().optional(),
    format: z.string(),
})

export const extractPart = actionClient
    .schema(BgRemoveSchema)
    .action(async ({parsedInput: {prompts, activeImage, multiple, mode, invert, format}}) => {
        const form = activeImage.split(format)
        const pngConvert = form[0] + "png"
        const parts = pngConvert.split("/upload/")

        let extractParams = `prompt_(${prompts
            .map((p) => encodeURIComponent(p))
            .join(";")})`
        if (multiple) extractParams += ";multiple_true"
        if (mode === "mask") extractParams += ";mode_mask"
        if (invert) extractParams += ";invert_true"

        const extractUrl = `${parts[0]}/upload/e_extract:${extractParams}/${parts[1]}`

        // Poll the URL to check if the image is processed
        let isProcessed = false
        const maxAttempts = 20
        const delay = 1000 // 1 second
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            isProcessed = await checkImageProcessing(extractUrl)
            if (isProcessed) {
                break
            }
            await new Promise((resolve) => setTimeout(resolve, delay))
        }

        if (!isProcessed) {
            throw new Error("Image processing timed out")
        }
        console.log(extractUrl)
        return {success: extractUrl}
    })