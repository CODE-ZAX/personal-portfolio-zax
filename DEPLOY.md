# Deploy

The site is the nginx image. PocketBase is a second container on the same Docker network. Caddy on that network terminates TLS and routes the admin API. No extra auth layer sits in front of PocketBase.

## Compose

The compose file in the repo is the source of truth. PocketBase reads host `/proc` at `/host/proc` and host disk usage with `df` on `/host/root` (the host root mounted read-only). Container names come from `docker-socket-proxy` on an internal network. The Docker socket is not mounted into PocketBase.

```yaml
services:
  portfolio:
    image: faraz-portfolio
    build:
      context: .
    restart: unless-stopped
    expose:
      - "80"
    networks:
      - web

  pocketbase:
    image: faraz-pocketbase
    build:
      context: ./pocketbase
    restart: unless-stopped
    command:
      [
        "pocketbase",
        "serve",
        "--http=0.0.0.0:8090",
        "--dir=/pb_data",
        "--migrationsDir=/pb_migrations",
        "--hooksDir=/pb_hooks",
      ]
    environment:
      DOCKER_PROXY_URL: http://docker-socket-proxy:2375
    volumes:
      - pb_data:/pb_data
      - ./pocketbase/pb_migrations:/pb_migrations:ro
      - ./pocketbase/pb_hooks:/pb_hooks:ro
      - /proc:/host/proc:ro
      - /:/host/root:ro
    expose:
      - "8090"
    networks:
      web:
        priority: 100
      socket:
        priority: 10

  docker-socket-proxy:
    image: tecnativa/docker-socket-proxy:0.3.0
    restart: unless-stopped
    environment:
      DISABLE_IPV6: "1"
      CONTAINERS: "1"
      INFO: "1"
      POST: "0"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - socket

networks:
  web:
  socket:
    internal: true

volumes:
  pb_data:
```

Build both for the server architecture:

```bash
docker compose build
docker compose up -d
```

## Caddy

Attach Caddy to the compose network named `web` (not `socket`), then:

```caddyfile
example.com {
	encode gzip

	handle /api/* {
		reverse_proxy pocketbase:8090
	}

	handle /_/* {
		reverse_proxy pocketbase:8090
	}

	handle {
		reverse_proxy portfolio:80
	}
}
```

`/_/` is the PocketBase dashboard. `/api/` is the content API and `GET /api/admin/stats`. `/admin` is a page of the portfolio container, so this Caddyfile does not need a new handle for it. Do not add a Caddy basic-auth wrapper. Do not publish the socket proxy.

## Admin hub

Open `https://example.com/admin`. It asks for the PocketBase superuser. The page is not the protection: `GET /api/admin/stats` and the `admin_tools` collection both refuse anyone who is not a superuser.

To add a tool, create a record in `admin_tools` with a name, url, description, icon key (`content`, `containers`, `workflow`, or `chat`), sort order, and an optional health URL. The hub reads that collection. If the API is down it shows the four built-in links.

Host figures are read inside PocketBase from `/host/proc` (`stat`, `meminfo`, `loadavg`, `uptime`) and `df -B1 /host/root`. Container state is a GET to the socket proxy. The proxy allows container list and info only, and POST is off. It has no published ports and sits on the internal `socket` network with PocketBase. `DISABLE_IPV6=1` makes it listen on IPv4 port 2375. The image's default IPv6 bind does not accept IPv4 connections when the host has IPv6 turned off. PocketBase joins `web` at a higher priority than `socket`, so its default route stays on the public network. Health checks and superuser email need that route. The internal network has no gateway.

## First superuser

Do this on the server. Do not commit the email or password.

```bash
docker compose exec pocketbase pocketbase superuser upsert --dir=/pb_data YOU@example.com 'a-long-password'
```

Or open `https://example.com/_/` once, before any superuser exists, and use the install form. After the first superuser exists, that form is gone.

## MFA

In the dashboard, open Collections, then `_superusers`, then Options. Turn on OTP and MFA. PocketBase will ask for a one-time password as the second factor on the next sign-in. The message with the code is sent only if SMTP is configured under Settings, Mail settings. Until SMTP is set, create the OTP from the server logs or leave MFA off until mail works.

## Rate limits

A migration turns rate limits on: guests are capped on `/api/`, and password and OTP requests are tighter. Change the numbers under Settings, Rate limits if the live traffic needs a different budget.

## Backups

`pb_data` is the whole database, including uploaded files. Copy it nightly and keep it off the server. Example cron, run as a user who can read the volume:

```bash
0 3 * * * docker run --rm -v personal-portfolio-zax_pb_data:/pb_data:ro -v /var/backups/faraz:/backup alpine:3.22 tar -C /pb_data -czf /backup/pb_data-$(date +\%F).tgz .
```

Use the volume name `docker volume ls` shows. Restore by stopping PocketBase, unpacking into an empty volume, and starting it again.
