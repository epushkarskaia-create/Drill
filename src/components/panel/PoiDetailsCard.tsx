"use client";

import { getPoiById } from "@/data/rig";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export function PoiDetailsCard() {
  const activePoiId = useAppStore((s) => s.activePoiId);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const poi = activePoiId ? getPoiById(activePoiId) : null;

  if (!poi) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center text-neutral-600">
        <p className="text-sm">Select a hotspot on the rig to view details.</p>
        <p className="text-xs">Click any POI marker in the viewer.</p>
      </div>
    );
  }

  const handleDownload = () => {
    window.open(`/api/download?doc=sample-spec.pdf`, "_blank");
    setDownloadOpen(false);
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] text-neutral-900">
      <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{poi.title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{poi.description}</p>
        </div>
        {poi.specs.length > 0 && (
          <>
            <div className="border-t border-neutral-200 pt-4" />
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {poi.specs.map((s) => (
                  <div key={s.key} className="flex justify-between gap-2">
                    <span className="text-neutral-600">{s.label}</span>
                    <span className="text-neutral-900">{s.value} {s.unit ?? ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {poi.media.length > 0 && (
          <>
            <div className="border-t border-neutral-200 pt-4" />
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">Media</h4>
              <div className="flex gap-2 overflow-auto">
                {poi.media.map((m, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <Image
                      src={m.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {poi.docs.length > 0 && (
          <>
            <div className="border-t border-neutral-200 pt-4" />
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">Documents</h4>
              <ul className="space-y-1">
                {poi.docs.map((d, i) => (
                  <li key={i}>
                    <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 rounded-xl bg-neutral-100 border border-neutral-200 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-200"
                        >
                          <FilePdf className="size-4" />
                          {d.title}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-neutral-200 bg-white text-neutral-900">
                        <DialogHeader>
                          <DialogTitle>Download</DialogTitle>
                          <DialogDescription className="text-neutral-600">
                            Download &quot;{d.title}&quot;?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDownloadOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleDownload}>Download</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
