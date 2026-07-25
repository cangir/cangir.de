---
title: "npm Trusted Publishing with GitHub Actions: The ENEEDAUTH Trap and How to Fix It"
description: "If npm publish --provenance keeps failing with ENEEDAUTH despite having OIDC trusted publishing configured, the problem is probably your npm version."
pubDate: 2026-07-25
tags: [npm, ci, oidc, github-actions]
cover: /npm-oidc-trusted-publishing-cover.webp
---

## The Setup

I had a straightforward goal: publish my npm package (`@wpmoo/ui`) from GitHub Actions using **OIDC trusted publishing** — no long-lived tokens, no secrets to rotate. npm calls this "Trusted Publishing," and the setup looked correct on paper:

- Trusted publisher configured on npmjs.com (GitHub Actions → my repo → my workflow)
- `permissions: id-token: write` in the workflow
- `npm publish --access public --provenance` as the publish command
- Publishing access set to "Require two-factor authentication and disallow tokens"

Everything checked out. Except it didn't work.

## The Error

Every publish attempt failed with the same error:

```shell
npm error code ENEEDAUTH
npm error need auth This command requires you to be logged in to https://registry.npmjs.org/
npm error need auth You need to authorize this machine using `npm adduser`
```

The confusing part? The `--provenance` flag *was* working — npm successfully signed the provenance attestation using the GitHub Actions OIDC token. But the actual **publish** step failed because npm wasn't authenticated against the registry.

Provenance signing and registry authentication are two separate OIDC flows. I had one working and the other completely silent.

## The Obvious Fixes (and Why They Don't Work)

### Fix 1: `registry-url` in setup-node

The standard setup-node configuration for npm publishing:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "22.14.0"
    registry-url: "https://registry.npmjs.org"
```

This creates an `.npmrc` with:

```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
```

When `NODE_AUTH_TOKEN` is empty (no secret configured), npm sees an empty auth token and fails with **E404** — it tries token auth with an empty string instead of falling back to OIDC.

### Fix 2: Remove `registry-url` entirely

Without `registry-url`, setup-node doesn't create an `.npmrc` at all. npm doesn't know which registry to use:

```shell
npm error code ENEEDAUTH
```

### Fix 3: Registry-only `.npmrc`

A manual registry-only `.npmrc` seems like the cleanest workaround:

```yaml
- name: Configure npm registry
  run: echo "registry=https://registry.npmjs.org/" >> .npmrc
```

npm now knows the registry, but still fails with **ENEEDAUTH**. It has no auth token and isn't attempting the OIDC token exchange for authentication.

Three different configurations, three different failure modes, same root cause.

## The Root Cause

My workflow used **Node 22.14.0**, which ships with **npm 10.9.2**.

Here's the critical distinction:

| Feature | npm 10.x | npm 11.5.1+ |
|---|---|---|
| OIDC for provenance **signing** (`--provenance`) | Yes | Yes |
| OIDC token exchange for registry **authentication** | **No** | Yes |

npm 10.x can request an OIDC token from GitHub Actions and use it to sign a provenance attestation. But it **cannot** exchange that token for a short-lived npm auth token to authenticate the publish request. That capability — the actual "Trusted Publishing" authentication flow — was added in **npm 11.5.1**.

So `--provenance` was doing its job (signing), but npm had no way to authenticate the publish itself. Hence: `ENEEDAUTH`.

## The Fix

Upgrade npm before publishing:

```yaml
- name: Set up Node for npm
  uses: actions/setup-node@v4
  with:
    node-version: "22.14.0"

- name: Upgrade npm for OIDC trusted publishing
  run: npm install -g npm@11

- name: Configure npm registry
  run: echo "registry=https://registry.npmjs.org/" >> .npmrc

- name: Publish to npm
  run: npm publish --access public --provenance
