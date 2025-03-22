import { Interaction } from '@common/interfaces/chat';

export const getInteractionId = (interaction: Interaction) => {
	return 'id-' + interaction._id;
};
