# GitHub Guide: Creating a Repository, Cloning via HTTPS, and Setting Up SSH

This guide walks through three things step by step:

1. Creating a new repository on GitHub
2. Cloning a repository using HTTPS
3. Setting up an SSH key and using it with GitHub

---

## 1. Creating a Repository on GitHub

1. Log in to [https://github.com](https://github.com).
2. Click the **+** icon in the top-right corner of the page, then select **New repository**.
3. Fill in the repository details:
   - **Repository name** — a short, descriptive name (e.g. `my-project`).
   - **Description** (optional) — a one-line summary of what the project does.
   - **Visibility**:
     - **Public** — anyone can view the repository.
     - **Private** — only you and people you invite can view it.
4. Under **Initialize this repository with**, optionally check:
   - **Add a README file** — creates a starter `README.md`.
   - **Add .gitignore** — pick a template matching your language/framework (e.g. Node, Python).
   - **Choose a license** — e.g. MIT, Apache 2.0, if you want to license the project.
5. Click **Create repository**.

You now have an empty (or starter) repository at:
```
https://github.com/<your-username>/<repository-name>
```

### Pushing an existing local project to this new repo

If you already have a project on your machine and want to push it up:

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main
```

---

## 2. Cloning a Repository via HTTPS

Cloning downloads a full copy of a repository (including its history) to your machine.

1. Go to the repository page on GitHub.
2. Click the green **Code** button.
3. Make sure the **HTTPS** tab is selected.
4. Copy the URL shown — it looks like:
   ```
   https://github.com/<username>/<repository-name>.git
   ```
5. In your terminal, run:
   ```bash
   git clone https://github.com/<username>/<repository-name>.git
   ```
6. Move into the cloned folder:
   ```bash
   cd <repository-name>
   ```

### Authentication note for HTTPS

GitHub no longer accepts your account password for `git push`/`pull` over HTTPS. Instead, when prompted for a password, you must use a **Personal Access Token (PAT)**:

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. Click **Generate new token**, select the scopes you need (`repo` is enough for most cases), and set an expiration.
3. Copy the generated token (you won't be able to see it again).
4. Use it in place of your password when Git prompts you during `push`/`pull`.

To avoid entering it every time, you can cache it:
```bash
git config --global credential.helper cache
```

---

## 3. Setting Up an SSH Key for GitHub

SSH lets you authenticate with GitHub without typing a username/token every time. This is a one-time setup per machine.

### Step 1: Check for an existing SSH key

```bash
ls -al ~/.ssh
```
Look for files like `id_ed25519.pub` or `id_rsa.pub`. If they exist, you can skip to Step 3, or generate a new key for this purpose.

### Step 2: Generate a new SSH key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
> If your system doesn't support `ed25519`, use RSA instead:
> ```bash
> ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
> ```

- When prompted for a file location, press **Enter** to accept the default (`~/.ssh/id_ed25519`).
- When prompted for a passphrase, enter one for extra security, or press **Enter** to leave it empty.

### Step 3: Add your SSH key to the ssh-agent

Start the ssh-agent in the background:
```bash
eval "$(ssh-agent -s)"
```

Add your private key to the agent:
```bash
ssh-add ~/.ssh/id_ed25519
```

### Step 4: Copy the public key

- **Linux:**
  ```bash
  cat ~/.ssh/id_ed25519.pub
  ```
  Copy the full output manually.

- **macOS:**
  ```bash
  pbcopy < ~/.ssh/id_ed25519.pub
  ```

- **Windows (Git Bash):**
  ```bash
  clip < ~/.ssh/id_ed25519.pub
  ```

### Step 5: Add the key to your GitHub account

1. Go to **GitHub → Settings → SSH and GPG keys**.
2. Click **New SSH key**.
3. Give it a descriptive **Title** (e.g. "Work Laptop").
4. Paste the copied key into the **Key** field.
5. Click **Add SSH key**.

### Step 6: Test the connection

```bash
ssh -T git@github.com
```
You should see a message like:
```
Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
```

### Step 7: Clone (or switch a repo) to use SSH

To clone using SSH:
```bash
git clone git@github.com:<username>/<repository-name>.git
```

To switch an already-cloned repo (currently using HTTPS) over to SSH:
```bash
git remote set-url origin git@github.com:<username>/<repository-name>.git
```

Verify the change:
```bash
git remote -v
```

---

## Quick Reference

| Task | Command |
|---|---|
| Clone via HTTPS | `git clone https://github.com/user/repo.git` |
| Clone via SSH | `git clone git@github.com:user/repo.git` |
| Generate SSH key | `ssh-keygen -t ed25519 -C "email@example.com"` |
| Add key to agent | `ssh-add ~/.ssh/id_ed25519` |
| Test SSH connection | `ssh -T git@github.com` |
| Switch remote to SSH | `git remote set-url origin git@github.com:user/repo.git` |

---

## Notes

- HTTPS is simpler to set up but requires a Personal Access Token for authentication.
- SSH requires one-time key setup but doesn't require entering credentials on every push/pull afterward.
- You can use both HTTPS and SSH on the same machine for different repositories.
