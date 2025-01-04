import {cn} from "@/lib/utils";
import {useDevice} from "@/lib/hooks/useDevice";

export function useLayerStyles() {
    const {isMobile} = useDevice();

    return {
        cardStyles: cn(
            "basis-[280px] shrink-0 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative flex flex-col shadow-2xl",
            isMobile ? "h-full border-none bg-transparent" : "scrollbar-thin scrollbar-track-secondary scrollbar-thumb-primary"
        ),

        headerStyles: cn(
            "sticky top-0 z-50 min-h-28 bg-card shadow-sm",
            isMobile ? "px-6 py-4 bg-transparent" : "px-4 py-6"
        ),

        layerItemStyles: (isActive: boolean) => cn(
            "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
            {
                "border-primary": isActive,
            },
            isMobile ? "px-6 py-3" : "px-4 py-2"
        ),

        footerStyles: cn(
            "sticky bottom-0 bg-card flex gap-2 shrink-0",
            isMobile ? "p-6 bg-transparent" : "p-4"
        )
    };
}