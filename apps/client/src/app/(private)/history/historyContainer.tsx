"use client";
import { PostEntityWithDetails } from '@common/interfaces/post';
import { getUserPostsWithDetails } from '@processes/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { HistoryUi } from './historyUi';

const HistoryContainer = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pageSize = 10;

  const { data, fetchNextPage, hasNextPage, isError, isPending, isFetchingNextPage } = useInfiniteQuery<{ data: { data: PostEntityWithDetails[], meta: { limit: number, page: number, total: number } } }>(
    {
      queryKey: ['history'],
      queryFn: ({ pageParam = 1 }) => getUserPostsWithDetails({
        page: pageParam as number,
        limit: pageSize
      }),
      initialPageParam: 1,
      staleTime: 60000 * 5,
      gcTime: Infinity,
      getNextPageParam: (lastPage) => {
        const { limit, page, total } = lastPage.data.meta;

        const totalPages = Math.ceil(total / limit);

        if (page < totalPages) {
          return page + 1;
        }

        return undefined;
      },
    }
  );

  const allPagesLoaded = !hasNextPage && !!data && data.pages.length > 0;
  const allPagesData = data?.pages.flatMap((page) => page.data.data) ?? [];
  const totalItems = data?.pages[0]?.data.meta.total ?? 0;

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return <HistoryUi totalItems={totalItems} isError={isError} isPending={isPending} allPagesLoaded={allPagesLoaded} allPagesData={allPagesData} pageSize={pageSize} sorting={sorting} columnFilters={columnFilters} setSorting={setSorting} setColumnFilters={setColumnFilters} />
}

export default HistoryContainer