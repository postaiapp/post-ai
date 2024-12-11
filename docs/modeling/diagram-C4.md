# Modelo C4: Sistema de Geração e Agendamento de Posts do Instagram

## Nível 1: Contexto

### Descrição
Mostra os atores principais e como interagem com o sistema.

### Componentes Principais
- **Usuário**: Interage com o sistema para gerar, agendar e gerenciar posts.  
- **Sistema de Geração e Agendamento de Posts**: Processa requisições do usuário e se integra com a API do Instagram para autenticação, postagem e recuperação de dados.

### Interações
- **Usuário ⇔ Sistema**: Login, criação de posts, agendamento e visualização de status.  
- **Sistema ⇔ API do Instagram**: Autenticação, envio de posts, consulta de status.  

---

## Nível 2: Contêiner

### Descrição
Mostra os contêineres de software e como eles se comunicam.

### Contêineres
1. **Frontend**  
   - **Tecnologias**: React, Next.js, Tailwind CSS  
   - **Funcionalidade**: Interface com o usuário para login, criação e agendamento de posts.  

2. **Backend**  
   - **Tecnologias**: Node.js, tRPC, MongoDB  
   - **Funcionalidade**: Processamento da lógica do negócio, geração de imagens/legendas, agendamento e comunicação com a API do Instagram.  

3. **Banco de Dados**  
   - **Tecnologia**: MongoDB  
   - **Funcionalidade**: Armazena dados do usuário, posts, status e configurações.  

4. **API do Instagram**  
   - Serviço externo para autenticação e postagem no Instagram.

### Fluxo de Dados
- **Frontend ⇔ Backend**: Requisições via tRPC  
- **Backend ⇔ Banco de Dados**: CRUD dos dados  
- **Backend ⇔ API do Instagram**: Autenticação, envio de posts e consulta de status  

---

## Nível 3: Componente

### Descrição
Detallha os principais componentes dentro do backend e suas funções.

### Componentes Backend
1. **AuthService**  
   - Gerencia login do usuário via API do Instagram.  
2. **PostService**  
   - Cria posts e coordena a geração de imagens/legendas via IA.  
3. **SchedulerService**  
   - Gerencia o agendamento de posts e verifica status.  
4. **DatabaseConnector**  
   - Realiza comunicação com MongoDB para armazenar e recuperar dados.  

### Fluxo Interno
- **AuthService**: Autentica usuários via Instagram e salva tokens no banco de dados.  
- **PostService**: Gera posts, consulta IA e salva no banco.  
- **SchedulerService**: Processa agendamentos e atualiza status de execução.
