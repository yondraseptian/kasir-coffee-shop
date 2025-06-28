"use client"

import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export interface AlertMessageProps {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  description: string
  dismissible?: boolean
  onDismiss?: () => void
  actions?: ReactNode
  className?: string
}

const alertVariants = {
  default: {
    container: "border-gray-200 bg-gray-50 text-gray-800",
    icon: Info,
    iconColor: "text-gray-600",
    titleColor: "text-gray-800",
    descriptionColor: "text-gray-700",
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-800",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    descriptionColor: "text-green-700",
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
    descriptionColor: "text-yellow-700",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-800",
    icon: AlertCircle,
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    descriptionColor: "text-red-700",
  },
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    descriptionColor: "text-blue-700",
  },
}

export function AlertMessage({
  variant = "default",
  title,
  description,
  dismissible = false,
  onDismiss,
  actions,
  className,
}: AlertMessageProps) {
  const variantStyles = alertVariants[variant]
  const IconComponent = variantStyles.icon

  return (
    <Alert className={cn(variantStyles.container, dismissible && "relative", className)}>
      <IconComponent className={cn("h-4 w-4", variantStyles.iconColor)} />

      {title && <AlertTitle className={cn(variantStyles.titleColor, dismissible && "pr-8")}>{title}</AlertTitle>}

      <AlertDescription className={cn(variantStyles.descriptionColor, actions && "mb-3")}>
        {description}
      </AlertDescription>

      {actions && <div className="flex gap-2 mt-2">{actions}</div>}

      {dismissible && onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 h-6 w-6 p-0 hover:bg-opacity-20",
            variantStyles.iconColor,
            variant === "success" && "hover:bg-green-200",
            variant === "warning" && "hover:bg-yellow-200",
            variant === "error" && "hover:bg-red-200",
            variant === "info" && "hover:bg-blue-200",
            variant === "default" && "hover:bg-gray-200",
          )}
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
