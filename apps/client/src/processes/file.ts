import api from './api';

export interface UploadFileResponse {
	success: boolean;
	data: {
		id: number;
		name: string;
		url: string;
		type: string;
		size: number;
	};
}

export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await api.post('/files/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const getFile = async (fileId: number): Promise<UploadFileResponse> => {
	const response = await api.get(`/files/${fileId}`);
	return response.data;
};
