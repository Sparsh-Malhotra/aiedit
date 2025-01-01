import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function checkImageProcessing(url: string) {
    try {
        const res = await fetch(url)
        return res.ok;
    } catch (error) {
        console.error(error)
        return false
    }
}

export function generateId(): string {
    if (typeof window !== 'undefined') {
        return crypto.randomUUID();
    }

    // Server-side fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}