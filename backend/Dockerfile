# 1. Define a imagem de origem base 
FROM node:24-alpine

# 2. Configura o diretorio global do pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 3. Define diretório de trabalho interno do container
WORKDIR /app

# 4. Instalar o pnpm globalmente
RUN npm install -g pnpm

# Desativa restrições
RUN pnpm config set strict-dep-builds false

# 5. Copia os arquivos de manifesto
COPY package.json ./

# 6. Força o pnpm a instalar as dependências de forma plana (compatível com volumes do Docker)
RUN pnpm install --shamefully-hoist

# 7. Copia todo o restante do código
COPY . .

# 8. Expõe a porta
EXPOSE 3000

# 9. Comando para inicializar a aplicação
CMD ["pnpm", "dev"]