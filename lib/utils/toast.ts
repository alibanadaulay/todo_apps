import { toast } from "@/components/ui/use-toast"

export const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
    className: "bg-green-500 text-white border-green-600",
  })
}

export const showErrorToast = (message: string) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    className: "bg-red-500 text-white border-red-600",
  })
}

export const showWarningToast = (message: string) => {
  toast({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-yellow-500 text-white border-yellow-600",
  })
}

export const showInfoToast = (message: string) => {
  toast({
    title: "Info",
    description: message,
    variant: "default",
    className: "bg-blue-500 text-white border-blue-600",
  })
} 