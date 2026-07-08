"use client"

import { useRef } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { adminTheme } from "@/components/admin/admin-theme"
import { cn } from "@/lib/utils"

export function AdminConfirmButton({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "outline",
}: {
  children: React.ReactNode
  title: string
  description: string
  confirmLabel?: string
  variant?: "outline" | "destructive" | "destructive_invert" | "default" | "ghost" | "secondary" | "link" | "primary" | "warning" | "warning_invert"
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const triggerVariant = variant === "destructive" ? "ghost" : variant

  return (
    <>
      <button ref={buttonRef} type="submit" className="hidden" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size="sm"
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={cn("border bg-white shadow-2xl shadow-black/20", adminTheme.borderStrong)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn("border hover:bg-[#f1eee9]", adminTheme.border)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
              type="button"
              className={variant === "destructive" ? "bg-[#dc2626] text-white hover:bg-[#b91c1c]" : cn(adminTheme.primary, adminTheme.primaryHover)}
              onClick={() => buttonRef.current?.click()}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
