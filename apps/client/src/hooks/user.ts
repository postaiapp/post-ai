import { UpdateUserData } from '@common/interfaces/user';
import { deleteUser, updateUser } from '@processes/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successToast } from '@utils/toast';

export function useUserMutations() {
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
		onSuccess: (newUser) => {
			queryClient.setQueryData(['user', newUser.id], newUser);
            return successToast('Usuário atualizado com sucesso!');
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
        onSuccess: (deletedUserId) => {
            queryClient.removeQueries(['user', deletedUserId]);
            return successToast('Usuário deletado com sucesso!');
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
