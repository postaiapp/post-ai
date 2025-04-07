type ChatErrorMessages =
	| 'Chat atingiu o limite de mensagens. Por favor, abra um novo chat.'
	| 'A mensagem contém palavras ofensivas. Por favor, tente novamente com uma mensagem mais adequada.'
	| 'Ocorreu um erro. Por favor, tente novamente.';

export const NOT_TRY_AGAIN_ERROR_MESSAGES: ChatErrorMessages[] = [
	'A mensagem contém palavras ofensivas. Por favor, tente novamente com uma mensagem mais adequada.',
];

export const getErrorMessage = (error?: string): ChatErrorMessages => {
	if (error?.includes('too long')) {
		return 'Chat atingiu o limite de mensagens. Por favor, abra um novo chat.';
	}

	if (
		error?.includes(
			'Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.'
		)
	) {
		return 'A mensagem contém palavras ofensivas. Por favor, tente novamente com uma mensagem mais adequada.';
	}

	return 'Ocorreu um erro. Por favor, tente novamente.';
};
