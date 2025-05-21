FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY dist/pogos-frontend/browser .

COPY envsubst.sh /tmp/envsubst.sh
RUN chmod +x /tmp/envsubst.sh

ENTRYPOINT ["/tmp/envsubst.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
