# Modelo C4 – Sistema de Geração e Agendamento de Posts no Instagram (Post AI)

## Nível 1: Contexto (System Context Diagram)

### Sistema
**Post AI** é uma plataforma que automatiza publicações no Instagram, permitindo aos usuários gerar imagens e legendas personalizadas com inteligência artificial, além de agendar posts para uma melhor organização da presença digital.

### Usuários
- Microempreendedores e pequenos criadores de conteúdo que desejam gerenciar suas redes sociais de forma prática e eficiente.

### Sistemas Externos Integrados
- **API do Instagram**: Para postagem e agendamento de conteúdos.
- **APIs de IA**:
  - OpenAI: Para geração de textos personalizados.
  - Ideogram: Para criação de imagens baseadas em prompts.

### Interações
- **Usuário ⇔ Sistema**: Login, criação de posts, agendamento e visualização de status.
- **Sistema ⇔ APIs externas**: Autenticação e envio de posts para o Instagram; geração de conteúdo via APIs de IA.

## Nível 2: Contêineres (Container Diagram)

### Contêineres

#### Monorepo
- Estrutura unificada que organiza frontend, backend e compartilhamento de tipos e utilitários.

#### Aplicação Web (Frontend)
- **Tecnologias**: Next.js, TailwindCSS, TypeScript, Zustand, Zod, ShadCN.
- **Funcionalidade**: Interface amigável para criação e agendamento de posts.

#### Backend/API
- **Tecnologias**: NestJS, TypeScript, Mongoose.
- **Funcionalidade**: Responsável por autenticação, lógica de negócio e integração com APIs externas.

#### Banco de Dados
- **Tecnologia**: MongoDB (MongoDB Atlas na nuvem).
- **Funcionalidade**: Armazena informações dos usuários, posts, interações e agendamentos.

#### Serviços Externos
- **Instagram-private-api**
- **OpenAI (texto)**
- **Ideogram (imagem)**

### Comunicação entre Contêineres
- HTTP (REST API)
- Persistência via coleções MongoDB

## Nível 3: Componentes (Component Diagram)

### `UserService`
- **Responsabilidade**: Gerencia operações relacionadas aos usuários.
- **Funcionalidades**:
  - Busca de usuários por ID (`findOne`)
  - Atualização de dados do usuário (`update`)
  - Remoção de usuários (`remove`)

### `AuthService`
- **Responsabilidade**: Gerencia autenticação e autorização de usuários.
- **Funcionalidades**:
  - Autenticação de usuários (`authenticate`)
  - Registro de novos usuários (`register`)
  - Renovação de tokens (`refreshToken`)
  - Logout de usuários (`logout`)
  - Geração de tokens JWT (`generateToken`)

### `PostService`
- **Responsabilidade**: Gerencia criação, agendamento e publicação de posts no Instagram.
- **Funcionalidades**:
  - Criação de posts (`create`)
  - Publicação imediata (`publishNow`)
  - Agendamento de posts (`schedulePost`)
  - Execução de posts agendados (`publishPost`)
  - Cancelamento de agendamentos (`cancelScheduledPost`)
  - Consulta de posts do usuário (`getUserPostsWithDetails`)
  - Publicação de fotos no Instagram (`publishPhotoOnInstagram`)
  - Obtenção de dados dos posts no Instagram (`getInstagramPostInfo`)

### `ChatsService`
- **Responsabilidade**: Gerencia interações de chat para geração de conteúdo com IA.
- **Funcionalidades**:
  - Envio de mensagens (`sendMessage`)
  - Regeneração de mensagens (`regenerateMessage`)
  - Listagem de interações de chat (`listChatInteractions`)
  - Listagem de chats do usuário (`listUserChats`)
  - Geração de legendas (`generateCaption`)
  - Obtenção de contexto do chat (`getChatContext`)

### `InstagramAuthService`
- **Responsabilidade**: Gerencia autenticação e integração com o Instagram.
- **Funcionalidades**:
  - Verificação de contas associadas (`hasInstagramAccount`)
  - Login no Instagram (`login`)
  - Adição de novas contas (`addAccount`)
  - Criação de contas (`createAccount`)
  - Obtenção de tokens de sessão (`getToken`)
  - Restauração de sessões do Instagram (`restoreSession`)
  - Listagem de contas vinculadas (`getAccounts`)
  - Remoção de contas do Instagram (`delete`)

### `TextGenerationService`
- **Responsabilidade**: Serviço abstrato para geração de texto usando IA.
- **Funcionalidades**:
  - Geração de texto a partir de prompts (`generateText`)

## Nível 4: Código/Classe (Exemplos de Decisões Técnicas)

### Arquitetura
- **Monorepo (NX)**: Separação clara entre frontend (`apps/client`) e backend (`apps/server`) utilizando NX.
- **Padrão Repository**: Isolamento de regras de negócio e integrações externas.
- **Modularização**: Organização por domínios funcionais (`auth`, `post`, `chat`, `instagram-auth`).
- **Injeção de Dependências**: Uso extensivo do sistema de DI do NestJS para facilitar testes e manutenção.

### Estratégia de Testes
- **Testes Unitários**: Implementados com Jest para validação de componentes críticos.
- **Testes End-to-End (e2e)**: Validação de fluxos completos de usuário.
- **Mocks de Serviços Externos**: Simulação da API do Instagram e dos serviços de IA.
- **Cobertura de Código**: Foco nas funcionalidades mais sensíveis, como autenticação, geração de conteúdo e agendamento.

### Padrões de Design
- **CQRS (Command Query Responsibility Segregation)**: Separação entre operações de leitura e escrita.
- **Padrão Service**: Encapsulamento da lógica de negócio em serviços especializados.
- **Padrão Repository**: Abstração do acesso a dados.
- **Padrão Strategy**: Utilizado para serviços de geração de texto e imagem, permitindo múltiplas implementações.
- **Padrão Factory**: Aplicado na criação de objetos complexos, como sessões do Instagram.

### Segurança
- **Autenticação JWT**: Tokens de acesso e refresh para autenticação segura.
- **Cookies HttpOnly**: Armazenamento seguro dos tokens de refresh.
- **Hash de Senhas**: Utilização do bcrypt para criptografia segura.
- **Validação de Entrada**: Aplicada com DTOs (NestJS) e Zod (no frontend).
- **Proteção contra CSRF**: Implementação de tokens anti-CSRF para mitigar ataques.

