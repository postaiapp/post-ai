import { DataTable } from '@components/dataTable/dataTable';
import { ColumnFiltersState, OnChangeFn, SortingState } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Button } from '@components/ui/button';
import { X } from 'lucide-react';

import { PostEntityWithDetails } from '@common/interfaces/post';
import { UserPlatform } from '@common/interfaces/user-platforms';

import { columns } from './historyTable/columns';

interface HistoryUiProps {
  totalItems: number;
  isError: boolean;
  isPending: boolean;
  allPagesLoaded: boolean;
  allPagesData: any[];
  pageSize: number;
  sorting: any[];
  columnFilters: any[];
  setSorting: OnChangeFn<SortingState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onFirstPage: () => void;
  onLastPage: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  userPlatforms: UserPlatform[];
  selectedUserPlatformId: number | null;
  onUserPlatformChange: (userPlatformId: number | null) => void;
}



export const HistoryUi = ({
  totalItems,
  isError,
  isPending,
  allPagesData,
  allPagesLoaded,
  pageSize,
  sorting,
  columnFilters,
  setSorting,
  setColumnFilters,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
  userPlatforms,
  selectedUserPlatformId,
  onUserPlatformChange
}: HistoryUiProps) => {
  return (
    <div className='p-6 h-full bg-gray-100'>
      <div className="mb-8">
        <h1 className='text-2xl font-bold mb-6'>Histórico de Posts</h1>
        
        {/* Filtro de Conta */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filtrar por conta:
            </label>
            <div className="flex items-center gap-2">
              <Select value={selectedUserPlatformId?.toString() || "all"} onValueChange={(value) => onUserPlatformChange(value === "all" ? null : parseInt(value))}>
                <SelectTrigger className="w-72">
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {userPlatforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                          {platform.display_name?.charAt(0) || platform.name?.charAt(0) || '?'}
                        </div>
                        <span>{platform.display_name || platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUserPlatformId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUserPlatformChange(null)}
                  className="h-9 px-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isError ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ops! Algo deu errado</h3>
          <p className="text-gray-600 mb-4">Não foi possível carregar o histórico de posts</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <DataTable<PostEntityWithDetails, any>
          isPending={isPending}
          columns={columns}
          allPagesLoaded={allPagesLoaded}
          data={allPagesData}
          pageSize={pageSize}
          totalItems={totalItems}
          sorting={sorting}
          columnFilters={columnFilters}
          setSorting={setSorting}
          setColumnFilters={setColumnFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onFirstPage={onFirstPage}
          onLastPage={onLastPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      )}
    </div>
  );
}
