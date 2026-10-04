[![Continuous Integration](https://github.com/ChsSilva01/at1-api-restful-ldw/actions/workflows/ci.yml/badge.svg)](https://github.com/ChsSilva01/at1-api-restful-ldw/actions/workflows/ci.yml)

# Projeto Agendamento - Atividade LDW/IEC

Repositório estruturado em formato monorepo para gerenciamento de componentes de backend e frontend, integrando automação de esteira de CI/CD, análise estática de código e governança com Husky.

## Estrutura do Projeto

O projeto está dividido utilizando workspaces do pnpm:

- **/backend**: API em Node.js com Express, TypeScript e Sequelize.
- **/app**: Interface frontend desenvolvida com React e Vite.
- **/.github/workflows**: Esteira de integração contínua (CI) com GitHub Actions.
- **/.husky**: Ganchos de versionamento local (Git Hooks) para validação pré-commit.

## Tecnologias Utilizadas

- **Runtime**: Node.js
- **Gerenciador de Pacotes**: pnpm (Workspaces)
- **Backend**: Express, TypeScript, Sequelize, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Qualidade de Código**: ESLint (Flat Config), Prettier
- **Automação e Infraestrutura**: Docker, Docker Compose, GitHub Actions, Husky


## Validações e Qualidade de Código

O repositório conta com verificações automáticas para garantir a integridade do código antes de qualquer integração:

* **Análise Estática (Linting)**: Executa o ESLint para identificar desvios de padrão e variáveis não utilizadas.
* **Formatação**: Utiliza o Prettier para padronização visual dos arquivos.
* **Checagem de Tipos**: Utiliza o compilador do TypeScript com a flag `--noEmit` para validação estrita.
* **CI/CD**: O GitHub Actions executa automaticamente a esteira de build e testes a cada Pull Request ou Push na branch principal.
* **Husky**: Executa validações locais automáticas antes de cada commit.


