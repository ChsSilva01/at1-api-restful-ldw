# Estágio 1: Compilação (Build)
FROM node:24-alpine AS builder

# Configura o diretorio global do pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm
RUN pnpm config set strict-dep-builds false

# Copia os arquivos de manifesto e instala dependências
COPY package.json ./
RUN pnpm install --shamefully-hoist

# Copia o código-fonte e realiza a compilação (gera a pasta dist)
COPY . .
RUN pnpm run build

# Estágio 2: Produção (Runner Otimizado)
FROM node:24-alpine AS runner

WORKDIR /app

# Copia apenas o necessário do estágio de build para rodar a API
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expõe a porta 3000
EXPOSE 3000

# Executa o script de produção (substitua por "npm start" se configurado no package.json)
CMD ["node", "dist/server.js"]