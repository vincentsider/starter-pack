# Utiliser une image Nginx légère comme image de base
FROM nginx:alpine

# Copier les fichiers statiques du répertoire public local
# dans le répertoire de service par défaut de Nginx
COPY public/ /usr/share/nginx/html/

# Exposer le port 80 pour le trafic HTTP
EXPOSE 80

# La commande par défaut pour démarrer Nginx est gérée par l'image de base
# (CMD ["nginx", "-g", "daemon off;"])