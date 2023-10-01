"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { UploadButton } from "@/lib/uploadthing";

interface ChapterVideoFormProps {
    chapter: Chapter & { muxData?: MuxData | null }
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export default function ChapterVideoForm  ({
  chapter
}: ChapterVideoFormProps)  {
  const [isEditing, setIsEditing] = useState(false);

    function toggleEditing() {
        setIsEditing(current => !current)
    }

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.patch(`/api/courses/${chapter.courseId}/chapters/${chapter.id}`, values);
            toast.success("Chapter updated");
            toggleEditing();
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
         Chapter video
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !chapter.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && chapter.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !chapter.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={chapter.muxData?.playbackId || ""} />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {chapter.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
            Videos can take a few minutes to process. Refresh the page if videos does not appear
        </div>
      )}
    </div>
  )
}