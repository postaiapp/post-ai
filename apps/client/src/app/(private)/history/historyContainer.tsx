'use client';
import { useState } from 'react';

import { PostEntityWithDetails } from '@common/interfaces/post';
import { getUserPostsWithDetails, getUserPlatforms } from '@processes/post';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import { UserPlatform } from '@/common/interfaces/user-platforms';

import { HistoryUi } from './historyUi';

const HistoryContainer = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUserPlatform, setSelectedUserPlatform] = useState<UserPlatform | null>(null);
	const pageSize = 10;
	const queryClient = useQueryClient();

	const queryKey = ['history', currentPage, columnFilters, sorting, selectedUserPlatform];

	const { data, isError, isPending } = useQuery<{
		data: {
			data: PostEntityWithDetails[];
			items_per_page: number;
			total_items: number;
			total_pages: number;
		};
	}>({
		queryKey,
		queryFn: () =>
			getUserPostsWithDetails({
				page: currentPage,
				limit: pageSize,
				userPlatformId: selectedUserPlatform?.id,
			}),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		placeholderData: previousData => previousData,
	});

	const { data: userPlatformsData } = useQuery({
		queryKey: ['user-platforms'],
		queryFn: getUserPlatforms,
		staleTime: 5 * 60 * 1000,
	});

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

	const totalPages = data?.data?.total_pages || 0;
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

	const postsData = data?.data?.data ?? [];

	return (
		<HistoryUi
			totalItems={data?.data?.total_items ?? 0}
			isError={isError}
			isPending={isPending}
			allPagesLoaded={!hasNextPage}
			allPagesData={postsData}
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
			userPlatforms={userPlatformsData?.data?.data || []}
			onSelectPlatform={setSelectedUserPlatform}
		/>
	);
};

export default HistoryContainer;
