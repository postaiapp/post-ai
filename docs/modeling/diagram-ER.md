# Diagrama ER (Modelo Entidade-Relacionamento)

## Descrição
O diagrama ER representa as principais entidades e seus relacionamentos no sistema.

---

## Entidades e Atributos

### **Usuário**
- **ID (PK)**  
- Nome  
- Email  
- InstagramID  
- Senha (hash)  

### **Post**
- **ID (PK)**  
- ImagemURL  
- Legenda  
- Status (agendado, postado)  
- DataHoraAgendamento  
- **UsuárioID (FK)**  

### **Escolha**
- **ID (PK)**  
- ImagemSugestão  
- LegendaSugestão  
- **PostID (FK)**  

### **Agendamento**
- **ID (PK)**  
- **PostID (FK)**  
- DataHoraExecução  
- StatusExecução (sucesso, erro)  

---

## Relacionamentos
1. **Usuário ⇔ Post**  
   - Um usuário pode criar múltiplos posts.  
2. **Post ⇔ Escolha**  
   - Um post pode ter várias sugestões de imagem e legenda por meio da IA.  
3. **Post ⇔ Agendamento**  
   - Um post é associado a um agendamento com data e status específicos.