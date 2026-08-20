# service-a

Minimal Express microservice POC for testing a Jenkins → Docker Hub → Helm Git repo → Argo CD → Kubernetes pipeline.

## Endpoints

- `GET /` — identifies the service.
- `GET /health` — returns `{"status":"ok"}`.
- `GET /nano` — calls Nano Service A (via `NANO_SERVICE_URL`) and returns its response.

## Environment variables

- `PORT` (default `3000`)
- `NANO_SERVICE_URL` (default `http://nano-service-a:3000`) — must point to the Nano Service A container/service.

## Run locally

```bash
npm install
npm start
```

## Docker

Build:

```bash
docker build -t service-a:latest ./service-a
```

Run:

```bash
docker run -p 3000:3000 service-a:latest
```

To test `/nano` when running both containers locally on the same Docker network, set `NANO_SERVICE_URL` to point at the Nano Service A container, e.g. run both on a shared user-defined bridge network and pass `-e NANO_SERVICE_URL=http://nano-service-a:3000`.
