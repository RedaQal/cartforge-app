# 2. Run Jenkins in Docker with the host Docker socket mounted

Status: Accepted

## Context

CartForge needs a CI server that builds, tests and packages the code. It must run entirely on a developer laptop (Windows, Docker Desktop), be reproducible from the repository, and be able to build Docker images and run Testcontainers-based tests.

## Decision

Jenkins runs as a container defined in `ci/docker-compose.yml`. The host's Docker socket (`/var/run/docker.sock`) is mounted into the container, so pipeline steps use the host Docker daemon ("Docker-outside-of-Docker"). The container runs as root so it can use the socket. Jenkins itself is configured with Configuration as Code (`ci/jenkins/casc.yaml`), and secrets come from an untracked `ci/.env` file.

## Alternatives considered

- **Docker-in-Docker (privileged container with its own daemon):** better isolation, but slower, uses more disk and RAM, and still needs `--privileged`.
- **Ephemeral build agents (Kubernetes pods, Kaniko, rootless BuildKit):** the right choice for production. Too heavy for a first local setup, and a good later improvement.
- **GitHub Actions:** simpler to host, but the goal of this project is to learn to operate a CI server.

## Consequences

- Simple and fast: image layers are cached on the host and shared with local Docker.
- Any pipeline step can control the host daemon, which is effectively root access on the host. This is acceptable only because the environment is local, single-user and runs trusted code. Never reuse this setup for untrusted pull requests or on a shared server.
- Containers started by builds are siblings on the host, not children. Testcontainers needs `TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal` to reach them.
- Docker builds run in the host daemon's network, so host-level DNS problems affect builds (see the troubleshooting section of the README).
- The Trivy image scan is opt-in (`RUN_TRIVY` parameter) because its vulnerability databases are large. It can be enabled for any single run.