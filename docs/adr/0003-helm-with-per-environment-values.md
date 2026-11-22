# 3. Deploy with a Helm chart and per-environment values files

Status: Accepted

## Context

CartForge runs in three environments (dev, staging, prod) with the same structure but different settings, such as image versions and hostnames. Copying raw Kubernetes YAML per environment drifts quickly.

## Decision

One Helm chart (`charts/cartforge` in the cartforge-gitops repository) holds the templates. Each environment has a values file that overrides only what differs. Image tags are required values with no default, so a deployment always names an exact version. Secrets are never part of the chart: it references a Kubernetes Secret by name.

## Alternatives considered

- **Kustomize overlays:** no templating language, which is simpler, but the chart gives release history and one-command rollback (`helm rollback`).
- **Plain manifests per environment:** duplicated and error-prone.

## Consequences

- The deployed version of each service is visible in Git, which prepares GitOps-style promotion.
- Helm adds a templating layer to learn and debug (`helm template` shows the rendered output).
- Release state lives in the cluster, so a rebuilt cluster needs a fresh `helm upgrade --install`.