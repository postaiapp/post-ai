"use client"

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
	getFilteredRowModel,
	ColumnFiltersState,
	OnChangeFn,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table"
import { useState } from "react"
import { Button } from "@components/ui/button"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Separator } from "@components/ui/separator"
import { getInitials, getColorByInitials } from "@utils/avatar"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	pageSize?: number
	totalItems?: number
	onPageChange?: (page: number) => void
	sorting?: SortingState
	columnFilters?: ColumnFiltersState
	setSorting?: OnChangeFn<SortingState>
	setColumnFilters?: OnChangeFn<ColumnFiltersState>
	isPending: boolean
	allPagesLoaded: boolean
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onFirstPage: () => void;
	onLastPage: () => void;
	onNextPage: () => void;
	onPreviousPage: () => void;
}



export function DataTable<TData, TValue>({
	isPending,
	allPagesLoaded,
	columns,
	data,
	pageSize = 10,
	totalItems = 0,
	sorting,
	columnFilters,
	setColumnFilters,
	setSorting,
	onPageChange,
	currentPage: externalCurrentPage,
	totalPages: externalTotalPages,
	hasNextPage,
	hasPreviousPage,
	onFirstPage,
	onLastPage,
	onNextPage,
	onPreviousPage
}: DataTableProps<TData, TValue>) {
	const [isChangingPage, setIsChangingPage] = useState(false);



	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: (value) => { 
			setColumnFilters?.(value);
		},
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			pagination: {
				pageIndex: externalCurrentPage - 1, // Convert to 0-based index
				pageSize,
			},
		},
		pageCount: externalTotalPages,
	});

	const isLoading = isPending || isChangingPage;

	return (
		<div className="rounded-lg bg-white shadow-md">
			<div className="flex items-center justify-between p-6">
				<div className="text-sm text-gray-600">
					Total de posts: {totalItems}
					{isLoading && " (Carregando...)"}
				</div>
			</div>

			<Separator />

			<div className="px-6 pt-2">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-white hover:bg-white">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : (
											<div className="flex items-center">
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getCanSort() && (
													<Button
														variant="ghost"
														className="p-2 ml-2"
														onClick={() => header.column.toggleSorting()}
														disabled={isLoading}
													>
														<ArrowUpDown className="h-4 w-4" />
													</Button>
												)}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: pageSize }).map((_, index) => (
								<TableRow key={index}>
									{Array.from({ length: columns.length }).map((_, cellIndex) => (
										<TableCell key={cellIndex}>
											<div className="h-6 bg-gray-200 animate-pulse rounded" />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="truncate max-w-[200px]">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Sem resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-center p-6 text-sm text-gray-500">
				<Button
					variant="ghost"
					size="sm"
					onClick={onFirstPage}
					disabled={!hasPreviousPage || isLoading}
					className="hover:bg-gray-100 disabled:opacity-40"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onPreviousPage}
					disabled={!hasPreviousPage || isLoading}
					className="hover:bg-gray-100 disabled:opacity-40"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="flex items-center gap-1 text-xs">
					<div className="text-muted-foreground">Página</div>
					{isLoading ? (
						<div className="h-4 w-6 bg-gray-200 animate-pulse rounded" />
					) : (
						<strong className="font-medium">
							{externalCurrentPage}
						</strong>
					)}
					<div className="text-muted-foreground">de</div>
					<strong className="font-medium">
						{externalTotalPages}
					</strong>
				</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={onNextPage}
					disabled={!hasNextPage || isLoading}
					className="hover:bg-gray-100 disabled:opacity-40"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onLastPage}
					disabled={!hasNextPage || isLoading}
					className="hover:bg-gray-100 disabled:opacity-40"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
