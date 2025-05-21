FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/pogos-frontend/browser .

COPY envsubst.sh /tmp/envsubst.sh
ENTRYPOINT ["/tmp/envsubst.sh"]
RUN chmod +rx /tmp/envsubst.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
