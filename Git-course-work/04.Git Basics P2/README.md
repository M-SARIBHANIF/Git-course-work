# Git: Add, Commit & Log

A detailed reference for the three commands you'll use every day in Git: staging changes (`git add`), saving snapshots (`git commit`), and reviewing history (`git log`).

## The big picture

Git moves your work through three zones:

```
Working directory  →  Staging area  →  Repository (history)
  (your edits)          (git add)         (git commit)
```

- **Working directory** — the actual files on disk, as you're editing them.
- **Staging area** (a.k.a. "the index") — a holding zone where you build up exactly what the *next* commit will contain.
- **Repository** — the permanent, saved history of commits.

`git log` is how you look back through that saved history afterward.

---

## 1. `git add`

Moves changes from your working directory into the staging area. Nothing becomes part of your project's permanent history until it's been both **added** and **committed**.

**Stage a single file:**
```bash
git add index.html
```

**Stage multiple specific files:**
```bash
git add index.html style.css
```

**Stage everything changed (new, modified, and deleted files) in the current folder and below:**
```bash
git add .
```

**Stage everything in the whole repo, regardless of which folder you're `cd`'d into:**
```bash
git add -A
```

**Stage only part of a file's changes** (interactive — useful when one file has multiple unrelated edits you want to split into separate commits):
```bash
git add -p
```
Git shows each chunk of changes one at a time and asks `y/n/s/...` — press `y` to stage that chunk, `n` to skip it, `s` to split it further.

**Check what got staged:**
```bash
git status
```
```
On branch main

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html
        modified:   style.css
```
Anything listed under **"Changes to be committed"** is staged and will be included in the next commit.

**Undo a stage (before committing):**
```bash
git restore --staged index.html
```
This unstages the file but keeps your edits — nothing is lost, it just goes back to "modified, not staged."

---

## 2. `git commit`

Takes everything currently in the staging area and saves it as a permanent, named snapshot in your project's history.

**Commit with a message inline (most common):**
```bash
git commit -m "Add homepage layout"
```

**Commit without `-m`** — opens your default text editor so you can write a longer, multi-line message:
```bash
git commit
```
Type your message, save, and close the editor to finish. (Default editor is often Vim: press `i` to start typing, `Esc` when done, then `:wq` + Enter to save and quit.)

**Shortcut: stage + commit all *already-tracked, modified* files in one step** (this does **not** pick up brand-new/untracked files — those still need `git add` first):
```bash
git commit -am "Fix header spacing"
```

**Fix the most recent commit** instead of creating a new one — e.g. you forgot to include a file, or typo'd the message:
```bash
git commit --amend -m "Corrected commit message"
```
Only amend a commit that hasn't been pushed/shared with anyone yet — amending rewrites that commit's history.

**Expected output:**
```
[main a1b2c3d] Add homepage layout
 2 files changed, 34 insertions(+), 2 deletions(-)
 create mode 100644 index.html
```

| Part | Meaning |
|---|---|
| `main` | The branch you committed to. |
| `a1b2c3d` | The short commit hash — a unique ID for this snapshot. |
| `2 files changed` | How many files were included in this commit. |
| `insertions(+) / deletions(-)` | Lines added / removed across those files. |

**Good commit message habits:**
- Keep the first line short (≈50 characters) and phrased as an instruction: *"Add login form"*, not *"Added login form"* or *"stuff"*.
- One logical change per commit — makes it much easier to review or undo later.
- For more detail, leave a blank line after the summary, then explain the *why* (not just the *what*) in the body.

---

## 3. `git log`

Shows the history of commits — what's been saved, by whom, and when. This is how you look back at your project's timeline.

**Full history (most recent first):**
```bash
git log
```
```
commit a1b2c3d4e5f678901234567890abcdef12345678
Author: Sarib <saribraja1998@gmail.com>
Date:   Tue Aug 4 14:02:11 2026 +0500

    Add homepage layout

commit 9f8e7d6c5b4a321098765432109876fedcba9876
Author: Sarib <saribraja1998@gmail.com>
Date:   Mon Aug 3 10:15:44 2026 +0500

    Initial commit
```
Each entry shows the full commit hash, author, date, and message. If it opens in a pager, press `q` to exit.

**Compact, one line per commit:**
```bash
git log --oneline
```
```
a1b2c3d Add homepage layout
9f8e7d6 Initial commit
```

**Visual branch graph** (most useful once you have more than one branch):
```bash
git log --oneline --graph --all
```
```
* a1b2c3d (HEAD -> main) Add homepage layout
* 9f8e7d6 Initial commit
```

**Limit how many commits are shown:**
```bash
git log -n 5
```

**See exactly what changed in each commit** (adds the full diff):
```bash
git log -p
```

**Filter by author:**
```bash
git log --author="Sarib"
```

**Filter by date range:**
```bash
git log --since="2 weeks ago"
git log --until="2026-08-01"
```

**Per-file change summary for each commit:**
```bash
git log --stat
```
```
 a1b2c3d Add homepage layout
  index.html | 20 ++++++++++++++++++++
  style.css  | 14 ++++++++++++--
  2 files changed, 32 insertions(+), 2 deletions(-)
```

**Handy everyday combo:**
```bash
git log --oneline --graph --decorate
```
`--decorate` labels commits with branch and tag names, so you can see at a glance where `HEAD`, `main`, etc. currently point.

---

## Everyday flow

```bash
git add .                       # stage your changes
git status                      # double-check what's staged
git commit -m "Describe change" # save the snapshot
git log --oneline               # confirm it's in the history
```
