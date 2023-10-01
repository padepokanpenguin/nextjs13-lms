'use client'

import { Category } from "@prisma/client"
import {FcEngineering, FcBusinessman, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode} from "react-icons/fc"
import { IconType } from "react-icons"
import CategoryItem from "./category-item"


interface CategoryProps {
    items: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Business": FcBusinessman,
    "Engineering": FcEngineering,
}

export default function Categories({items}: CategoryProps) {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map(item => (
                <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
            ))}
        </div>
    )
}