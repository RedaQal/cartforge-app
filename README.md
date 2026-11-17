# 🛒 CartForge

## Why this project

I built CartForge to learn how software is actually delivered in production teams, not just how to write it. Every phase adds one real-world practice: containers, CI, Kubernetes, GitOps, monitoring, and security scanning.

![Status](https://img.shields.io/badge/status-in%20progress-orange)
![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![Next.js](https://img.shields.io/badge/Next.js-frontend-black)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5)

## About

CartForge is intentionally small on features and serious on engineering. The goal is not the shop itself, but everything around it: how code travels from a commit to a running, monitored deployment, following the practices used in production teams.

## Architecture (target)

```mermaid
flowchart LR
    Dev[Developer] -->|pull request| GH[GitHub]
    GH -->|webhook| J[Jenkins]
    J -->|build, test, scan| R[(Image registry)]
    J -->|deploy| K8s
    subgraph K8s[Minikube cluster]
        FE[Next.js frontend] --> CAT[catalog-service]
        CAT --> DB[(PostgreSQL)]
    end
    K8s -.metrics.-> P[Prometheus] --> G[Grafana]
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA |
| Database | PostgreSQL + Flyway migrations |
| Containers | Docker, multi-stage builds |
| CI/CD | Jenkins (pipeline as code) |
| Orchestration | Kubernetes (Minikube), Helm |
| Observability | Prometheus, Grafana, Spring Actuator / Micrometer |
| Security | Trivy, SonarQube, OWASP Dependency-Check |

## Project structure

```
cartforge-app/
├── services/
│   └── catalog-service/    # Spring Boot API (products), Flyway migrations, Dockerfile
├── frontend/               # Next.js app, Dockerfile
├── docs/adr/               # Architecture decision records
├── docker-compose.yml      # Full local stack: db + backend + frontend
├── CONTRIBUTING.md
└── README.md
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get one product (404 if unknown) |
| GET | `/actuator/health` | Liveness and readiness probes |
| GET | `/actuator/prometheus` | Metrics for Prometheus |

## Container images

Multi-stage builds, non-root users, and dependency layer caching:

| Image | Base | Size (compressed) | Runs as |
|---|---|---|---|
| catalog-service | `eclipse-temurin:21-jre-alpine` | ~127 MB | non-root (`app`) |
| frontend | `node:24-alpine` (Next.js standalone output) | ~75 MB | non-root (`node`) |

Build tools (Maven, JDK, dev dependencies) stay in the build stage and never reach the final image.

## Repositories

- **cartforge-app**: application code (this repo)
- **cartforge-gitops**: Helm charts and Kubernetes manifests

## Engineering principles

- Trunk-based development with protected `main` and pull requests only
- Conventional Commits and SemVer releases
- 12-factor configuration: env vars, no secrets in Git
- Build once, promote the same image through dev → staging → prod
- Shift-left security: scans run in the pipeline, not after release
- Decisions documented as ADRs in [`docs/adr`](docs/adr)

## Roadmap

- [x] Phase 0: repository foundations
- [x] Phase 1: catalog-service + Next.js frontend (MVP)
- [x] Phase 2: Dockerfiles and docker-compose
- [x] Phase 3: Jenkins CI pipeline
- [ ] Phase 4: Kubernetes deployment with Helm
- [ ] Phase 5: CD with dev / staging / prod environments
- [ ] Phase 6: Prometheus and Grafana monitoring
- [ ] Phase 7: order-service, auth-service, API gateway, autoscaling
- [ ] Phase 8: hardening (NetworkPolicies, RBAC, backups)

## Getting started

### Run the whole stack (Docker only)

**Prerequisite:** Docker Desktop (or Docker Engine with Compose v2).

```bash
git clone https://github.com/RedaQal/cartforge-app.git
cd cartforge-app
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Catalog API | http://localhost:8080/api/products |
| Backend health | http://localhost:8080/actuator/health |
| Frontend health | http://localhost:3000/api/health |
| Prometheus metrics | http://localhost:8080/actuator/prometheus |

Stop everything with `docker compose down` (add `-v` to also delete the database volume).

### Local development (without containers for the apps)

**Prerequisites:** JDK 21, Node.js LTS, Docker (for PostgreSQL and Testcontainers).

```bash
# 1. database
docker compose up -d db

# 2. backend
cd services/catalog-service
./mvnw spring-boot:run

# 3. frontend (new terminal)
cd frontend
echo "CATALOG_API_URL=http://localhost:8080" > .env.local
npm install
npm run dev
```

### Run the tests

```bash
cd services/catalog-service
./mvnw verify      # integration tests use Testcontainers, Docker must be running
```

## License

MIT