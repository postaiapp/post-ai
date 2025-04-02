import { UpdateUserData } from '@common/interfaces/user';
import { deleteUser, updateUser } from '@processes/user';
import userStore from '@stores/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successToast } from '@utils/toast';

export function useUserMutations() {
    const { setUser } = userStore();
	const queryClient = useQueryClient();

	const {
        mutateAsync: updateUserMutationAsync,
        mutate: updateUserMutate,
        isPending: isUpdateUserPending,
        isError: isUpdateUserError,
        error: updateUserError,
    } = useMutation({
		mutationKey: ['updateUser'],
		mutationFn: async (data: UpdateUserData) => {
			const response = await updateUser(data);
			return response.data;
		},
		onSuccess: ({ data }) => {
			queryClient.setQueryData(['user', data.id], data);
            setUser(data);
            return successToast('Usuário atualizado com sucesso!');
		},
        onError: () => {
            return successToast('Erro ao atualizar usuário!');
        },
	});

    const {
        mutateAsync: deleteUserMutationAsync,
        mutate: deleteUserMutate,
        isPending: isDeleteUserPending,
        isError: isDeleteUserError,
        error: deleteUserError,
    } = useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: async () => {
            const response = await deleteUser();
            return response.data;
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
            return successToast('Usuário deletado com sucesso!');
        },
        onError: () => {
            return successToast('Erro ao deletar usuário!');
        },
    });
	return {
        updateUserMutate: {
            updateUserMutationAsync,
            updateUserMutate,
            isUpdateUserPending,
            isUpdateUserError,
            updateUserError,
        },
        deleteUserMutate: {
            deleteUserMutationAsync,
            deleteUserMutate,
            isDeleteUserPending,
            isDeleteUserError,
            deleteUserError,
        }
	};
}
