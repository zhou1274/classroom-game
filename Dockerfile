FROM caddy:2-alpine

WORKDIR /srv

COPY . /srv
COPY Caddyfile /etc/caddy/Caddyfile

RUN caddy fmt /etc/caddy/Caddyfile --overwrite

EXPOSE 3000

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
