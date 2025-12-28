"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2 h-8 w-8"
            aria-label="Go back"
        >
            <ArrowLeft className="h-4 w-4" />
        </Button>
    )
}
