interface Chat {
	userId: string;
	interactions: Interaction[];
	firstMessage: string;
	id: string;
	createdAt: Date;
}

interface Interaction {
	_id: string;
	request: string;
	response: string;
	isRegenerated: boolean;
}

export type { Chat, Interaction };
