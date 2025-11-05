# Use Node.js 20 LTS
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila TypeScript
RUN npm run build

# Exponha a porta do Apollo Server
EXPOSE 4000

# Comando para rodar o servidor
CMD ["npm", "start"]
