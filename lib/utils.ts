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