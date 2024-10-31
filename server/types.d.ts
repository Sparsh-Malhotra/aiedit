import type {UploadApiResponse} from 'cloudinary';

export type UploadResultType = { success: UploadApiResponse; error?: never } | { error: string, success?: never }