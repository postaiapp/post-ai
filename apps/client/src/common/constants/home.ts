const itemsHome = [
    {
        label: 'Home',
        href: '#home',
    },
    {
        label: 'Funcionalidades',
        href: '#features',
    },
    {
        label: 'FAQ',
        href: '#faq',
    },
];

const homeImagesInfo = [
    {
        title: 'Posts criados automaticamente com criatividade ilimitada.',
        description:
            'Nossa IA gera imagens incríveis e legendas únicas em segundos, adaptadas ao seu público e ao tom da sua marca. Economize tempo enquanto garante conteúdos de alta qualidade.',
        image: '/lp/platform-preview.svg',
    },
    {
        title: 'Conecte sua conta e publique diretamente.',
        description:
            'Conecte facilmente suas contas do Instagram (e em breve, outras redes sociais) para criar e publicar posts diretamente na sua página, sem complicações.',
        image: '/lp/platform-preview.svg',
    },
    {
        title: 'Planeje e automatize suas postagens.',
        description:
            'Defina datas e horários para suas publicações e deixe nossa ferramenta cuidar do resto. Alcance seu público no momento certo sem precisar estar online.',
        image: '/lp/platform-preview.svg',
    },
];

const faqItems = [
    {
        title: 'Como funciona o gerador de posts com IA?',
        description:
            'Nosso gerador utiliza inteligência artificial para criar imagens personalizadas e legendas alinhadas com a identidade da sua marca. Basta inserir palavras-chave ou informações sobre o post, e nossa IA faz o resto!',
    },
    {
        title: 'Posso conectar mais de uma conta de rede social?',
        description:
            'Sim! Atualmente, você pode integrar várias contas do Instagram. Em breve, adicionaremos suporte para outras redes sociais.',
    },
    {
        title: 'É possível agendar posts para diferentes horários?',
        description:
            'Sim! Você pode agendar múltiplos posts com datas e horários distintos, otimizando sua presença online.',
    },
    {
        title: 'A plataforma é responsiva?',
        description:
            'No momento, nossa plataforma foi projetada para uso em desktop. Estamos trabalhando para tornar a experiência igualmente fluida em dispositivos móveis.',
    },
    {
        title: 'Preciso de habilidades de design para usar a plataforma?',
        description:
            'Não! A ferramenta é simples e intuitiva, ideal para pessoas sem experiência prévia em design gráfico.',
    },
    {
        title: 'Existe um período de teste gratuito?',
        description:
            'Sim, oferecemos acesso gratuito à plataforma enquanto ela está em fase inicial. Experimente sem custo!',
    },
    {
        title: 'Haverá cobrança para usar a plataforma no futuro?',
        description:
            'No momento, a plataforma está disponível gratuitamente. Avisaremos com antecedência caso implementemos planos pagos.',
    },
    {
        title: 'Como posso entrar em contato com o suporte?',
        description:
            'Você pode entrar em contato com nossa equipe pelo formulário disponível na landing page ou enviando um e-mail para suporte@seusite.com.',
    },
];

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

export { itemsHome, homeImagesInfo, faqItems };
