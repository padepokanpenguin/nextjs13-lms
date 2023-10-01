'use client'

import { UserButton, useAuth } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { SearchInput } from "./search-input"

import { isTeacher } from "@/lib/teacher"

export default function NavbarRoutes() {
    const pathname = usePathname()
    const { userId } = useAuth();
    
    const isTeacherPage = pathname?.startsWith('/teacher')
    const isPlayerPage= pathname?.includes('/chapter')
    const isSearchPage = pathname?.includes('/search')
    return (
    <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto ">
            {isTeacherPage || isPlayerPage ? (
                <Link href={'/'}>
                    <Button size={"sm"} variant={"ghost"}>
                        <LogOut />
                        Exit
                    </Button>
                </Link>
            ) : isTeacher(userId) ? (
                <Link href={'/teacher/courses'}>
                    <Button size={"sm"} variant={"ghost"}>
                        Teacher Mode
                    </Button>
                </Link>
            ) : null }
            <UserButton
            afterSignOutUrl="/"
            />
        </div>
    </>
    )
}