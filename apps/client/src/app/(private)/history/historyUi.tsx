import { DataTable } from "@components/dataTable/dataTable";
import { columns } from "./historyTable/columns";
import { ColumnFiltersState, OnChangeFn, SortingState } from "@tanstack/react-table";

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
}

export const HistoryUi = ({ totalItems, isError, isPending, allPagesLoaded, allPagesData, pageSize, sorting, columnFilters, setSorting, setColumnFilters }: HistoryUiProps) => {
  return (
    <div className='p-8 px-10 space-y-8'>
      <h1 className='text-2xl font-bold'>Histórico de Posts</h1>
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
        <DataTable
          allPagesLoaded={allPagesLoaded}
          isPending={isPending}
          columns={columns}
          data={allPagesData ?? []}
          pageSize={pageSize}
          totalItems={totalItems}
          sorting={sorting}
          columnFilters={columnFilters}
          setSorting={setSorting}
          setColumnFilters={setColumnFilters}
        />
      )}
    </div>
  )
}
