export const mappingIntegrationsErrors = (errorMessage: string, username: string) => {
	const errors = {
		challenge_required: {
			logger: `Login failed for user ${username}: Challenge required. Please verify your Instagram account for any issues.`,
			exception: 'Challenge required. Please verify your Instagram account for any issues.',
		},
	};

	for (const key in errors) {
		if (errorMessage.includes(key)) {
			return errors[key];
		}
	}

	return { logger: 'Something went wrong', exception: 'Something went wrong' };
};
