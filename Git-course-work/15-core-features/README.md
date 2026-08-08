# 15. Core Features

This module demonstrates the building blocks used in all GitHub Actions workflows: steps, jobs, triggers, variables, secrets, and — critically — the **contexts** that let a workflow read information about itself, its environment, and the event that triggered it.

Each example workflow is located in `.github/workflows/` and follows the naming pattern `03-core-features--<name>.yaml`.

## Included Workflows

- [**03-core-features--01-hello-world.yaml**](../.github/workflows/03-core-features--01-hello-world.yaml) – the most basic workflow that prints a message from an inline bash step.
- [**03-core-features--02-step-types.yaml**](../.github/workflows/03-core-features--02-step-types.yaml) – shows different step types including bash, Python, and an action from the marketplace.
- [**03-core-features--03-workflows-jobs-steps.yaml**](../.github/workflows/03-core-features--03-workflows-jobs-steps.yaml) – illustrates how workflows are organised into jobs and steps and how jobs can run in parallel or depend on each other.
- [**03-core-features--04-triggers-and-filters.yaml**](../.github/workflows/03-core-features--04-triggers-and-filters.yaml) – explores triggering events and path filters. This workflow watches changes inside [`15-core-features/filters`](./filters/).
- [**03-core-features--05-environment-variables.yaml**](../.github/workflows/03-core-features--05-environment-variables.yaml) – explains variable scoping at workflow, job and step level.
- [**03-core-features--06-passing-data.yaml**](../.github/workflows/03-core-features--06-passing-data.yaml) – passes data between jobs using job outputs and environment variables.
- [**03-core-features--07-secrets-and-variables.yaml**](../.github/workflows/03-core-features--07-secrets-and-variables.yaml) – demonstrates injecting secrets and variables from both the repository and environments.

See the `filters` directory for sample files that are used by the triggers and filters workflow.

## Understanding Contexts

A **context** is a way to access information about workflow runs, runner environments, jobs, steps, and the event that triggered the run. Contexts are exposed as objects and are read using **expression syntax**:

```yaml
${{ <context>.<property> }}
```

Expressions can appear almost anywhere in a workflow file — in `if` conditions, `env` blocks, `with` inputs, `run` steps, and more. GitHub evaluates the expression *before* the job runs (for most contexts) and substitutes the result as a string.

```yaml
steps:
  - name: Print the actor who triggered this run
    run: echo "Triggered by ${{ github.actor }}"
```

### Why contexts matter

Without contexts, a workflow would be static — the same commands would run the same way every time. Contexts make workflows *dynamic*: they let a workflow branch based on which branch was pushed, which user opened a PR, what the previous job produced, which secrets are available, or which matrix combination is currently running.

### The available contexts

| Context | Description |
|---|---|
| `github` | Information about the workflow run, the repository, and the event that triggered it (e.g. `github.repository`, `github.sha`, `github.event_name`, `github.actor`). Available in every job and step. |
| `env` | Variables set at workflow, job, or step level via `env:`. Scoping is covered in detail by workflow `05-environment-variables.yaml`. |
| `vars` | Configuration variables defined at the repository, environment, or organization level (Settings → Secrets and variables → Actions → Variables). Non-sensitive values only. |
| `secrets` | Encrypted secrets defined at the repository, environment, or organization level. Values are masked in logs automatically. Covered by workflow `07-secrets-and-variables.yaml`. |
| `job` | Information about the currently running job, most notably `job.status`, useful in post-job/cleanup steps. |
| `jobs` | Used only in **reusable workflows** to define and reference job outputs that will be passed back to the caller. |
| `steps` | Outputs and outcomes of previous steps *within the same job*, e.g. `steps.<step_id>.outputs.<name>`. Central to workflow `06-passing-data.yaml`. |
| `runner` | Information about the runner executing the job — OS, temp directory, tool cache path, architecture. |
| `needs` | Outputs and results of jobs that the current job depends on via `needs:`. This is how data crosses job boundaries (steps context only works within one job). |
| `inputs` | Input values passed to a manually triggered workflow (`workflow_dispatch`), a reusable workflow (`workflow_call`), or a composite action. |
| `strategy` | Information about a `strategy` matrix execution, e.g. `strategy.job-index`. |
| `matrix` | The specific matrix values for the current job when using `strategy.matrix`. |
| `github.event` | Not a separate top-level context, but worth calling out: the full JSON payload of the triggering event (PR title, commit list, issue body, etc.), nested inside `github`. |

### Deep dive: contexts used in this module

**`github` — the event and repository context**
Available everywhere, in every workflow. A few properties you'll use constantly:

```yaml
run: |
  echo "Repo: ${{ github.repository }}"
  echo "Branch/ref: ${{ github.ref }}"
  echo "Commit SHA: ${{ github.sha }}"
  echo "Event: ${{ github.event_name }}"
  echo "Actor: ${{ github.actor }}"
```

`04-triggers-and-filters.yaml` relies on `github.event_name` and the associated `github.event` payload to determine what triggered the run (push, pull_request, etc.) and to inspect which files changed.

**`env` — variables you define, scoped to workflow/job/step**
Set with an `env:` block; read with `${{ env.NAME }}` in expressions or `$NAME` directly inside `run:` shells. `05-environment-variables.yaml` shows that a variable defined at the workflow level is visible everywhere, one defined at job level only inside that job, and one defined at step level only inside that step — with narrower scopes able to override wider ones.

```yaml
env:
  GREETING: "Hello"        # workflow-level
jobs:
  demo:
    env:
      GREETING: "Hi there"  # overrides workflow-level, job-scoped
    steps:
      - run: echo "$GREETING"   # -> "Hi there"
```

**`steps` and `needs` — passing data around**
`06-passing-data.yaml` demonstrates the two mechanisms for moving data:
- **`steps`** carries a step's output to *later steps in the same job*. A step writes to `$GITHUB_OUTPUT`, gives itself an `id`, and later steps read `steps.<id>.outputs.<name>`.
- **`needs`** carries a *job's* declared outputs to a downstream job that lists it in `needs:`. The producing job must map a step output up to `jobs.<job_id>.outputs`.

```yaml
jobs:
  build:
    outputs:
      artifact-name: ${{ steps.build_step.outputs.name }}
    steps:
      - id: build_step
        run: echo "name=app-v1" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.artifact-name }}"
```

**`secrets` and `vars` — configuration and credentials**
`07-secrets-and-variables.yaml` shows both contexts side by side:
- `vars` holds non-sensitive configuration (e.g. a deployment region, a feature flag) and can be inspected freely.
- `secrets` holds sensitive values (API keys, tokens). GitHub automatically redacts secret values from logs, and secrets are **not** passed to workflows triggered from forks by default, as a security measure.

```yaml
steps:
  - run: echo "Deploying to ${{ vars.DEPLOY_REGION }}"
  - run: curl -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" https://example.com
```

Both contexts can be scoped at the repository, environment, or organization level, and environment-level values take precedence when a job specifies `environment:`.

### A note on security

Some parts of the `github` context — particularly `github.event.*` fields sourced from user-controlled input, like a pull request title, an issue body, or a commit message — are **untrusted**. Interpolating them directly into a `run:` shell command can lead to script injection:

```yaml
# Risky: a crafted PR title could break out of the string and run arbitrary shell commands
- run: echo "${{ github.event.pull_request.title }}"
```

The safer pattern is to pass the value through `env:` first, so it's treated as data rather than as part of the script:

```yaml
- env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "$PR_TITLE"
```

### Further reading

- [GitHub Docs: Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [GitHub Docs: Expressions](https://docs.github.com/en/actions/learn-github-actions/expressions)