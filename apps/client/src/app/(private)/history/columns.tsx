"use client"

import { PostEntityWithDetails } from "@common/interfaces/post"
import { Button } from "@components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical } from "lucide-react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DropdownMenuItem } from "@components/ui/dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@components/ui/dropdown-menu"
import { DialogProps } from "@radix-ui/react-dialog"
import { errorToast, successToast } from "@utils/toast"
import { mappedErrors } from "@common/constants/error"
import { cancelPost } from "@processes/posts"

const UserUi = ({ image, username }: { image?: string, username: string }) => {
  return (
    <div className="flex items-center gap-2">
      {image ? <Image src={image} alt="Profile" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
      <span className="font-medium">{username}</span>
    </div>
  )
}

const ActionsDropdown = ({ post }: { post: PostEntityWithDetails }) => {
  const [isSeeModalOpen, setIsSeeModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutate: cancelPostMutation, isPending: isCancelPostPending } = useMutation({
    mutationKey: ['cancelPost'],
    mutationFn: async ({ postId, username }: { postId: string, username: string }) => {
      const response = await cancelPost({
        postId,
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      successToast("Post cancelado com sucesso")
    },
    onError: (error: Error) => {
      const errorMessage = mappedErrors[error?.message] ?? 'Algo de errado aconteceu, tente novamente.'
      errorToast(errorMessage)
      console.log(error.message)
    },
  });

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={!!post.canceledAt}>
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsSeeModalOpen(true)}>
            Visualizar
          </DropdownMenuItem>
          {post.scheduledAt && !post.canceledAt && (
            <DropdownMenuItem
              onSelect={(e) => { e.preventDefault(); cancelPostMutation({ postId: post._id, username: post.account.username }) }
              }
              className="text-red-600"
              disabled={isCancelPostPending}
            >
              {isCancelPostPending ? "Cancelando..." : "Cancelar agendamento"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SeePostModal post={post} open={isSeeModalOpen} onOpenChange={setIsSeeModalOpen} />
    </>
  )
}

const SeePostModal = ({ post, ...rest }: { post: PostEntityWithDetails } & DialogProps) => {
  const account = post.account;

  return (
    <Dialog {...rest}>
      <DialogContent className="p-0 bg-white overflow-hidden w-full max-w-md mx-auto">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center gap-3">
            {account?.profilePicUrl ? <Image src={account.profilePicUrl} alt="Profile" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
            <span className="font-semibold">{account?.username}</span>
          </div>

          <div className="w-full aspect-square bg-black flex items-center justify-center">
            <Image
              src={post.imageUrl}
              fill
              alt="Post"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="p-4">
            <div className="flex gap-4">
              <button className="hover:opacity-70">
                <Heart className="w-7 h-7" />
              </button>
              <button className="hover:opacity-70">
                <MessageCircle className="w-7 h-7" />
              </button>
              <button className="hover:opacity-70">
                <Share2 className="w-7 h-7" />
              </button>
              <div className="flex-1" />
              <button className="hover:opacity-70">
                <Bookmark className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 flex-1 overflow-y-auto">
            <span className="text-sm font-bold mr-1">{account?.username}</span>
            <span className="text-sm">{post.caption}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>)
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    canceled: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
    scheduled: "bg-blue-100 text-blue-800",
  }

  const getStatusStyle = () => {
    switch (status) {
      case "Cancelado": return styles.canceled
      case "Publicado": return styles.published
      case "Agendado": return styles.scheduled
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}>
      {status}
    </span>
  )
}

export const columns: ColumnDef<PostEntityWithDetails>[] = [
  {
    accessorKey: "account",
    header: "Conta",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const accountA = rowA.original.account
      const accountB = rowB.original.account

      if (!accountA?.username || !accountB?.username) return 0
      return accountA.username.localeCompare(accountB.username)
    },
    filterFn: (row, _, filterValue) => {
      const account = row.original.account
      if (!account?.username) return false
      return account.username.toLowerCase().includes(filterValue.toLowerCase())
    },
    cell: ({ row }) => <UserUi image={row.original.account?.profilePicUrl} username={row.original.account?.username ?? "Desconhecido"} />

  },
  {
    accessorKey: "user",
    header: "Usuário",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const userA = rowA.original.user
      const userB = rowB.original.user

      if (!userA?.name || !userB?.name) return 0
      return userA.name.localeCompare(userB.name)
    },
    filterFn: (row, _, filterValue) => {
      const user = row.original.user
      if (!user?.name) return false
      return user.name.toLowerCase().includes(filterValue.toLowerCase())
    },
    cell: ({ row }) => <UserUi image={row.original?.user?.profilePicUrl} username={row.original?.user?.name ?? "Desconhecido"} />
  },
  {
    accessorKey: "caption",
    header: "Legenda",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "arrIncludes",
  },
  {
    accessorKey: "scheduledAt",
    header: "Agendado para",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("scheduledAt") as string
      return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' }) : "Não agendado"
    }
  },
  {
    accessorKey: "publishedAt",
    header: "Publicado em",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("publishedAt") as string
      return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' }) : "Não publicado"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt
      const scheduledAt = row.original.scheduledAt
      const canceledAt = row.original.canceledAt

      if (canceledAt) return <StatusBadge status="Cancelado" />
      if (publishedAt) return <StatusBadge status="Publicado" />
      if (scheduledAt) return <StatusBadge status="Agendado" />
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <ActionsDropdown post={row.original} />
  }
]
