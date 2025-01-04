"use client"

import {Button} from "../ui/button"
import {Dialog, DialogContent, DialogTrigger} from "../ui/dialog"
import {Download} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "../ui/card"
import {useCallback, useState} from "react"
import {cn} from "@/lib/utils"
import {useLayerStore} from "@/store/layer-store";
import {toast} from "sonner";

export default function ExportAsset({resource}: { resource: string }) {
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const [selected, setSelected] = useState("original")
    const [downloading, setDownloading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDownload = useCallback(async () => {
        if (activeLayer?.publicId) {
            try {
                setDownloading(true);
                const response = await fetch(
                    `/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`,
                    {
                        method: 'GET',
                    }
                );

                if (!response.ok) {
                    throw new Error('Download failed');
                }

                // Get the filename from the content-disposition header or use a default
                const contentDisposition = response.headers.get('content-disposition');
                const filename = contentDisposition
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                    : `${activeLayer.name}.${activeLayer.format}`;

                // Create a blob from the response
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
                setOpen(false);
                toast.success('Download completed successfully');
            } catch (error) {
                console.error('Download failed:', error);
                toast.error('Failed to download file');
            } finally {
                setDownloading(false);
            }
        }
    }, [activeLayer, selected]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Export
                        <Download size={18}/>
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90%] sm:max-w-md'>
                <div>
                    <h3 className="text-center text-2xl font-medium pb-4">Export</h3>
                    <div className="flex flex-col gap-4">
                        <Card
                            onClick={() => setSelected("original")}
                            className={cn(
                                selected === "original" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Original</CardTitle>
                                <CardDescription>
                                    {activeLayer.width}X{activeLayer.height}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            onClick={() => setSelected("large")}
                            className={cn(
                                selected === "large" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Large</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.7).toFixed(0)}X
                                    {(activeLayer.height! * 0.7).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            onClick={() => setSelected("medium")}
                            className={cn(
                                selected === "medium" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Medium</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.5).toFixed(0)}X
                                    {(activeLayer.height! * 0.5).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            className={cn(
                                selected === "small" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                            onClick={() => setSelected("small")}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Small</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.3).toFixed(0)}X
                                    {(activeLayer.height! * 0.3).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Button
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    {downloading ? 'Downloading...' : `Download ${selected} ${resource}`}
                </Button>
            </DialogContent>
        </Dialog>
    )
}