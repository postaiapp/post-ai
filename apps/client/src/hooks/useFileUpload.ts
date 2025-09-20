import { useMutation } from '@tanstack/react-query';
import { uploadFile, UploadFileResponse } from '@processes/file';
import { successToast, errorToast } from '@utils/toast';

export const useFileUploadMutation = () => {
	return useMutation({
		mutationFn: uploadFile,
		onSuccess: (data) => {
			successToast('Arquivo enviado com sucesso!');
		},
		onError: (error: any) => {
			console.error('Erro ao fazer upload do arquivo:', error);
			errorToast('Erro ao fazer upload do arquivo. Tente novamente.');
		},
	});
};
