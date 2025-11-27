# API Mock - JSON Server

## Configuração

O projeto utiliza **JSON Server** para simular a API REST durante o desenvolvimento e testes.

### Iniciando o Servidor Mock

```bash
npm run mock-api
```

**Porta:** `3000`  
**Base URL:** `http://localhost:3000`  
**Arquivo de Dados:** `db.json` (raiz do projeto)

---

## Endpoints Disponíveis

### 1. Usuários

**Base:** `/usuarios`

#### Listar todos os usuários
```http
GET http://localhost:3000/usuarios
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@example.com",
    "ativo": true
  }
]
```

#### Buscar usuário por ID
```http
GET http://localhost:3000/usuarios/1
```

#### Criar novo usuário
```http
POST http://localhost:3000/usuarios
Content-Type: application/json

{
  "nome": "Novo Usuário",
  "email": "novo@example.com",
  "ativo": true
}
```

#### Atualizar usuário
```http
PUT http://localhost:3000/usuarios/1
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "email": "joao.atualizado@example.com",
  "ativo": false
}
```

#### Deletar usuário
```http
DELETE http://localhost:3000/usuarios/1
```

---

### 2. Pedidos

**Base:** `/pedidos`

#### Listar todos os pedidos
```http
GET http://localhost:3000/pedidos
```

**Resposta:**
```json
[
  {
    "id": 1,
    "usuarioId": 1,
    "dataPedido": "2024-01-15",
    "valor": 150.00,
    "status": "concluido"
  }
]
```

#### Buscar pedido por ID
```http
GET http://localhost:3000/pedidos/1
```

#### Filtrar pedidos por usuário
```http
GET http://localhost:3000/pedidos?usuarioId=1
```

#### Filtrar pedidos por status
```http
GET http://localhost:3000/pedidos?status=pendente
```

#### Criar novo pedido
```http
POST http://localhost:3000/pedidos
Content-Type: application/json

{
  "usuarioId": 1,
  "dataPedido": "2024-01-20",
  "valor": 200.00,
  "status": "pendente"
}
```

#### Atualizar pedido
```http
PUT http://localhost:3000/pedidos/1
Content-Type: application/json

{
  "usuarioId": 1,
  "dataPedido": "2024-01-20",
  "valor": 180.00,
  "status": "concluido"
}
```

#### Deletar pedido
```http
DELETE http://localhost:3000/pedidos/1
```

---

### 3. Produtos

**Base:** `/produtos`

#### Listar todos os produtos
```http
GET http://localhost:3000/produtos
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Produto A",
    "descricao": "Descrição do Produto A",
    "preco": 50.00,
    "estoque": 100
  }
]
```

#### Buscar produto por ID
```http
GET http://localhost:3000/produtos/1
```

#### Criar novo produto
```http
POST http://localhost:3000/produtos
Content-Type: application/json

{
  "nome": "Produto C",
  "descricao": "Descrição do Produto C",
  "preco": 99.90,
  "estoque": 25
}
```

#### Atualizar produto
```http
PUT http://localhost:3000/produtos/1
Content-Type: application/json

{
  "nome": "Produto A Atualizado",
  "descricao": "Nova descrição",
  "preco": 55.00,
  "estoque": 80
}
```

#### Deletar produto
```http
DELETE http://localhost:3000/produtos/1
```

---

## Recursos Avançados do JSON Server

### Paginação
```http
GET http://localhost:3000/usuarios?_page=1&_limit=10
```

### Ordenação
```http
GET http://localhost:3000/produtos?_sort=preco&_order=asc
```

### Busca Full-Text
```http
GET http://localhost:3000/usuarios?q=Silva
```

### Operadores
```http
# Maior que
GET http://localhost:3000/produtos?preco_gte=50

# Menor que
GET http://localhost:3000/produtos?preco_lte=100

# Diferente de
GET http://localhost:3000/pedidos?status_ne=concluido
```

### Relacionamentos
```http
# Expandir relacionamentos
GET http://localhost:3000/pedidos?_embed=usuario
```

---

## Adicionando Novos Endpoints

Para criar novos endpoints, edite o arquivo `db.json` na raiz do projeto:

```json
{
  "novoRecurso": [
    {
      "id": 1,
      "campo": "valor"
    }
  ]
}
```

O JSON Server criará automaticamente o endpoint `/novoRecurso`.

---

## Observações

- **Persistência:** Todas as alterações (POST, PUT, DELETE) são salvas no arquivo `db.json`.
- **Auto-reload:** O servidor recarrega automaticamente quando `db.json` é modificado.
- **CORS:** Habilitado por padrão para desenvolvimento.
- **Delay (opcional):** Adicione `--delay 500` no script para simular latência de rede.

---

## Exemplos de Uso no Angular

### Service Example

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  atualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  deletarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

---

## Links Úteis

- [Documentação Oficial JSON Server](https://github.com/typicode/json-server)
- [API Mock Home](http://localhost:3000) (quando servidor estiver rodando)
