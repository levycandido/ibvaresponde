# Backend Fix Required - Opção B: Corrigir Validação

## O Problema
O endpoint `POST /surveys` rejeita payloads válidos com dois erros:
1. **Valida `responses.data`** mesmo quando é um array vazio válido
2. **Valida `surveyId`** que ainda não existe durante criação

## A Solução

### Localize o arquivo Lambda Handler
Procure por um arquivo como:
- `lambda_handler.py` ou `handler.py` ou `index.js`
- Ou em um arquivo de validação como `validators.py` ou `validation.js`

### Encontre a Validação de Survey Creation
Procure por código que valida `responses`:

```python
# ANTES (Incorreto)
if not isinstance(payload.get('responses'), dict):
    raise ValidationError("responses deve ser um objeto")

if not isinstance(payload['responses'].get('data'), list):
    raise ValidationError("responses.data deve ser uma lista de respostas")

# Validação incorreta que rejeita arrays vazios
for response in payload['responses']['data']:
    if not response.get('surveyId'):
        raise ValidationError("surveyId é obrigatório")
```

### Corrija Para (Opção B):

```python
# DEPOIS (Correto)
if not isinstance(payload.get('responses'), dict):
    raise ValidationError("responses deve ser um objeto")

# Remover ou fazer condicional a validação de data
# if not isinstance(payload['responses'].get('data'), list):
#     raise ValidationError("responses.data deve ser uma lista de respostas")

# IMPORTANTE: Não validar surveyId durante CRIAÇÃO
# Isso só deve ser validado quando processando responses EXISTENTES
# Para criar survey: responses.data pode estar vazio []
# Para submeter responses: responses.data deve ter surveyId válido

if is_submitting_responses(request):  # Se é POST /surveys/{id}/responses
    for response in payload['responses']['data']:
        if not response.get('surveyId'):
            raise ValidationError("surveyId é obrigatório")
else:  # Se é criando survey POST /surveys
    # Aceitar responses vazios durante criação
    pass
```

## Checklist da Correção

- [ ] Remover ou comentar validação que rejeita `data: []`
- [ ] Remover ou condicionalizar validação de `surveyId`
- [ ] Testar com payload vazio: `responses: { data: [], frequencias: [] }`
- [ ] Testar com payload real para submit de respostas
- [ ] Deploy da Lambda

## Payload que Será Enviado pelo Frontend

```json
{
  "survey": {
    "titulo": "Pesquisa de Teste",
    "descricao": "Descrição",
    "status": "PUBLISHED",
    "dataInicio": "2026-08-10",
    "dataFim": "2026-08-15",
    "criadoPor": "user-id"
  },
  "questions": [
    {
      "titulo": "Pergunta 1",
      "descricao": "Qual é sua opinião?",
      "tipo": "RADIO",
      "obrigatoria": true,
      "ordem": 1,
      "options": [
        {
          "descricao": "Muito Bom",
          "ordem": 1
        }
      ]
    }
  ],
  "responses": {
    "data": [],
    "frequencias": []
  }
}
```

## Contato

Assim que a validação for corrigida, o frontend enviará este payload e a pesquisa será criada com sucesso.
