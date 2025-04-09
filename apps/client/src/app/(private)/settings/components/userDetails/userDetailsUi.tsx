import { BaseSyntheticEvent } from 'react';

import { User } from '@common/interfaces/user';
import { Button } from '@components/button';
import { getColorByInitials, getInitials } from '@utils/avatar';
import { PencilLine } from 'lucide-react';

import EditUser from './editUser/editUserUi';
import LoadingPage from './loadingUserDetails/loadingUserDetails';

const UserDetailsContainer = ({
	isLoading,
	user,
	activeState,
	handleEditState,
	handleCancel,
	onSubmit,
	control,
	lastName,
	firstName,
	errors,
}: {
	isLoading: boolean;
	user: User | null | undefined;
	activeState: string;
	setActiveState: (state: string) => void;
	handleEditState: (state: string) => void;
	onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
	handleCancel: () => void;
	control: any;
	lastName: string | null;
	firstName: string | null;
	errors: any;
}) => {
	const initials = getInitials(user?.name || '');
	const backgroundColor = getColorByInitials(initials || '');

	return isLoading ? (
		<LoadingPage />
	) : (
		<>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div
						className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
						style={{ backgroundColor }}
					>
						{initials}
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-800">{user!.name}</h2>
						<p className="text-sm text-gray-500">Usuário</p>
					</div>
				</div>
				{activeState !== 'edit' && (
					<Button
						className="flex items-center bg-purple-500 hover:bg-purple-600"
						onClick={() => handleEditState('edit')}
					>
						<PencilLine className="mr-2" />
						Editar
					</Button>
				)}
			</div>

			{activeState === 'edit' ? (
				<EditUser
					isLoading={isLoading}
					user={user}
					onSubmit={onSubmit}
					handleEditState={handleEditState}
					handleCancel={handleCancel}
					control={control}
					errors={errors}
				/>
			) : (
				<>
					<div className="pt-4">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-800">Minha conta</h3>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">Nome</p>
								<p className="text-gray-800">{firstName}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Sobrenome</p>
								<p className="text-gray-800">{lastName || '-'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="text-gray-800">{user!.email}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Telefone</p>
								<p className="text-gray-800">{user!.phone || '-'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">CPF</p>
								<p className="text-gray-800">{user!.cpf || '-'}</p>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-200 pt-4 mt-4">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">País</p>
								<p className="text-gray-800">{user!.country || '-'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Cidade / Estado</p>
								<p className="text-gray-800">{user!.city || '-'}</p>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default UserDetailsContainer;
