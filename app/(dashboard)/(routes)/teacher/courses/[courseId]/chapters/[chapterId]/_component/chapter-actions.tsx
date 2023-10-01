"use client"

import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
};

export default function ChapterActions({disabled, courseId, chapterId, isPublished}: ChapterActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    
    async function onClick() {
        try {
            setIsLoading(true)

            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success('Chapter unpublished')
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success('Chapter published')
            }

            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    async function onDelete() {
        try {
            setIsLoading(true)
            // console.log('courseId', courseId)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            // await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success('Chapter deleted')

            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="flex items-center gap-x-2">
            <Button disabled={disabled || isLoading} onClick={onClick} variant="outline" size="sm">
                {isPublished ? 'Unpblish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>

        </div>
    )
}