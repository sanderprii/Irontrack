# Kasutame uusimat Node.js Alpine versiooni
FROM node:20-slim

# Installime OpenSSL, sest Prisma vajab seda
RUN apt-get update && apt-get install -y openssl

# Määrame töökausta
WORKDIR /app

# Kopeerime package.json ja package-lock.json
COPY package*.json ./

# Paigaldame sõltuvused
RUN npm install

# Kopeerime ülejäänud koodi
COPY . .

# Eemaldame Prisma vanad binaarid ja genereerime uued
RUN rm -rf node_modules && npm install
RUN npx prisma generate

# Avame pordi
EXPOSE 5000
# Käivitame serveri
CMD ["node", "src/index.js"]
