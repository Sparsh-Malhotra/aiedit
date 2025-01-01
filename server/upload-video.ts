"use server";

import {UploadApiResponse, v2 as cloudinary} from "cloudinary";
import z from "zod";
import {actionClient} from "@/lib/action-client";

cloudinary.config({
    cloud_name: "restyled",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const formData = z.object({
    video: z.instanceof(FormData),
});

type UploadResult =
    | { success: UploadApiResponse; error?: never }
    | { error: string; success?: never };

export const uploadVideo = actionClient
    .schema(formData)
    .action(async ({parsedInput: {video}}): Promise<UploadResult> => {
        const formVideo = video.get("video");

        if (!formVideo) return {error: "No video provided"};

        const file = formVideo as File;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString("base64");
            const fileUri = `data:${file.type};base64,${base64Data}`;

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                cloudinary.uploader
                    .upload(fileUri, {
                        resource_type: "video",
                        use_filename: true,
                        unique_filename: false,
                        filename_override: file.name,
                        folder: "aiedit",
                        invalidate: true,
                    })
                    .then(resolve)
                    .catch(reject);
            });

            return {success: result};
        } catch (error) {
            console.error("Error processing video upload:", error);
            return {error: "Failed to upload video"};
        }
    });
