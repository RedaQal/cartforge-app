# 4. Use the CI registry from the cluster as registry:5000

Status: Accepted

## Context

Jenkins pushes images to a registry container on the host (`localhost:5000`). Inside the Minikube node, `localhost` refers to the node itself, so the same name cannot be used by Kubernetes.

## Decision

The registry container joins the Minikube Docker network under the alias `registry`, and the cluster is started with `--insecure-registry=registry:5000`. Charts reference images as `registry:5000/<name>:<sha>`. A manual `minikube image load` remains a fallback.

## Consequences

- Images are pushed as `localhost:5000/...` and pulled as `registry:5000/...`, so the same image carries two names. Re-tagging is needed when loading images manually.
- The registry is plain HTTP without authentication: acceptable on a local machine only. A real setup uses TLS and credentials.
- The network connection must be repeated if the registry container is recreated (handled by `minikube-up.sh`).