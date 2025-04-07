# 📦 Estrutura de Entidades e Relacionamentos

## 🧑 Usuário (`User`)
| Campo           | Tipo     | Descrição               |
|----------------|----------|-------------------------|
| `id`           | PK       | Identificador único     |
| `name`         | string   | Nome do usuário         |
| `email`        | string   | E-mail do usuário       |
| `password`     | string   | Senha                   |
| `cpf`          | string   | CPF                     |
| `phone`        | string   | Telefone                |
| `city`         | string   | Cidade                  |
| `country`      | string   | País                    |
| `created_at`   | datetime | Data de criação         |
| `updated_at`   | datetime | Data de atualização     |

---

## 📱 Conta do Instagram (`InstagramAccount`)
| Campo           | Tipo     | Descrição                        |
|----------------|----------|----------------------------------|
| `id`           | PK       | Identificador único              |
| `username`     | string   | Nome de usuário no Instagram     |
| `accountId`    | string   | ID da conta do Instagram         |
| `session`      | string   | Sessão da conta                  |
| `user_id`      | FK       | Referência ao usuário            |
| `created_at`   | datetime | Data de criação                  |
| `updated_at`   | datetime | Data de atualização              |

---

## 📝 Post (`Post`)
| Campo           | Tipo     | Descrição                        |
|----------------|----------|----------------------------------|
| `id`           | PK       | Identificador único              |
| `imageUrl`     | string   | URL da imagem                    |
| `caption`      | string   | Legenda                          |
| `accountId`    | string   | ID da conta do Instagram         |
| `user_id`      | FK       | Referência ao usuário            |
| `scheduledAt`  | datetime | Data de agendamento              |
| `publishedAt`  | datetime | Data de publicação               |
| `canceledAt`   | datetime | Data de cancelamento             |
| `jobId`        | string   | ID do job agendado               |
| `created_at`   | datetime | Data de criação                  |
| `updated_at`   | datetime | Data de atualização              |

---

## 💬 Chat (`Chat`)
| Campo           | Tipo     | Descrição                        |
|----------------|----------|----------------------------------|
| `id`           | PK       | Identificador único              |
| `user_id`      | FK       | Referência ao usuário            |
| `first_message`| string   | Primeira mensagem do chat        |
| `finished_at`  | datetime | Data de finalização              |
| `created_at`   | datetime | Data de criação                  |
| `updated_at`   | datetime | Data de atualização              |

---

## 🤖 Interação (`Interaction`)
| Campo           | Tipo     | Descrição                        |
|----------------|----------|----------------------------------|
| `id`           | PK       | Identificador único              |
| `chat_id`      | FK       | Referência ao chat               |
| `user_id`      | FK       | Referência ao usuário            |
| `request`      | text     | Texto da requisição              |
| `response`     | text     | Texto da resposta                |
| `is_regenerated` | bool   | Indica se foi regenerada         |
| `created_at`   | datetime | Data de criação                  |
| `updated_at`   | datetime | Data de atualização              |

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
