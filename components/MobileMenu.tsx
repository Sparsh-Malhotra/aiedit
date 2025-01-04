import React from 'react';
import {Layers, Menu} from 'lucide-react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    side: 'left' | 'right';
    children: React.ReactNode;
}

export function MobileMenu({side, children}: MobileMenuProps) {
    const getSheetTitle = () => {
        switch (side) {
            case 'left':
                return 'Toolbar'
            case 'right':
                return 'Layers'
        }
    }

    return (
        <Sheet>
            <SheetTrigger className='bg-secondary w-fit'>
                <Button variant="ghost" size='icon'>
                    {side === 'left' ? <Menu/> : <Layers/>}
                </Button>
                <p className='text-sm'>{getSheetTitle()}</p>
            </SheetTrigger>
            <SheetContent side={side} className='overflow-y-auto'>
                <SheetHeader>
                    <VisuallyHidden>
                        <SheetTitle>{getSheetTitle()}</SheetTitle>
                    </VisuallyHidden>
                    <SheetDescription>
                        {children}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    );
}