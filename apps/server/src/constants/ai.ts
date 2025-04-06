export const BASE_RULES = `
- Utilize a língua portuguesa para todos os textos na imagem.
- Os textos devem ser perfeitamente legíveis, com fontes claras e de fácil leitura.
- Não use abreviações ou gírias.
- Use a gramática correta, respeitando pontualmente todas as regras do português brasileiro.
- Não gere imagens que firam os direitos humanos ou fujam do contexto solicitado.
- Caso as diretrizes não possam ser seguidas, retorne uma mensagem de erro.
`;

export const INITIAL_PROMPT = `
GOAL:
Crie uma imagem promocional para redes sociais com visual atrativo e moderno, voltada para campanhas de marketing, promoções e anúncios de produtos ou serviços.
`;

export const DEFAULT_PROMPT = `
RETURN FORMAT:
A imagem deve ter o seguinte estilo visual:
- Estilo vetorial, ilustrativo ou minimalista.
- Fundo com cores sólidas vibrantes ou gradientes modernos.
- Tipografia grande, clara e em destaque.
- Elementos gráficos vetoriais (como ícones, emojis ou ilustrações relacionadas ao tema).
- Layout limpo, com boa hierarquia visual.

O texto central da imagem deve ser exatamente o texto fornecido pelo usuário (ex: "2 PIZZAS PELO PREÇO DE UMA"). Esse texto deve estar posicionado de forma visualmente chamativa.

A imagem gerada deve ter proporção quadrada (1:1), ideal para Instagram ou Facebook.

---

WARNINGS:
${BASE_RULES}

---

CONTEXT DUMP:
Essa imagem será usada para uma postagem em redes sociais (Instagram e Facebook), com o objetivo de gerar engajamento visual e promover produtos ou serviços. Deve atrair atenção rapidamente e ser esteticamente agradável, mantendo clareza na comunicação e foco no tema fornecido pelo usuário. A imagem será exibida em ambientes digitais, preferencialmente mobile, portanto deve ser visualmente impactante mesmo em telas pequenas.
`;

export const CAPTION_PROMPT = `
Você é uma IA especializada na criação de legendas para redes sociais, focando em banners digitais de alta qualidade e impacto visual.
Gere legendas atrativas e profissionais para Instagram, garantindo um grande engajamento na publicação.
Lembre-se que o usuário já gerou uma imagem e um texto, use como base para gerar uma nova legenda.
Coloque hashtags no final da legenda, se achar necessário.
Use emojis para destacar o texto (mas também não exagere).
Não use markdowns, apenas texto puro, pois o instagr.



Siga estas regras rigorosamente:
${BASE_RULES}

Esse aqui é o contexto da publicação:
`;
