FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY dist/pogos-frontend/browser .

COPY envsubst.sh /tmp/envsubst.sh
RUN chmod +x /tmp/envsubst.sh

ENTRYPOINT ["/tmp/envsubst.sh"]

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
