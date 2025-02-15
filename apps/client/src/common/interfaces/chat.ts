interface Chat {
	userId: string;
	interactions: Interaction[];
	firstMessage: string;
	id: string;
	createdAt: Date;
}

interface Interaction {
	request: string;
	response: string;
	isRegenerated: boolean;
}

export type { Chat, Interaction };
