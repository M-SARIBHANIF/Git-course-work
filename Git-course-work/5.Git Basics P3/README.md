# Git: `.gitignore` & `.gitkeep` in Detail

A reference for telling Git which files and folders to ignore — things like build output, dependencies, and local secrets that shouldn't be tracked or committed — and how to keep otherwise-empty folders in your repo using `.gitkeep`.

## What it is

`.gitignore` is a plain text file, placed in your project (usually at the root), that lists patterns for files and folders Git should **never track**. Files matching those patterns:
- won't show up in `git status`,
- won't get staged by `git add .` or `git add -A`,
- won't ever end up in a commit — unless they were already tracked *before* you ignored them (more on that below).

It doesn't delete or hide the files from your file system — it just tells Git to look the other way.

## Why you need one

Some things simply don't belong in version control:
- **Dependencies** you can reinstall — `node_modules/`, `venv/`
- **Build output** you can regenerate — `dist/`, `build/`, `*.pyc`
- **Local secrets** — `.env` files with API keys or passwords
- **Editor/OS clutter** — `.DS_Store`, `.vscode/`, `Thumbs.db`
- **Logs and caches** — `*.log`, `.cache/`

Committing these bloats your repo, causes merge conflicts on machine-specific files, and can accidentally leak secrets.

## Creating one

**In Git Bash, from your project root:**
```bash
touch .gitignore
```
Then open it in any editor (or `nano .gitignore` / `vim .gitignore` right in Git Bash) and add your patterns, one per line.

## Pattern syntax

| Pattern | Matches |
|---|---|
| `file.txt` | A file named `file.txt`, anywhere in the repo |
| `*.log` | Any file ending in `.log`, anywhere in the repo |
| `node_modules/` | A folder named `node_modules`, anywhere (trailing `/` = folder only) |
| `/dist` | A file or folder named `dist`, but **only at the repo root** (leading `/` anchors it) |
| `logs/*.log` | `.log` files directly inside a `logs` folder (not subfolders) |
| `logs/**/*.log` | `.log` files inside `logs` at **any** depth |
| `!important.log` | Un-ignores `important.log` even if an earlier pattern matched it (exceptions must come *after* the rule they override) |
| `#` at the start of a line | A comment — ignored by Git |
| `temp?.txt` | `temp1.txt`, `tempA.txt`, etc. — `?` matches exactly one character |

**Example `.gitignore` for a typical Node + React project:**
```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# Logs
*.log
npm-debug.log*

# Editor / OS
.vscode/
.DS_Store
Thumbs.db
```

## Checking it's working

**See what Git currently considers ignored:**
```bash
git status --ignored
```

**Check whether a specific file is ignored, and which rule matched:**
```bash
git check-ignore -v node_modules/some-package/index.js
```
```
.gitignore:2:node_modules/    node_modules/some-package/index.js
```
This tells you the rule (`node_modules/`), which line it's on (`2`), and the file it matched.

## "I added it to `.gitignore` but it's still showing up"

`.gitignore` only stops Git from tracking **new** files. If a file was already committed *before* it was added to `.gitignore`, Git keeps tracking it — the ignore rule doesn't retroactively remove it.

**Fix: stop tracking it, but keep it on disk:**
```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```
`--cached` removes it from Git's tracking only — your local file is untouched. After this commit, `.gitignore` will keep it out going forward.

**To untrack an entire already-committed folder:**
```bash
git rm -r --cached node_modules
git commit -m "Stop tracking node_modules"
```

## Global `.gitignore` (applies to every repo on your machine)

Useful for personal/OS-level clutter you never want tracked anywhere, without editing every project's `.gitignore` (e.g. `.DS_Store`, `.vscode/`).

```bash
git config --global core.excludesfile ~/.gitignore_global
```
Then add your patterns to `~/.gitignore_global` the same way as a normal `.gitignore`.

## Handy starting points

Instead of writing one from scratch, GitHub maintains ready-made templates per language/framework (Node, Python, Java, Unity, etc.):
```
https://github.com/github/gitignore
```
Or generate one interactively at:
```
https://www.toptal.com/developers/gitignore
```

## `.gitkeep`

**The problem it solves:** Git only tracks *files* — it has no concept of an empty folder. If you create an empty directory (e.g. `logs/` or `uploads/`) meant to hold files later, Git won't track it at all, and it won't show up for anyone else who clones the repo.

**The workaround:** `.gitkeep` isn't an official Git feature — it's just a convention. You place an empty (or near-empty) file named `.gitkeep` inside the folder you want to preserve. Since the folder now contains a file, Git has something to track, and the folder comes along with it.

```bash
mkdir logs
touch logs/.gitkeep
git add logs/.gitkeep
git commit -m "Keep empty logs folder in repo"
```

**Naming:** The name `.gitkeep` is just a widely-used convention, not a Git keyword — you could name the file anything (some projects use `.keep` or `.placeholder`) and it would work exactly the same way. `.gitkeep` is simply the name most developers recognize on sight.

**Common combo with `.gitignore`:** Often you want a folder to exist (e.g. `uploads/`) but want to ignore everything *inside* it except the placeholder itself:
```gitignore
# Ignore everything in uploads/...
uploads/*
# ...except the placeholder that keeps the folder tracked
!uploads/.gitkeep
```
The `!` exception (from the pattern syntax table above) is what makes this work — it un-ignores just the one file.

**Once real files exist in the folder,** `.gitkeep` is no longer needed (the folder will stay tracked because of those files) — but it's harmless to leave it there, and removing it is optional.

> Refer to `Git-Basics-P3/resource-assets` to see `.gitkeep` in action.

## Quick reference

```bash
touch .gitignore                              # create it
git status --ignored                          # see what's being ignored
git check-ignore -v <file>                     # check why a specific file is ignored
git rm --cached <file>                         # stop tracking a file that's already committed
git config --global core.excludesfile ~/.gitignore_global   # set a machine-wide ignore file
```

> Refer to the `.gitignore` file in `react-sample` for an example of ignoring the `node_modules` folder.
