# 📦 Estrutura de Entidades e Relacionamentos

## 🧑 Usuário (`User`)
| Campo         | Tipo     | Obrigatório | Descrição               |
|---------------|----------|-------------|-------------------------|
| `_id`         | string   | ✅           | Identificador único     |
| `name`        | string   | ✅           | Nome do usuário         |
| `email`       | string   | ✅           | E-mail do usuário       |
| `cpf`         | string   | ❌           | CPF                     |
| `phone`       | string   | ❌           | Telefone                |
| `city`        | string   | ❌           | Cidade                  |
| `country`     | string   | ❌           | País                    |

---

## 📱 Conta do Instagram (`InstagramAccount`)
> *Você não forneceu o tipo TypeScript desta entidade, então os campos abaixo seguem sua primeira descrição.*

| Campo         | Tipo     | Obrigatório | Descrição                        |
|---------------|----------|-------------|----------------------------------|
| `id`          | string   | ✅           | Identificador único              |
| `username`    | string   | ✅           | Nome de usuário no Instagram     |
| `accountId`   | string   | ✅           | ID da conta do Instagram         |
| `session`     | string   | ✅           | Sessão da conta                  |
| `user_id`     | string   | ✅           | Referência ao usuário            |
| `created_at`  | datetime | ✅           | Data de criação                  |
| `updated_at`  | datetime | ✅           | Data de atualização              |

---

## 📝 Post (`PostEntity`)
| Campo         | Tipo     | Obrigatório | Descrição                        |
|---------------|----------|-------------|----------------------------------|
| `_id`         | string   | ✅           | Identificador único              |
| `caption`     | string   | ✅           | Legenda                          |
| `imageUrl`    | string   | ✅           | URL da imagem                    |
| `userId`      | string   | ✅           | Referência ao usuário            |
| `accountId`   | string   | ✅           | ID da conta do Instagram         |
| `publishedAt` | Date     | ✅           | Data de publicação               |
| `scheduledAt` | Date     | ✅           | Data de agendamento              |
| `canceledAt`  | Date     | ❌           | Data de cancelamento             |
| `jobId`       | string   | ❌           | ID do job agendado               |

---

## 💬 Chat (`Chat`)
| Campo          | Tipo           | Obrigatório | Descrição                        |
|----------------|----------------|-------------|----------------------------------|
| `id`           | string         | ✅           | Identificador único              |
| `userId`       | string         | ✅           | Referência ao usuário            |
| `interactions` | Interaction[]  | ✅           | Lista de interações              |
| `firstMessage` | string         | ✅           | Primeira mensagem do chat        |
| `createdAt`    | Date           | ✅           | Data de criação                  |

---

## 🤖 Interação (`Interaction`)
| Campo          | Tipo     | Obrigatório | Descrição                        |
|----------------|----------|-------------|----------------------------------|
| `_id`          | string   | ✅           | Identificador único             |
| `request`      | string   | ✅           | Texto da requisição             |
| `response`     | string   | ✅           | Imagem gerada                   |
| `isRegenerated`| boolean  | ✅           | Indica se foi regenerada        |

---

## 🔗 Relacionamentos

- **Usuário ⇔ Conta do Instagram**
  - Um usuário pode ter várias contas do Instagram (1:N)
  - Cada conta do Instagram pertence a um único usuário

- **Usuário ⇔ Post**
  - Um usuário pode criar vários posts (1:N)
  - Cada post pertence a um único usuário

- **Usuário ⇔ Chat**
  - Um usuário pode ter vários chats (1:N)
  - Cada chat pertence a um único usuário

- **Chat ⇔ Interação**
  - Um chat pode ter várias interações (1:N)
  - Cada interação pertence a um único chat
