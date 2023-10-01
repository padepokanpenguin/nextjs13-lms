'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form' 

import { Form, FormControl, FormField,  FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Course } from "@prisma/client";
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'

interface PriceFormProps {
    course: Course
}

const formSchema = z.object({
    price: z.coerce.number(),
})

export default function PriceForm({course}: PriceFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: course?.price || undefined,
        }
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
            Course Price
            <Button onClick={toggleEditing} variant="ghost">
                {isEditing && <>Cancel</>}
                {!isEditing && <><Pencil className='h-4 w-4 mr-2' /> Edit price</>}
            </Button>
        </div>
        {!isEditing && <p className={cn('text-sm mt-2', !course.description && 'text-slate-500 italic')}>{ course.price ? formatPrice(course.price) : 'No price'}</p>}
        {isEditing && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField control={form.control} name='price' render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  disabled={isSubmitting}
                                  placeholder="Set a price for your course"
                                  {...field}
                                />

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