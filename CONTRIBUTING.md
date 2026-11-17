# Contributing

Even as a solo project, CartForge follows team-style rules.

## Workflow

1. `main` is protected: no direct pushes.
2. Create a short-lived branch from `main`.
3. Open a pull request, wait for the pipeline to pass, then squash-merge.
4. Delete the branch after merging.

## Branch naming

`<type>/<short-description>`, for example `feat/catalog-service`, `fix/health-probe`, `chore/jenkins-setup`.

## Commit messages (Conventional Commits)

`<type>(<scope>): <summary>`

| Type | Use for |
|---|---|
| feat | a new feature |
| fix | a bug fix |
| docs | documentation only |
| chore | tooling, config, dependencies |
| ci | pipeline changes |
| test | adding or fixing tests |
| refactor | code change with no behaviour change |

Example: `feat(catalog): add product list endpoint`

## Releases

SemVer tags (`v1.2.3`). A tag triggers the staging deployment.

## Rules

- Never commit secrets, `.env` files or credentials.
- Record significant technical decisions as an ADR in `docs/adr`.
