import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@processes/user';
import { UpdateUserData } from '@common/schemas/user';
import { successToast, errorToast } from '@utils/toast';

export const useAITrainingMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateUserData) => {
			return await updateUser(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
			successToast('Configurações de personalização salvas com sucesso!');
		},
		onError: (error: any) => {
			errorToast('Erro ao salvar configurações. Tente novamente.');
			console.error('Error updating AI training data:', error);
		},
	});
};
