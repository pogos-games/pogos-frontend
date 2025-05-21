FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/pogos-frontend/browser .

COPY envsubst.sh /tmp/envsubst.sh
RUN chmod +rx /tmp/envsubst.sh

# Modifier l'utilisateur après avoir tout copié/configuré
USER nginx

ENTRYPOINT ["/tmp/envsubst.sh"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
