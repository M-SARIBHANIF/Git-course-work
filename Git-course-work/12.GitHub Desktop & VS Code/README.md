# Guide: GitHub Desktop & GitHub in VS Code

This guide covers two ways to work with GitHub without using raw terminal Git commands:

1. **GitHub Desktop** — a standalone GUI app for Git/GitHub
2. **GitHub in VS Code** — using Git and GitHub directly inside the VS Code editor

---

## Part 1: GitHub Desktop

GitHub Desktop is a free visual application for managing Git repositories — clone, commit, branch, push, and pull without typing commands.

### 1.1 Installing GitHub Desktop

1. Go to [https://desktop.github.com](https://desktop.github.com).
2. Download the installer for your OS (Windows or macOS).
3. Run the installer and let it finish setting up.
4. On first launch, click **Sign in to GitHub.com** and authenticate with your GitHub account (this opens a browser window to authorize the app).

### 1.2 Cloning a repository

1. Open GitHub Desktop.
2. Go to **File → Clone Repository** (or press `Ctrl+Shift+O` / `Cmd+Shift+O`).
3. Choose a tab:
   - **GitHub.com** — pick from a list of repos you have access to.
   - **URL** — paste an HTTPS or SSH repo URL directly.
4. Choose a **Local path** — where the repo will be saved on your machine.
5. Click **Clone**.

### 1.3 Creating a new repository from GitHub Desktop

1. Go to **File → New Repository** (`Ctrl+N` / `Cmd+N`).
2. Fill in:
   - **Name**
   - **Description** (optional)
   - **Local path** — where to create it on disk
   - **Initialize with a README** (recommended)
   - **Git ignore** and **License** templates (optional)
3. Click **Create Repository**.
4. To publish it to GitHub, click **Publish repository** in the top bar, choose public/private, and confirm.

### 1.4 Making changes and committing

1. Edit files in the repo folder using any editor.
2. Switch to GitHub Desktop — changed files appear automatically in the **Changes** tab on the left, with a diff view on the right.
3. Check the boxes next to the files you want to include (all are checked by default).
4. At the bottom left, enter:
   - **Summary** — a short commit message (required).
   - **Description** (optional) — more detail.
5. Click **Commit to `<branch-name>`**.

### 1.5 Pushing and pulling

- After committing, click **Push origin** at the top to upload your commits to GitHub.
- Click **Fetch origin** to check for new changes on GitHub; if there are any, the button changes to **Pull origin** — click it to download them.

### 1.6 Branching

1. Click the **Current branch** dropdown at the top.
2. Click **New branch**, name it, and click **Create branch**.
3. GitHub Desktop switches you to the new branch automatically.
4. Make commits as usual — they'll be added to this branch.
5. To switch branches, use the same dropdown and select an existing branch.

### 1.7 Creating a Pull Request

1. After pushing a branch with new commits, click **Create Pull Request** in the top bar (or go to **Branch → Create Pull Request**).
2. This opens GitHub.com in your browser with the PR pre-filled — add a title/description and click **Create pull request**.

---

## Part 2: GitHub in VS Code

VS Code has Git support built in, plus an official **GitHub Pull Requests and Issues** extension for deeper GitHub integration.

### 2.1 Built-in Git support (no extension needed)

VS Code includes Git integration out of the box, as long as Git is installed on your system.

**Check Git is installed:**
```bash
git --version
```
If not installed, download it from [https://git-scm.com](https://git-scm.com).

### 2.2 Cloning a repository in VS Code

1. Open VS Code.
2. Press `Ctrl+Shift+P` / `Cmd+Shift+P` to open the Command Palette.
3. Type **Git: Clone** and select it.
4. Choose **Clone from GitHub** (sign in if prompted) or paste a repository URL directly.
5. Select a repo (or confirm the pasted URL), then choose a local folder to clone into.
6. Click **Open** when prompted to open the cloned folder.

### 2.3 The Source Control panel

1. Click the **Source Control** icon in the left sidebar (branch icon, or `Ctrl+Shift+G`).
2. Here you can see:
   - **Changes** — modified/untracked files.
   - A **diff view** when you click any changed file.
3. To stage a file, hover over it and click the **+** icon (or stage all with the **+** next to "Changes").
4. Type a commit message in the text box at the top.
5. Click the **✓ Commit** button (or press `Ctrl+Enter` / `Cmd+Enter`).

### 2.4 Pushing and pulling

- Click the **sync icon** (circular arrows) in the bottom-left status bar, or use **Source Control → ... menu → Push / Pull**.
- The status bar also shows how many commits you're ahead/behind — click it to sync.

### 2.5 Branching in VS Code

1. Click the **branch name** in the bottom-left status bar.
2. Select **Create new branch**, name it, and press Enter.
3. VS Code switches to the new branch automatically.
4. Use the same status bar item to switch between existing branches.

### 2.6 Installing the GitHub Pull Requests and Issues extension

This extension adds GitHub-specific features (PRs, issues, reviews) directly inside VS Code.

1. Open the **Extensions** panel (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **GitHub Pull Requests and Issues**.
3. Click **Install** (published by GitHub).
4. Sign in to GitHub when prompted (a browser window will open to authorize).

**With the extension, you can:**
- View, create, and review Pull Requests from a dedicated **GitHub** sidebar icon.
- Comment on PR diffs directly in the editor.
- View and manage Issues assigned to you.
- Checkout a PR branch locally with one click to test changes.

### 2.7 Creating a Pull Request from VS Code

1. Push your branch (Section 2.4).
2. Open the **GitHub Pull Requests** icon in the sidebar.
3. Click **Create Pull Request**.
4. Choose the base branch (e.g. `main`) and compare branch (your feature branch).
5. Add a title and description, then click **Create**.

### 2.8 Resolving merge conflicts in VS Code

1. When a conflict occurs (e.g. during a pull or merge), the affected file opens with inline markers.
2. VS Code shows **Accept Current Change**, **Accept Incoming Change**, **Accept Both Changes**, or **Compare Changes** links above each conflict block.
3. Click the appropriate option for each conflict, then save the file.
4. Stage the resolved file and commit as normal.

---

## Quick Comparison

| Feature | GitHub Desktop | VS Code |
|---|---|---|
| Interface | Standalone GUI app | Built into the editor |
| Best for | Simple, visual Git workflow | Coding + Git in one place |
| Diff viewing | Built-in | Built-in |
| Pull Requests | Opens browser to create | Can create/review inline (with extension) |
| Issues | Not supported | Supported (with extension) |
| Command line needed | No | No (but available if you want it) |

---

## Notes

- Both tools use the same underlying Git — changes made in one are fully visible in the other, or from the terminal.
- You can use GitHub Desktop for everyday commits/branching and VS Code's PR extension for reviewing code — they work well together on the same repo.
- Both require signing in with your GitHub account to push to remote repositories.
