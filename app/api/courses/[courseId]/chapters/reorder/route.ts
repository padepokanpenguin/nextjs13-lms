import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params } : { params: { courseId: string } }) {
    try {
        const { userId } = auth()
        
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        
        const { list } = await req.json()

        const courseOwner = await db.course.findUnique({where: { id: params.courseId, userId }})

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        
        for(let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        }
        
        return NextResponse.json({message: 'Course\'s chapter has been updated successfully' }, {status: 200})
    } 
    catch (error) {
        console.log('CHAPTER REORDER', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}