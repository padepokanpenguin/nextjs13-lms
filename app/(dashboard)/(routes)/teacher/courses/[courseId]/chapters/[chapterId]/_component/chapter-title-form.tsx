'use client'

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { Chapter } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ChapterTitleFormProps {
    chapter: Chapter
}

const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChapterTitleForm({chapter}: ChapterTitleFormProps) {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: chapter
    })

    const {isSubmitting, isValid} = form.formState

    function toggleEditing() {
        setIsEditing(current => !current)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.patch(`/api/courses/${chapter.courseId}/chapters/${chapter.id}`, values);
            toast.success('Chapter updated')
            toggleEditing()
            router.refresh()
        } 
        catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Title
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? (<>Cancel</> ) : <><Pencil className="h-4 w-4 mr-2" /> Edit Title</>}
                </Button>
            </div>
            {!isEditing && <p className="text-sm mt-2">{chapter.title}</p>}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                disabled={isSubmitting}
                                placeholder="e.g. 'Introduction to the course'"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button type='submit' disabled={!isValid || isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
                )}
        </div>
    )
}