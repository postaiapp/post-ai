"use client"

import { PostEntityWithDetails } from "@common/interfaces/post"
import { ColumnDef } from "@tanstack/react-table"
import { ActionsDropdown } from "./components/ActionsDropdown/ActionsDropdown"
import { StatusBadge } from "./components/StatusBadge/StatusBadge"
import { AccountCardCore } from "@components/accountCard/accountCard"


export const columns: ColumnDef<PostEntityWithDetails>[] = [
  {
    accessorKey: "account.profile_data.username",
    header: "Conta",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const accountA = rowA.original.account
      const accountB = rowB.original.account

      if (!accountA?.profile_data?.username || !accountB?.profile_data?.username) return 0
      return accountA.profile_data.username.localeCompare(accountB.profile_data.username)
    },
    filterFn: "arrIncludes",
    cell: ({ row }) => <AccountCardCore 
      fullName={row.original.account?.display_name} 
      isPrivate={false} 
      isVerified={false} 
      profilePicUrl={row.original.account?.avatar_url} 
      username={row.original.account?.profile_data?.username ?? "Desconhecido"} 
    />
  },
  {
    accessorKey: "caption",
    header: "Legenda",
    enableSorting: true,
    enableColumnFilter: false,
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
