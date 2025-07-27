import { Calendar, Settings, Sparkles, Zap, History } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { DataTable } from '@components/dataTable/dataTable';
import { ColumnFiltersState, OnChangeFn, SortingState } from '@tanstack/react-table';

import { PostEntityWithDetails } from '@common/interfaces/post';

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
}

const QuickActions = () => {
	const actions = [
		{
			title: 'Criar com IA',
			description: 'Use IA para gerar posts incríveis',
			icon: Sparkles,
			action: () => redirect('/chat'),
		},
		{
			title: 'Agendar Posts',
			description: 'Programe seus posts para o momento ideal',
			icon: Calendar,
			action: () => console.log('Agendar posts'),
		},
		{
			title: 'Histórico de Posts',
			description: 'Veja todos os seus posts',
			icon: History,
			action: () => console.log('Histórico de Posts'),
		},
		{
			title: 'Configurações',
			description: 'Personalize suas preferências',
			icon: Settings,
			action: () => redirect('/settings'),
		},
	];

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
			<CardContent className="p-6">
				<div className="flex items-center space-x-2 mb-6">
					<Zap className="h-5 w-5 text-purple-500" />
					<h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{actions.map((action, index) => (
						<Button
							key={index}
							variant="ghost"
							className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 transition-all duration-300 group min-w-0"
							onClick={action.action}
						>
							<div
								className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md border border-gray-100 flex-shrink-0`}
							>
								<action.icon className="h-6 w-6 text-purple-500" />
							</div>
							<div className="text-center w-full min-w-0">
								<p className="font-medium text-gray-900 text-xs leading-tight">{action.title}</p>
								<p className="text-xs text-gray-500 pb-2 leading-tight">{action.description}</p>
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

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
  onPreviousPage
}: HistoryUiProps) => {
  return (
    <div className='p-6 h-full bg-gray-100'>
      <div className="mb-8">
        <h1 className='text-2xl font-bold mb-6'>Histórico de Posts</h1>
        <QuickActions />
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
