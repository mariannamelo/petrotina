<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# PetRotina project rules

## Base de interface
- Base oficial de UI: shadcn
- Não usar AEVO-DS em hipótese nenhuma
- Não reutilizar imports, aliases, tokens, componentes ou padrões do AEVO
- Se faltar componente, usar a biblioteca já configurada
- Não implementar componente manualmente se houver equivalente pronto
- Exceção permitida: time-picker, porque não existe componente nativo equivalente no shadcn
- Se o time-picker atual tiver herança do AEVO, limpar e alinhar à base shadcn

## Estado atual do projeto
- foco atual: estrutura, UX e UI mínima funcional
- sem refinamento visual neste momento
- sem backend neste momento
- sem implementação de mês neste momento
- sem drag and drop neste momento
- sem resize neste momento

## Agenda
- agenda de petshop e agenda de creche/hotelzinho não seguem a mesma lógica
- petshop: agenda orientada a horário
- creche/hotelzinho: operação orientada a presença e capacidade

## Regras de conflito — petshop
- bloquear se o mesmo pet tiver sobreposição de horário no mesmo dia
- bloquear se o mesmo responsável tiver sobreposição de horário no mesmo dia
- permitir mesmo horário para pets diferentes com responsáveis diferentes
- validar por intervalo, não apenas por hora inicial
- na edição, não comparar o item com ele mesmo

## Creche e hotelzinho
- não usar a mesma trava de conflito do petshop
- lógica futura por capacidade operacional
- exemplos futuros:
  - limite de animais no dia
  - limite por turma
  - limite por turma + responsável
- essas regras ficam em configurações operacionais, não na agenda do petshop

## Execução
- sempre apresentar plano antes de implementar
- manter escopo estrito
- preservar o que já funciona
- revisar saúde do código ao final
- não gerar vídeo, walkthrough ou narrativa de teste
- a validação manual de navegação será feita pela usuária
<!-- END:nextjs-agent-rules -->
