# Como Testar o Fluxo de Questionário

## 🚀 Passos para Teste

### 1. Iniciar os Servidores

#### JSON Server (Terminal 1)
```bash
cd d:\projetos\egr-app
npm run api
```
Ou:
```bash
npx json-server db.json --port 3000
```

#### Angular Dev Server (Terminal 2)
```bash
cd d:\projetos\egr-app
ng serve
```

Aguarde até ver: `Application bundle generation complete.`

### 2. Acessar a Aplicação

Abra o navegador em: `http://localhost:4200`

### 3. Testar o Fluxo Completo

#### Cenário 1: Bruce Wayne (Graduação - Ciência da Computação)

1. Acesse: `http://localhost:4200/busca-aluno`

2. Preencha os campos:
   - **Nome Completo**: `Bruce Wayne` (ou apenas `Bruce`)
   - **Data de Nascimento**: `19/02/1972`
   - **Origem**: `Graduação`
   - **Curso**: `Ciência da Computação`

3. Clique em **Buscar**

4. ✅ **Resultado Esperado**: Redirecionamento para `/questionario?alunoId=1`
   - Nome "Bruce Wayne" aparece no cabeçalho
   - 17 questões são exibidas

5. Preencha as questões obrigatórias (marcadas com *):
   - Q1: Atualmente, você está trabalhando? → **Sim**
   - Q3: Trabalha na área em que se formou? → **Sim**
   - Q8: Quanto tempo depois de formado conseguiu seu primeiro emprego? → **Já trabalhava antes de se formar**
   - Q9: Já fez algum curso de Pós-Graduação? → **Não**
   - Q11: A formação na PUC Minas contribuiu para sua inserção no mercado de trabalho? → **Sim**
   - Q12: Como você avalia o curso que frequentou na PUC Minas? → **Excelente**
   - Q13: Você recomendaria a PUC Minas para outras pessoas? → **Sim**
   - Q16: Você tem interesse em participar de eventos promovidos pela PUC Minas para ex-alunos? → **Sim**

6. Clique em **Enviar Questionário**

7. ✅ **Resultado Esperado**:
   - Toast de sucesso aparece
   - Após 2 segundos, redirecionamento para `/aluno/busca`

#### Cenário 2: Diana Prince (Graduação - Direito)

1. Acesse: `http://localhost:4200/busca-aluno`

2. Preencha os campos:
   - **Nome Completo**: `Diana` (busca parcial funciona!)
   - **Data de Nascimento**: `15/03/1985`
   - **Origem**: `Graduação`
   - **Curso**: `Direito`

3. Clique em **Buscar**

4. ✅ **Resultado Esperado**: Redirecionamento para `/questionario?alunoId=2`

#### Cenário 3: Clark Kent (Pós-Graduação - MBA)

1. Acesse: `http://localhost:4200/busca-aluno`

2. Preencha os campos:
   - **Nome Completo**: `Clark Kent`
   - **Data de Nascimento**: `18/06/1980`
   - **Origem**: `Pós-Graduação`
   - **Curso**: `MBA em Gestão de Projetos`

3. Clique em **Buscar**

4. ✅ **Resultado Esperado**: Redirecionamento para `/questionario?alunoId=3`

#### Cenário 4: Aluno Não Encontrado

1. Acesse: `http://localhost:4200/busca-aluno`

2. Preencha com dados fictícios:
   - **Nome Completo**: `John Doe`
   - **Data de Nascimento**: `01/01/2000`
   - **Origem**: `Graduação`
   - **Curso**: `Ciência da Computação`

3. Clique em **Buscar**

4. ✅ **Resultado Esperado**: Redirecionamento para `/cadastro-aluno` (fluxo de novo cadastro)

## 📊 Verificar Dados Salvos

### Via JSON Server

Após enviar um questionário, você pode verificar se foi salvo:

```bash
curl http://localhost:3000/questionario-respostas
```

Ou acesse diretamente no navegador:
```
http://localhost:3000/questionario-respostas
```

### Estrutura da Resposta Salva

```json
{
  "id": "1",
  "alunoId": "1",
  "alunoNome": "Bruce Wayne",
  "dataPreenchimento": "2025-12-01T10:30:00.000Z",
  "respostas": [
    {
      "questaoId": "1",
      "opcaoId": "sim"
    },
    {
      "questaoId": "5",
      "textoResposta": "Wayne Enterprises"
    }
  ]
}
```

## 🧪 Testar Funcionalidades Específicas

### Teste 1: Validação de Campos Obrigatórios

1. Acesse um questionário (seguindo cenário 1)
2. **Não preencha** nenhum campo obrigatório
3. Tente clicar em **Enviar Questionário**
4. ✅ **Resultado Esperado**: Botão está desabilitado (cinza)

### Teste 2: Checkbox com Campo de Texto

1. Acesse um questionário
2. Na questão 10 (Pós-Graduação), marque a opção **"Mestrado"**
3. ✅ **Resultado Esperado**: Campo de texto "Especifique" aparece abaixo
4. Digite algo no campo (ex: "Mestrado em Engenharia")
5. Desmarque o checkbox
6. ✅ **Resultado Esperado**: Campo de texto desaparece e valor é limpo

### Teste 3: Loading States

1. Abra o DevTools (F12) → Network tab
2. Configure para "Slow 3G" (throttling)
3. Acesse um questionário
4. ✅ **Resultado Esperado**: Spinner de loading aparece enquanto carrega
5. Preencha e envie o questionário
6. ✅ **Resultado Esperado**: Botão mostra loading durante o envio

### Teste 4: Tratamento de Erros

1. **Pare o JSON Server** (Ctrl+C no terminal)
2. Tente acessar `/questionario?alunoId=1`
3. ✅ **Resultado Esperado**: Toast de erro aparece

## 📱 Teste Responsivo

1. Abra o DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Teste em diferentes resoluções:
   - **Mobile**: 375x667 (iPhone SE)
   - **Tablet**: 768x1024 (iPad)
   - **Desktop**: 1920x1080

✅ **Resultado Esperado**: Layout se adapta corretamente em todas as resoluções

## 🐛 Problemas Comuns

### Problema: "Aluno não encontrado"

**Solução**: Verifique se:
- O JSON Server está rodando
- Os dados do aluno existem no `db.json`
- O `cursoId` do aluno corresponde a um curso válido

### Problema: Erro 404 ao carregar questionário

**Solução**: Verifique se:
- O endpoint `/questionario` existe no `db.json`
- O JSON Server está rodando na porta 3000

### Problema: Campos não aparecem

**Solução**: Verifique no console do navegador (F12) se há erros JavaScript

## ✅ Checklist de Testes

- [ ] JSON Server rodando na porta 3000
- [ ] Angular rodando na porta 4200
- [ ] Busca encontra aluno existente → Redireciona para questionário
- [ ] Busca NÃO encontra aluno → Redireciona para cadastro
- [ ] Nome do aluno aparece no cabeçalho do questionário
- [ ] Todas as 17 questões são exibidas
- [ ] Campos obrigatórios marcados com *
- [ ] Botão "Enviar" desabilitado quando formulário inválido
- [ ] Checkbox com texto funciona (aparece/desaparece)
- [ ] Questionário é salvo com sucesso
- [ ] Toast de sucesso aparece após salvar
- [ ] Redireciona para busca após 2 segundos
- [ ] Dados aparecem em `/questionario-respostas`
- [ ] Layout responsivo funciona em mobile/tablet/desktop

## 🎉 Sucesso!

Se todos os testes passarem, a feature de Questionário está funcionando perfeitamente! 🚀
