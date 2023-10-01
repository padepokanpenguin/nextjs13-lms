import { IconBadge } from "@/components/icon-badge"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react"
import { redirect } from "next/navigation"
import TitleForm from "./_component/title-form"
import DescriptionForm from "./_component/description-form"
import ImageForm from "./_component/image-form"
import CategoryForm from "./_component/category-form"
import PriceForm from "./_component/price-form"
import AttachmentForm from "./_component/attachment-form"
import ChapterForm from "./_component/chapter-form"
import Banner from "@/components/banner"
import Actions from "./_component/action"

const CourseDetailPage = async ({params}: {params: { courseId: string }}) => {
    const { userId } = auth()

    
    const course = await db.course.findUnique({ where: { id: params.courseId }, 
        include: { attachments: { orderBy: { createdAt: 'desc' } }, 
        chapters: { orderBy: { position: 'asc' } } },
    })
    
    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    if (!userId || !course) {
        return redirect('/')
    }

    const requiredFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId, course.chapters.some(chapter => chapter.isPublished)]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean);
    return (
    <>
        {!course.isPublished && <Banner label="This course is unpublished. It will not be visible to the students" />}
        <div className="p-6 ">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm  text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
                <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished}  />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-2xl">Customize your course</h2>
                    </div>
                    <TitleForm course={course} />
                    <DescriptionForm course={course} />
                    <ImageForm course={course} />
                    <CategoryForm course={course} options={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                    }))} />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">Course Chaptes</h2>
                        </div>
                        <ChapterForm course={course} />
                    </div>
                    <div>
                        <div className="flex items-center  gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm course={course} />
                    </div>
                    <div>
                        <div className="flex items-center  gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm course={course} />
                    </div>
                </div>
            </div>
        </div>
    </>
    ) 
}


export default CourseDetailPage