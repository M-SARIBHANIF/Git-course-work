# Git Bash Basics

A quick reference for opening Git Bash and running your first two Git commands.

## 1. Opening Git Bash

**Option A — from a folder (Windows):**
1. Open File Explorer and go to the folder you want to work in.
2. Right-click inside the folder (on empty space, not on a file).
3. Click **"Git Bash Here"** from the right-click menu.
   - This opens Git Bash already pointed at that folder.

**Option B — from the Start Menu:**
1. Click the **Start** button.
2. Type `Git Bash`.
3. Press **Enter** to launch it.
   - You'll land in your home directory (e.g. `/c/Users/YourName`). Use `cd` to move into your project folder, e.g.:
     ```bash
     cd /c/Users/YourName/Documents/my-project
     ```

> Git Bash needs to be installed first. If you don't have it yet, download it from [git-scm.com](https://git-scm.com/downloads) and install with the default options.

## 2. `git init`

Turns the current folder into a Git repository (this is a one-time setup per project).

```bash
git init
```

**What it does:**
- Creates a hidden `.git` folder inside your project.
- That `.git` folder is where Git stores all history, commits, and configuration.
- Your files themselves aren't touched — Git just starts *watching* the folder.

**Expected output:**
```
Initialized empty Git repository in /c/Users/YourName/Documents/my-project/.git/
```

You only need to run this once per project. If you run it again later, Git will just say it reinitialized the existing repository — it won't erase your history.

## 3. `git status`

Shows the current state of your project: what's changed, what's staged, and what Git isn't tracking yet.

```bash
git status
```

**Example output (new repo, no commits yet):**
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
        style.css

nothing added to commit but untracked files present (use "git add" to track)
```

**How to read it:**
| Section | Meaning |
|---|---|
| **Untracked files** | Files Git sees but isn't tracking yet (never been added). |
| **Changes to be committed** | Files staged with `git add`, ready for the next commit. |
| **Changes not staged for commit** | Tracked files that have been edited since the last commit. |

Run `git status` often — it's the safest way to check what Git will do before you commit anything.

## 4. `git config`

Tells Git who you are and how you want it to behave. Git attaches this info to every commit you make, so it's usually set up once per computer.

**Set your name and email (do this first, before your first commit):**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**What `--global` means:**
- Applies to *every* repository on your machine, not just the current one.
- Drop `--global` to set a value for just the current project (e.g. a work email for one repo only).

**Check your settings:**

```bash
git config --list
```

**Example output:**
```
user.name=Your Name
user.email=you@example.com
core.editor=vim
```

**Check a single value:**

```bash
git config user.name
```

> If you skip this step, `git commit` will stop and ask you to set `user.name` and `user.email` before it lets you commit.

## Typical first workflow

```bash
cd /c/Users/YourName/Documents/my-project        # go to your project folder
git config --global user.name "Your Name"         # set your name (once per machine)
git config --global user.email "you@example.com"  # set your email (once per machine)
git init                                           # start tracking it with Git
git status                                         # see what's there
git add .                                          # stage everything
git commit -m "Initial commit"                     # save your first snapshot
```
