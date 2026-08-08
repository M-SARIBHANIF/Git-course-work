# 04. Advanced Features

This module covers several advanced capabilities of GitHub Actions. Each topic is demonstrated by a workflow in [`.github/workflows`](../.github/workflows) whose file name begins with `04-advanced-features--`.

## Topics & Workflows

- **Runner Types** – [`04-advanced-features--01-runner-types.yaml`](../.github/workflows/04-advanced-features--01-runner-types.yaml)
  - shows GitHub-hosted Linux/Windows/macOS runners, container jobs, and a third-party runner
- **Artifacts** – [`04-advanced-features--02-artifacts.yaml`](../.github/workflows/04-advanced-features--02-artifacts.yaml)
  - one job uploads a text file and a second job downloads and displays it
- **Caching** – [`04-advanced-features--03-caching.yaml`](../.github/workflows/04-advanced-features--03-caching.yaml)
  - demonstrates the `actions/cache` action and `setup-node` built‑in caching
- **GitHub Permissions** – [`04-advanced-features--04-github-permissions.yaml`](../.github/workflows/04-advanced-features--04-github-permissions.yaml)
  - compares read-only vs read/write `GITHUB_TOKEN` permissions on pull requests
- **Third-Party Authentication** – [`04-advanced-features--05-third-party-auth.yaml`](../.github/workflows/04-advanced-features--05-third-party-auth.yaml)
  - contrasts static AWS credentials with OIDC-based authentication
- **Matrix & Conditionals** – [`04-advanced-features--06-matrix-and-conditionals.yaml`](../.github/workflows/04-advanced-features--06-matrix-and-conditionals.yaml)
  - runs a job across a two-dimensional matrix and skips steps based on conditions
- **Dynamic Matrix** – [`04-advanced-features--07-dynamic-matrix.yaml`](../.github/workflows/04-advanced-features--07-dynamic-matrix.yaml)
  - generates a dynamic set of jobs to be run using the matrix strategy
- **Workflow Commands** – [`04-advanced-features--08-workflow-commands.yaml`](../.github/workflows/04-advanced-features--08-workflow-commands.yaml)
  - demonstrates specially formatted instructions that enable communication with the GitHub Actions runner to control the workflow's behavior

The caching example also includes a minimal Node project in [`caching/minimal-node-project`](./caching/minimal-node-project).

## Third-Party Authentication: Connecting to AWS

`05-third-party-auth.yaml` authenticates to AWS two different ways — a **static access key** and **OIDC**. Both are set up below; OIDC is the one AWS and GitHub both recommend, and is what the workflow's second job demonstrates.

### Option A: AWS access keys as a secret + variable

The traditional approach: create an IAM user in AWS, generate an access key pair for it, and store that pair in GitHub so the workflow can use it.

1. **Create an IAM user in AWS** with only the permissions the workflow actually needs (e.g. S3 upload access for one bucket) — avoid attaching `AdministratorAccess`.
2. **Generate an access key** for that user (IAM → Users → your user → Security credentials → Create access key). AWS shows the **Access key ID** and **Secret access key** exactly once — copy both.
3. **Add them to GitHub** as repository secrets:
   - Repo → **Settings → Secrets and variables → Actions → Secrets** tab → **New repository secret**.
   - Create `AWS_ACCESS_KEY_ID` with the access key ID.
   - Create `AWS_SECRET_ACCESS_KEY` with the secret access key.
4. **Add non-sensitive config as a variable**, not a secret — under the **Variables** tab on the same page, add `AWS_REGION` = `us-east-1`. Variables aren't encrypted and can show up in logs, so anything sensitive belongs in Secrets, not here.
5. **Use them in the workflow**:

```yaml
jobs:
  static-credentials:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Verify identity
        run: aws sts get-caller-identity
```

The same steps apply for **environment**-scoped secrets/variables (Settings → Environments → your environment) if you want different credentials for, say, `staging` vs `production`.

**Downside:** these keys are long-lived. If one leaks — in a log, a fork's PR, a compromised action — it keeps working until someone manually rotates or revokes it.

### Option B (recommended): OIDC — no stored AWS credentials at all

Instead of GitHub holding a permanent AWS key, GitHub issues each workflow run a short-lived, cryptographically signed identity token (OIDC/JWT). AWS verifies that token and hands back **temporary** credentials (typically valid ~1 hour) scoped to a specific IAM role. Nothing sensitive is ever stored as a GitHub secret.

**Step 1 — Add an OIDC identity provider in AWS**
IAM console → **Identity providers** → **Add provider**:
- Provider type: `OpenID Connect`
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

(AWS auto-verifies GitHub's TLS certificate now, so you don't need to supply a thumbprint manually.)

**Step 2 — Create an IAM role GitHub can assume**
Create a role with trust type **Web identity**, pointing at the provider you just created. Scope the trust policy to your exact repository (and ideally branch) using the `sub` claim — never leave it wide open:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_ORG>/<GITHUB_REPO>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

**Step 3 — Attach a least-privilege permissions policy** to that role — only the specific AWS actions/resources the workflow needs, not broad access.

**Step 4 — Reference the role in the workflow.** No `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` secret needed — only the job permission to request an OIDC token, and the role's ARN (safe to store as a plain variable, since it isn't a credential):

```yaml
permissions:
  id-token: write   # required to request the OIDC token
  contents: read

jobs:
  oidc-credentials:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          role-session-name: GitHubActions-${{ github.run_id }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Verify identity
        run: aws sts get-caller-identity
```

**Why this is better:**
- **No long-lived secret exists to leak** — there's nothing in GitHub Secrets to steal in the first place.
- **Credentials expire automatically** (~1 hour), so a compromised run has a tiny blast radius.
- **No manual rotation** — you never regenerate or re-paste a key.
- **Fine-grained, auditable trust** — the trust policy can restrict access down to one repo, one branch, or even one environment, and every assumed-role session is tagged with the workflow's identity in CloudTrail.

### Further reading

- [GitHub Docs: Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
- [GitHub Docs: Encrypted secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GitHub Docs: Variables](https://docs.github.com/en/actions/learn-github-actions/variables)