```

That's it. npm 11.x detects the GitHub Actions OIDC environment (`ACTIONS_ID_TOKEN_REQUEST_URL`), exchanges the token with npmjs.com for a short-lived auth token, and publishes successfully.

### Why `npm@11` and Not `npm@latest`

My first fix used `npm@latest`. It failed immediately:

```shell
npm error code EBADENGINE
npm error notsup Not compatible with your version of node/npm: npm@12.0.1
npm error notsup Required: {"node":"^22.22.2 || ^24.15.0 || >=26.0.0"}
npm error notsup Actual:   {"npm":"10.9.2","node":"v22.14.0"}
```

npm 12 raised its minimum Node requirement. Since `@latest` is a floating target, a future major version bump can break your CI without any code change on your side.

**Pin to the major version that supports your Node runtime.** npm 11.x supports `node: ^20.17.0 || >=22.9.0`, which covers Node 22.14.0 comfortably:

```yaml
run: npm install -g npm@11
```

This gives you OIDC auth support without the risk of a future major version breaking your build.

## The Complete Working Workflow

For reference, here's the full publish workflow that works:

```yaml
name: Publish npm package

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

permissions:
  contents: write
  id-token: write

concurrency:
  group: npm-publish-${{ github.ref }}
  cancel-in-progress: false

jobs:
  publish:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      # ... build steps (Python in my case) ...

      - name: Set up Node for npm
        uses: actions/setup-node@v4
        with:
          node-version: "22.14.0"

      - name: Upgrade npm for OIDC trusted publishing
        run: npm install -g npm@11

      - name: Configure npm registry
        run: echo "registry=https://registry.npmjs.org/" >> .npmrc

      - name: Check package version
        id: package
        run: |
          name="$(node -p "require('./package.json').name")"
          version="$(node -p "require('./package.json').version")"
          if npm view "${name}@${version}" version --silent >/dev/null 2>&1; then
            echo "published=true" >> "$GITHUB_OUTPUT"
            echo "${name}@${version} is already published; skipping."
          else
            echo "published=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Publish to npm
        if: steps.package.outputs.published == 'false'
        run: npm publish --access public --provenance
```

Key points:

- **No `registry-url`** in setup-node — it writes an `_authToken` line that conflicts with OIDC.
- **Registry-only `.npmrc`** — tells npm where to publish without injecting auth config.
- **`npm@11` pinned** — OIDC auth support without floating-version surprises.
- **`id-token: write`** — required for GitHub Actions to expose the OIDC token endpoint.
- **`--provenance`** — signs the SLSA provenance attestation (works in npm 10+ and 11+).

## npmjs.com Configuration

On the npm side, the trusted publisher must match your workflow exactly:

- **Provider:** GitHub Actions
- **Repository:** `your-org/your-repo`
- **Workflow filename:** `.github/workflows/npm-publish.yml` (the full path)
- **Permission:** npm publish

Under **Publishing access**, select "Require two-factor authentication and disallow tokens." This disables long-lived token publishing entirely — OIDC is the only way in, which is exactly what you want.

## Debugging Checklist

If you're hitting `ENEEDAUTH` with trusted publishing:

1. **Check your npm version.** Run `npm --version` in your workflow. If it's 10.x, that's your problem. Upgrade to 11+.
2. **Remove `registry-url` from setup-node.** It creates an `.npmrc` with an empty `_authToken` that shadows OIDC.
3. **Add a registry-only `.npmrc`.** `echo "registry=https://registry.npmjs.org/" >> .npmrc`
4. **Verify `id-token: write`** is in your workflow permissions.
5. **Verify the trusted publisher config** on npmjs.com matches your repo and workflow filename exactly.
6. **Pin your npm major version.** Don't use `@latest` — a future major can change Node requirements.

## TL;DR

`npm publish --provenance` does two things: signs provenance and (in npm 11+) authenticates via OIDC. npm 10.x only does the first. If trusted publishing fails with `ENEEDAUTH`, upgrade to `npm@11` and skip `registry-url` in setup-node.

---

*Published package: [@wpmoo/ui](https://www.npmjs.com/package/@wpmoo/ui) — Bootstrap-native HTML components with a shadcn feel: copy the markup, own the result. The full workflow lives in the [wpmoo-org/ui](https://github.com/wpmoo-org/ui/blob/main/.github/workflows/npm-publish.yml) repository.*
