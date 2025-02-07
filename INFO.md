# Troubleshooting

## Install

can't install. add `"neverBuiltDependencies": ["@discordjs/opus"]` to package.json

```json
  "pnpm": {
    "overrides": {
      "onnxruntime-node": "1.20.0"
    },
    "neverBuiltDependencies": ["@discordjs/opus"]
  },
```

and `pnpm add opusscript`.

## Start

First `pnpm start` requires downloading `fast-bge-small-en-v1.5` for embedding to the ./cache folder

## Instructions

Fix error: Used disallowed intents. Active The Discord Bot
Bot -> Privileged Gateway Intents -> MESSAGE CONTENT INTENT

Discord Bot needs to be Tagged.

## DB

Defined in database/index
it is storing local if no postgres url is provided

## Deploy

In `docker-compose.yaml` change Port and expose it to firewall

`ERR_USE_AFTER_CLOSE`
on railway, digital ocean, needs to `DAEMON_PROCESS=true`

**Deploying an Isolated Monorepo in Railway**

`Service → Settings → Source → Root Directory`

## Project folder name can't contain space

node-hid issue when running `pnpm install`

## Deveop Plugin

Build it with Goat SDK. Import it. Map it to the GOAT Plugin.

Why mono? to avoid

```bash
cd ../goat-erc4646
npm version patch && npm publish
cd ../eliza-plugin-goat && pnpm install
npm version patch && npm publish
cd ../bebop-eliza && pnpm install
```

## Railway vs VPS

Railway can build using the `Dockerfile` provided in this repo with `docker-compose.yml`.

**VPS**

VPS specially low on resources. It is better to use CI/CD. Learn more: https://docs.dokploy.com/docs/core/applications/going-production

- gh workflow `deploy.yml` build and push the Docker image to Docker Hub
- Use docker image from registry https://registry-1.docker.io
- set `SERVER_PORT=YOUR_PORT` and `DAEMON_PROCESS=true`
- Use Docker Image `pgvector/pgvector:pg17` and add `POSTGRES_URL` to .env. Assign Port and add rule to firewall

## Use Multi-Architecture Images

- exec /usr/local/bin/docker-entrypoint.sh: exec format error
- Usually Architecture Mismatch between amd64 and arm64

`docker buildx build --platform=linux/arm64 -t your-image:latest .`

Known Issues:
https://gist.github.com/theozzz/2c848b857d16ec53a255447002845b57

## Autodeploy

Copy webhook and use it in Docker Hub:
https://hub.docker.com/repositories/

## Testing in Discord

Mention the bot in the channel when `shouldRespondOnlyToMentions` is set to true. Don't paste text or the bot will ignore it. Type it.

## Journal

A lot of issues need to be fixed to be able to deploy on arm64 server.
railway seems the fastest way to deploy. But sometimes the bot doesn't go live.

## TODOS

- [ ] Multi Agent with character2
- [ ] Integrate plugins
- [ ] Use second vector database or insert knowledge ex. https://github.com/InjectiveLabs/iagent-ts/blob/b72128e9b389a2fddd9148fa4700f1404d2e5544/packages/client-github/src/index.ts#L127

## References

https://github.com/elizaos/eliza

https://github.com/goat-sdk/goat

