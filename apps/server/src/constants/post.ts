export const TIME_ZONE = 'America/Sao_Paulo';
export const IMAGE_TEST_URL = 'https://i.imgur.com/BZBHsauh.jpg';

// Constantes para cálculo de tempo economizado na criação de posts
export const POST_CREATION_TIMES = {
	// Tempo médio para criar um post do Instagram manualmente (em minutos)
	MANUAL_CREATION_TIME: 45, // 45 minutos por post (design + copywriting + revisão)

	// Tempo médio para criar um post usando nossa plataforma (em minutos)
	PLATFORM_CREATION_TIME: 8, // 8 minutos por post (ajustes + agendamento)

	// Tempo economizado por post (em minutos)
	TIME_SAVED_PER_POST: 37, // 45 - 8 = 37 minutos economizados

	// Tempo médio para design de imagem (em minutos)
	IMAGE_DESIGN_TIME: 25,

	// Tempo médio para copywriting (em minutos)
	COPYWRITING_TIME: 15,

	// Tempo médio para revisão e ajustes (em minutos)
	REVISION_TIME: 5,
};

// Métricas de engajamento para cálculos
export const ENGAGEMENT_METRICS = {
	// Taxa de engajamento média do Instagram (em porcentagem)
	AVERAGE_ENGAGEMENT_RATE: 1.5,

	// Alcance médio por post (estimativa baseada em contas pequenas/médias)
	AVERAGE_REACH_PER_POST: 500,

	// Multiplicador para posts agendados (posts agendados tendem a ter melhor performance)
	SCHEDULED_POST_MULTIPLIER: 1.2,
};
