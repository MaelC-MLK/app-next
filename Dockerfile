# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers de configuration pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers et construire l'application
COPY . .
RUN npm run build

# Étape de production
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html

# Exposer le port utilisé par nginx
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]