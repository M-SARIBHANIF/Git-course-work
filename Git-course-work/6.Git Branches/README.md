# Git Branches in Detail

A reference for creating, switching between, merging, and cleaning up branches — the core workflow that lets you work on features, fixes, and experiments without disturbing your main codebase.

## What a branch actually is

A branch is just a **movable pointer** to a specific commit. When you commit, the branch you're on automatically moves forward to point at the new commit. `main` (or `master`) isn't special to Git — it's just the default branch name, a pointer like any other.

`HEAD` is a pointer to *whichever branch you're currently on*. When you switch branches, `HEAD` moves to point at a different branch, and your working files update to match.

```
          A---B---C  (main)
               \
                D---E  (feature-login)
```
Here, `feature-login` was created from commit `B`, and has since moved ahead with its own commits (`D`, `E`) — completely independent of what happens on `main`.

## Why use branches

- Work on a new feature or fix without breaking the working version on `main`.
- Try something experimental — if it doesn't work out, just delete the branch.
- Let multiple people (or multiple tasks) progress in parallel without stepping on each other.

## Viewing branches

**List local branches** (the `*` marks which one you're currently on):
```bash
git branch
```
```
  feature-login
* main
```

**List local *and* remote-tracking branches:**
```bash
git branch -a
```

**List branches with their latest commit message:**
```bash
git branch -v
```

## Creating a branch

**Create a new branch (stays on your current branch — doesn't switch to it):**
```bash
git branch feature-login
```

**Create and switch to it in one step** (the classic way):
```bash
git checkout -b feature-login
```

**Same thing, using the newer, clearer command:**
```bash
git switch -c feature-login
```

New branches start out identical to whatever branch you created them from — pointing at the same commit — and diverge as you commit on them.

## Switching branches

**Older command:**
```bash
git checkout main
```

**Newer, more explicit command** (introduced to separate "switch branches" from `checkout`'s other jobs, like restoring files):
```bash
git switch main
```

> Switching branches updates the files in your working directory to match that branch. Commit or stash any changes first — Git will refuse to switch if it would overwrite uncommitted work it can't safely merge.

## Renaming and deleting branches

**Rename the branch you're currently on:**
```bash
git branch -m new-branch-name
```

**Delete a local branch** (safe — only works if it's already merged):
```bash
git branch -d feature-login
```

**Force-delete a local branch** (even if it has unmerged work — use with care, this can lose commits):
```bash
git branch -D feature-login
```

**Delete a branch on the remote (e.g. GitHub):**
```bash
git push origin --delete feature-login
```

## Merging branches

Merging brings the changes from one branch into another.

**Step 1 — switch to the branch you want to merge *into*:**
```bash
git switch main
```

**Step 2 — merge the other branch in:**
```bash
git merge feature-login
```

**Two possible outcomes:**

| Type | When it happens | What you get |
|---|---|---|
| **Fast-forward** | `main` hasn't moved since `feature-login` was created | `main`'s pointer simply moves forward — no new commit, linear history |
| **Merge commit** | Both branches have new commits since they diverged | Git creates a new commit with **two parents**, tying the histories together |

**Example merge commit output:**
```
Merge made by the 'ort' strategy.
 index.html | 12 ++++++++++++
 1 file changed, 12 insertions(+)
```

## Merge conflicts

A conflict happens when the two branches changed the **same lines** of the same file in different ways — Git can't decide which version is correct, so it asks you to.

**When it happens, `git status` shows something like:**
```
Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   index.html
```

**Inside the conflicted file, Git marks both versions:**
```html
<<<<<<< HEAD
<h1>Welcome to my site</h1>
=======
<h1>Welcome home</h1>
>>>>>>> feature-login
```
- Everything between `<<<<<<< HEAD` and `=======` is *your current branch's* version.
- Everything between `=======` and `>>>>>>> feature-login` is the *incoming branch's* version.

**To resolve:**
1. Edit the file by hand — keep, combine, or rewrite the lines however's correct, and delete the `<<<<<<<`, `=======`, `>>>>>>>` markers.
2. Stage the resolved file: `git add index.html`
3. Finish the merge: `git commit` (Git pre-fills a merge commit message for you).

**Bail out of a messy merge and go back to how things were:**
```bash
git merge --abort
```

## Working with remote branches

**Push a new local branch to the remote and set up tracking** (so future `git push` / `git pull` know where it goes):
```bash
git push -u origin feature-login
```

**See a branch that exists on the remote but not yet locally:**
```bash
git fetch
git switch feature-login
```
Git will automatically create a local branch that tracks the matching remote one.

**See how your local branch compares to its remote counterpart:**
```bash
git status
```
```
On branch feature-login
Your branch is ahead of 'origin/feature-login' by 2 commits.
```

## Visualizing branches

```bash
git log --oneline --graph --all --decorate
```
```
* a1b2c3d (HEAD -> main, origin/main) Merge feature-login
|\
| * e5f6g7h (feature-login) Add login validation
| * d3e4f5g Add login form
|/
* 9f8e7d6 Initial commit
```
The graph shows exactly where `feature-login` split off from `main`, and where it merged back in.

## Naming conventions worth adopting

Not enforced by Git, but common in teams:
```
feature/login-page
fix/header-overlap
chore/update-dependencies
```
The prefix (`feature/`, `fix/`, `chore/`) makes it instantly clear what kind of work a branch represents.

## Quick reference

```bash
git branch                          # list local branches
git branch -a                       # list local + remote branches
git switch -c feature-login         # create and switch to a new branch
git switch main                     # switch to an existing branch
git branch -m new-name              # rename current branch
git branch -d feature-login         # delete a merged local branch
git push origin --delete feature-login  # delete a remote branch
git merge feature-login             # merge a branch into your current one
git merge --abort                   # cancel a merge in progress
git push -u origin feature-login    # push a new branch and start tracking it
git log --oneline --graph --all     # visualize branch history
```
