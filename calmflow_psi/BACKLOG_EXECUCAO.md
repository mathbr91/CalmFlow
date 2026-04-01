# Backlog de Execucao - CalmFlow Psi

## Direcao Recomendada
- Plataforma inicial: web.
- Motivo: melhor uso clinico em escritorio, leitura de timeline, produtividade em painel e menor friccao para operacao do psicologo.
- Estrategia: backend aproveitando o projeto CalmFlow atual + frontend separado em calmflow_psi.
- Decisao validada: calmflow_psi sera somente web.
- Decisao validada: psicologo podera ser criado por admin ou por auto-cadastro.
- Decisao validada: cada paciente tera apenas 1 psicologo vinculado.

## Meta do MVP
Entregar um acesso funcional para psicologo com login proprio, visualizacao de pacientes vinculados e leitura do historico principal de cada paciente com seguranca de acesso.

## Ordem de Execucao
1. Fundacao de dominio e permissao.
2. Autenticacao do psicologo.
3. Painel inicial com lista de pacientes.
4. Tela de detalhe do paciente.
5. Notas clinicas e marcacao de prioridade.
6. Endurecimento de seguranca e testes.

## Epico 1 - Fundacao de Dominio
### Objetivo
Criar a base de dados e regras de acesso para distinguir psicologo de paciente.

### Tarefas
1. Criar modelo PsicologoProfile.
2. Criar modelo VinculoTerapeutico com restricao 1:1 (paciente unico).
3. Criar modelo NotaClinica.
4. Definir campo de role/perfil do usuario.
5. Criar fluxo de auto-cadastro de psicologo.
6. Criar fluxo/admin para cadastrar psicologo manualmente.
7. Adicionar no perfil do paciente: nome_psicologo, telefone_psicologo, registro_ordem_psicologo.
8. Implementar rotina de vinculacao automatica por registro da ordem (registro_profissional == registro_ordem_psicologo).
9. Criar migrations.

### Criterios de aceite
1. Usuario psicologo pode ser identificado de forma confiavel.
2. Relacao psicologo-paciente fica registrada no banco com regra de 1 paciente para 1 psicologo.
3. Notas clinicas ficam separadas dos dados do paciente.
4. Quando houver correspondencia de registro profissional, o paciente e vinculado automaticamente ao psicologo correto.

## Epico 2 - Autenticacao Psi
### Objetivo
Separar claramente o login do psicologo do login do paciente.

### Tarefas
1. Criar endpoint dedicado de login psi.
2. Criar endpoint /api/v1/psi/me.
3. Bloquear acesso psi para usuarios sem role de psicologo.
4. Retornar dados basicos do psicologo autenticado.
5. Garantir que psicologo auto-cadastrado e psicologo criado por admin usem o mesmo fluxo de autenticacao.
6. Criar testes de autenticacao e permissao.

### Criterios de aceite
1. Psicologo autentica com sucesso no fluxo psi.
2. Paciente autenticado nao entra no fluxo psi.
3. Endpoint /psi/me responde apenas para psicologo.
4. Fluxo de login/cadastro respeita os dois modos de provisionamento do psicologo.

## Epico 3 - Painel Inicial do Psicologo
### Objetivo
Entregar a primeira tela util para operacao clinica.

### Tarefas
1. Criar endpoint de lista de pacientes vinculados.
2. Incluir nome, email, ultimo check-in, ultima emergencia e prioridade.
3. Adicionar busca por nome/email.
4. Adicionar filtro por prioridade.
5. Definir estado vazio e loading.
6. Exibir tambem telefone do psicologo e registro da ordem no detalhe resumido quando necessario para validacao operacional.
7. Criar testes de lista e filtro.

### Criterios de aceite
1. Psicologo visualiza apenas seus pacientes vinculados.
2. Lista permite localizar rapidamente um paciente.
3. Painel destaca quem precisa de atencao.

