# Deploy

The site is the nginx image. PocketBase is a second container on the same Docker network. Caddy on that network terminates TLS and routes the admin API. No extra auth layer sits in front of PocketBase.

## Compose

```yaml
services:
  portfolio:
    image: faraz-portfolio
    build:
      context: .
    restart: unless-stopped
    expose:
      - "80"

  pocketbase:
    image: faraz-pocketbase
    build:
      context: ./pocketbase
    restart: unless-stopped
    command: ["pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data", "--migrationsDir=/pb_migrations"]
    volumes:
      - pb_data:/pb_data
      - ./pocketbase/pb_migrations:/pb_migrations:ro
    expose:
      - "8090"

volumes:
  pb_data:
```

Build both for the server architecture:

```bash
docker compose build
docker compose up -d
```

## Caddy

Attach Caddy to the compose network, then:

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

`/_/` is the PocketBase dashboard. `/api/` is the content API the site reads. Do not add a Caddy basic-auth wrapper.

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
