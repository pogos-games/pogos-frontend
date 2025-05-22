#!/bin/sh

envsubst < /usr/share/nginx/html/assets/environment.template.ts > /usr/share/nginx/html/assets/environment.ts

envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json
exec "$@"
