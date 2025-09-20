'use client';
import { useState, useEffect } from 'react';

import { getUserPostsWithDetails } from '@processes/post';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import { PaginationOptions } from '@/common/interfaces/pagination';
import { UserPlatform } from '@/common/interfaces/user-platforms';

import { HistoryUi } from './historyUi';

const HistoryContainer = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({
		page: 1,
		totalPages: 0,
		totalItems: 0,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [selectedUserPlatform, setSelectedUserPlatform] = useState<UserPlatform | null>(null);
	const pageSize = 10;
	const queryClient = useQueryClient();

	const queryKey = ['history', paginationOptions.page, columnFilters, sorting, selectedUserPlatform];

	const { data, isError, isPending } = useQuery<{
		data: {
			data: {
				posts: any[];
				total_pages: number;
				total_items: number;
			};
			items_per_page: number;
			total_items: number;
			total_pages: number;
		};
	}>({
		queryKey,
		queryFn: () =>
			getUserPostsWithDetails({
				page: paginationOptions.page,
				limit: pageSize,
				userPlatformId: selectedUserPlatform?.id,
			}),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		placeholderData: previousData => previousData,
	});

	useEffect(() => {
		if (data?.data?.data?.total_pages) {
			setPaginationOptions(prev => ({
				...prev,
				totalPages: data.data.data.total_pages || 0,
				totalItems: data.data.data.total_items || 0,
			}));
		}
	}, [data?.data?.data]);

	const prefetchNextPage = async (page: number) => {
		await queryClient.prefetchQuery({
			queryKey: ['history', page, columnFilters, sorting],
			queryFn: () =>
				getUserPostsWithDetails({
					page,
					limit: pageSize,
				}),
			staleTime: 5 * 60 * 1000,
		});
	};

	const prefetchPreviousPage = async (page: number) => {
		await queryClient.prefetchQuery({
			queryKey: ['history', page, columnFilters, sorting],
			queryFn: () =>
				getUserPostsWithDetails({
					page,
					limit: pageSize,
				}),
			staleTime: 5 * 60 * 1000,
		});
	};

	const handlePageChange = async (page: number) => {
		if (!page || page === paginationOptions.page || page > paginationOptions.totalPages) return;

		if (page < paginationOptions.totalPages) {
			prefetchNextPage(page + 1);
		}
		if (page > 1) {
			prefetchPreviousPage(page - 1);
		}
	};

	const handleFirstPage = () => handlePageChange(1);
	const handleLastPage = () => handlePageChange(paginationOptions.totalPages);
	const handleNextPage = () => handlePageChange(paginationOptions.page + 1);
	const handlePreviousPage = () => handlePageChange(paginationOptions.page - 1);

	const postsData = data?.data?.data?.posts ?? [];

	return (
		<HistoryUi
			totalItems={paginationOptions.totalItems}
			isError={isError}
			isPending={isPending}
			allPagesLoaded={!(paginationOptions.page < paginationOptions.totalPages)}
			allPagesData={postsData}
			pageSize={pageSize}
			sorting={sorting}
			columnFilters={columnFilters}
			setSorting={setSorting}
			setColumnFilters={setColumnFilters}
			currentPage={paginationOptions.page}
			totalPages={paginationOptions.totalPages}
			onPageChange={handlePageChange}
			onFirstPage={handleFirstPage}
			onLastPage={handleLastPage}
			onNextPage={handleNextPage}
			onPreviousPage={handlePreviousPage}
			hasNextPage={paginationOptions.page < paginationOptions.totalPages}
			hasPreviousPage={paginationOptions.page > 1}
			onSelectPlatform={setSelectedUserPlatform}
		/>
	);
};

export default HistoryContainer;
