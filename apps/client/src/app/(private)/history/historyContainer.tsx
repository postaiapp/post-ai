"use client";
import { PostEntityWithDetails } from '@common/interfaces/post';
import { getUserPostsWithDetails } from '@processes/posts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';
import { HistoryUi } from './historyUi';

const HistoryContainer = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const queryClient = useQueryClient();

	const queryKey = ['history', currentPage, columnFilters, sorting];

	const { data, isError, isPending } = useQuery<{ data: { data: PostEntityWithDetails[], meta: { limit: number, page: number, total: number } } }>({
		queryKey,
		queryFn: () => getUserPostsWithDetails({
			page: currentPage,
			limit: pageSize
		}),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		placeholderData: (previousData) => previousData,
	});

	const prefetchNextPage = async (page: number) => {
		await queryClient.prefetchQuery({
			queryKey: ['history', page, columnFilters, sorting],
			queryFn: () => getUserPostsWithDetails({
				page,
				limit: pageSize
			}),
			staleTime: 5 * 60 * 1000,
		});
	};

	const prefetchPreviousPage = async (page: number) => {
		await queryClient.prefetchQuery({
			queryKey: ['history', page, columnFilters, sorting],
			queryFn: () => getUserPostsWithDetails({
				page,
				limit: pageSize
			}),
			staleTime: 5 * 60 * 1000,
		});
	};

	const totalPages = data ? Math.ceil(data.data.meta.total / pageSize) : 0;
	const hasNextPage = currentPage < totalPages;
	const hasPreviousPage = currentPage > 1;

	const handlePageChange = async (page: number) => {
		if (!page || page === currentPage || page > totalPages) return;

		setCurrentPage(page);

		if (page < totalPages) {
			prefetchNextPage(page + 1);
		}
		if (page > 1) {
			prefetchPreviousPage(page - 1);
		}
	};

	const handleFirstPage = () => handlePageChange(1);
	const handleLastPage = () => handlePageChange(totalPages);
	const handleNextPage = () => handlePageChange(currentPage + 1);
	const handlePreviousPage = () => handlePageChange(currentPage - 1);

	return (
		<HistoryUi
			totalItems={data?.data.meta.total ?? 0}
			isError={isError}
			isPending={isPending}
			allPagesLoaded={!hasNextPage}
			allPagesData={data?.data.data ?? []}
			pageSize={pageSize}
			sorting={sorting}
			columnFilters={columnFilters}
			setSorting={setSorting}
			setColumnFilters={setColumnFilters}
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={handlePageChange}
			onFirstPage={handleFirstPage}
			onLastPage={handleLastPage}
			onNextPage={handleNextPage}
			onPreviousPage={handlePreviousPage}
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
		/>
	);
}

export default HistoryContainer;
