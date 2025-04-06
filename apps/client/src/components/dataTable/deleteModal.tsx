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
} from "@components/ui/alert-dialog"
import { Button } from "@components/ui/button"
import { TriangleAlert } from "lucide-react"

  export function DeleteModal({ textButton, modalTitle, modalDescription, onClick, icon: Icon }: {
    textButton: string
    modalTitle: string
    modalDescription: string
    onClick: () => Promise<void>
    icon?: React.ComponentType<any>,
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-6 cursor-pointer transition-all duration-200 rounded-lg mx-2 border border-red-500 text-red-500 hover:bg-red-100 hover:text-red-900"
          >
            {Icon && (
              <Icon
                className="font-medium text-lg"
              />
            )}
            {textButton}
        </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <TriangleAlert className="text-red-400 font-medium text-lg" />
            <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {modalDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
                onClick={onClick}
                className="bg-red-400 text-white hover:bg-red-500 focus:ring-red-500 focus:ring-offset-red-200"
            >
                    Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