## Epico 4 - Detalhe do Paciente
### Objetivo
Permitir leitura clinica basica do historico do paciente.

### Tarefas
1. Criar endpoint de detalhe do paciente para psicologo.
2. Exibir dados do perfil do paciente.
3. Exibir timeline de check-ins.
4. Exibir timeline de emergencias/sessoes.
5. Exibir indicadores simples de tendencia em 7 dias.
6. Criar testes de acesso e resposta.

### Criterios de aceite
1. Psicologo le o historico consolidado do paciente.
2. Dados aparecem ordenados do mais recente para o mais antigo.
3. Usuario nao vinculado nao acessa o detalhe.

## Epico 5 - Notas Clinicas e Prioridade
### Objetivo
Adicionar operacao minima para acompanhamento profissional.

### Tarefas
1. Criar endpoint de CRUD de NotaClinica.
2. Criar campo de prioridade clinica no vinculo ou no paciente monitorado.
3. Permitir alteracao manual de prioridade.
4. Exibir notas no detalhe do paciente.
5. Criar testes de permissao e persistencia.

### Criterios de aceite
1. Psicologo registra nota privada do paciente.
2. Nota nao aparece em endpoints do paciente.
3. Prioridade pode ser marcada como normal, atencao ou urgente.

## Epico 6 - Frontend Web Psi
### Objetivo
Construir a primeira interface da vertente calmflow_psi.

### Tarefas
1. Definir stack do frontend web.
2. Criar tela de login psi.
3. Criar layout base do painel.
4. Criar lista de pacientes.
5. Criar pagina de detalhe do paciente.
6. Conectar JWT e logout.

### Criterios de aceite
1. Fluxo login -> painel -> detalhe funciona ponta a ponta.
2. Interface e legivel em notebook/desktop.
3. Estados de erro e loading estao presentes.

## Epico 7 - Seguranca e Qualidade
### Objetivo
Fechar o MVP com nivel minimo de seguranca e confiabilidade.

### Tarefas
1. Adicionar logs de acesso psi.
2. Aplicar rate limit em login psi.
3. Revisar respostas de erro para nao vazar dados sensiveis.
4. Criar testes automatizados de permissao por role.
5. Criar smoke tests do fluxo clinico principal.

### Criterios de aceite
1. Psicologo so acessa o que lhe pertence.
2. Falhas de autenticacao nao expõem detalhes internos.
3. Testes automatizados cobrem o fluxo MVP.

## Dependencias Entre Epicos
1. Epico 1 desbloqueia 2, 3, 4 e 5.
2. Epico 2 desbloqueia 6.
3. Epicos 3 e 4 sao o coracao do MVP.
4. Epico 5 pode entrar logo apos 4 ou junto no fechamento do MVP.
5. Epico 7 roda em paralelo, com fechamento final antes de producao.

## Backlog Priorizado Para Comecar Agora
1. Definir role do psicologo no backend.
2. Modelar PsicologoProfile.
3. Modelar VinculoTerapeutico.
4. Criar login psi.
5. Criar endpoint /api/v1/psi/me.
6. Criar testes de permissao psi.

## Perguntas Para Validacao Conjunta
1. A prioridade sera calculada automaticamente, manualmente ou hibrida?
2. As notas clinicas terao apenas texto livre ou tambem tags/categorias?
3. O painel inicial deve mostrar so pacientes vinculados ativos?

## Proposta de Inicio Imediato
Se voce aprovar a direcao, a Fase 1 pode comecar assim:
1. Backend: role psicologo + modelos PsicologoProfile e VinculoTerapeutico com restricao 1:1.
2. Backend: campos de psicologo no perfil do paciente (nome, telefone, registro_ordem_psicologo).
3. Backend: regra de vinculacao automatica por registro profissional da ordem.
4. Backend: endpoints /api/v1/psi/login e /api/v1/psi/me.
5. Testes Django: permissao, autenticacao e isolamento de acesso.
6. Depois disso, abrimos o frontend calmflow_psi.
