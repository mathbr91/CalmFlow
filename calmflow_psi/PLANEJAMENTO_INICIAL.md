# Planejamento Inicial - CalmFlow Psi

## Objetivo
Criar a terceira vertente do ecossistema CalmFlow: uma experiencia dedicada ao psicologo, com autenticacao propria, painel clinico e acompanhamento de pacientes com seguranca e privacidade.

## Principios
- Separacao clara entre experiencia do paciente e experiencia do psicologo.
- Privacidade e seguranca de dados como requisito central.
- Evolucao por fases curtas com validacao funcional a cada entrega.
- Reaproveitar o maximo da API atual sem quebrar o que ja funciona.

## Escopo Proposto (MVP)
1. Autenticacao do psicologo
- Login exclusivo para psicologo.
- Cadastro de psicologo por dois fluxos: auto-cadastro e criacao manual por admin.
- Controle de papel/perfil (role: psicologo).
- Fluxo de sessao e logout.

2. Painel inicial
- Lista de pacientes vinculados.
- Indicadores simples (ultimos check-ins, risco, alerta recente).
- Busca basica por nome/email.

3. Detalhe do paciente
- Timeline de check-ins e emergencias.
- Sinais de tendencia (ex.: piora em 7 dias).
- Campo de anotacoes do psicologo (privadas).

4. Alertas e prioridade
- Marcadores: normal, atencao, urgente.
- Filtros no painel por prioridade.

## Itens Fora do MVP (fase 2+)
- Videochamada integrada.
- Prescricao digital.
- Agenda completa com lembretes automáticos.
- Dashboards analiticos avancados.

## Arquitetura Sugerida
1. Backend
- Novos endpoints em /api/v1/psi/...
- Permissao baseada em role.
- Vinculo paciente-psicologo em modelo dedicado com regra 1:1 (um paciente vinculado a um unico psicologo).
- Associacao automatica de pacientes por numero de registro profissional do psicologo.

2. Frontend Psi
- Projeto separado em calmflow_psi (web-only para uso clinico).
- Autenticacao JWT reutilizando infraestrutura existente.
- Layout de painel e detalhe.

## Modelos de Dados (proposta)
1. PsicologoProfile
- user (OneToOne)
- registro_profissional
- especialidade
- ativo

2. VinculoTerapeutico
- psicologo (FK)
- paciente (OneToOne para garantir 1 psicologo por paciente)
- status (ativo/inativo)
- criado_em

3. Campos adicionais no perfil do paciente
- nome_psicologo
- telefone_psicologo
- registro_ordem_psicologo
- regra: quando psicologo cadastrar/login com registro_profissional igual ao registro_ordem_psicologo informado no paciente, o vinculo e criado/atualizado automaticamente.

4. NotaClinica
- psicologo (FK)
- paciente (FK)
- conteudo
- criado_em

## Permissoes e Seguranca
- Psicologo so acessa pacientes vinculados.
- Paciente nunca acessa endpoints psi.
- Log de acesso para trilha de auditoria.
- Rate limit e bloqueio basico de brute force em login.

## Roadmap de Entrega
1. Fase 1 - Fundacao
- Role psicologo + login dedicado.
- Endpoint /api/v1/psi/me.
- Testes de permissao.

2. Fase 2 - Painel MVP
- Lista de pacientes vinculados.
- Filtro e busca simples.
- Tela de detalhe com historico basico.

3. Fase 3 - Operacao Clinica
- Notas clinicas.
- Alertas de prioridade.
- Melhorias de UX e desempenho.

## Criterios de Aceite para iniciar implementacao
1. Plataforma validada: calmflow_psi sera somente web.
2. Cadastro do psicologo validado: auto-cadastro e criacao manual por admin.
3. Regra de vinculo validada: paciente pode ter somente 1 psicologo.
4. Perfil do paciente deve coletar: nome do psicologo, telefone do psicologo e registro da ordem.
5. Vinculacao automatica por registro profissional deve ocorrer quando houver correspondencia de registro.
