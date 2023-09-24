'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form' 

import { Form, FormControl, FormField,  FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from "@prisma/client";

interface TitleFormProps {
    course: Course
}

const formSchema = z.object({
    title: z.string().min(1, {message: 'Title is required'})
})

export default function TitleForm({course}: TitleFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: course
    })

    const {isSubmitting, isValid} = form.formState

    function toggleEditing() {
        setIsEditing(current => !current)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      toast.success("Course updated");
      toggleEditing()
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  
    }
    
    return <div className='mt-6 border bg-slate-100  rounded-md p-4 '>
        <div className='font-medium flex items-center justify-between'>
            Course Title
            <Button onClick={toggleEditing} variant="ghost">
                {isEditing && <>Cancel</>}
                {!isEditing && <><Pencil className='h-4 w-4 mr-2' /> Edit title</>}
            </Button>
        </div>
        {!isEditing && <p className='text-sm mt-2'>{course.title}</p>}
        {isEditing && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField control={form.control} name='title' render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input disabled={isSubmitting} placeholder='e.g Advanced Web Development' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className='flex items-center gap-x-2'>
                        <Button type='submit' disabled={!isValid || isSubmitting}>
                            Save
                        </Button>
                    </div>
                </form>
            </Form>}
    </div>
}