# 🔄 The Ultimate Guide to Git Rebase

Welcome to the comprehensive guide on `git rebase`! Often considered an advanced and slightly intimidating Git command, rebasing is actually a powerful tool for maintaining a clean, linear, and readable project history.

---

## 📖 Table of Contents
1. [What is Git Rebase?](#-what-is-git-rebase)
2. [Rebase vs. Merge](#-rebase-vs-merge)
3. [The Golden Rule of Rebasing](#-the-golden-rule-of-rebasing)
4. [How to Perform a Basic Rebase](#-how-to-perform-a-basic-rebase)
5. [Interactive Rebase (`-i`)](#-interactive-rebase--i)
6. [Handling Conflicts During Rebase](#-handling-conflicts-during-rebase)
7. [Aborting a Rebase](#-aborting-a-rebase)
8. [Summary](#-summary)

---

## 🤔 What is Git Rebase?

In Git, rebasing is the process of moving or combining a sequence of commits to a new base commit. 

Imagine you created a feature branch off of `main`. While you were working on your feature, other developers merged their changes into `main`. Your branch is now out of date. 

Instead of using `git merge` to pull those new `main` changes into your branch, you can use `git rebase main`. Git will conceptually "unplug" your branch, fast-forward `main` with the latest changes, and then "plug" your branch back in at the very tip of `main`.

It rewrites history to make it look like you started working on your feature *after* everyone else finished theirs!

---

## ⚖️ Rebase vs. Merge

Both `merge` and `rebase` solve the same problem: integrating changes from one branch into another. The difference lies in the resulting commit history.

### Git Merge
- **How it works:** Creates a new "merge commit" that ties the two histories together.
- **Pros:** Preserves complete history and chronologically accurate context. It's non-destructive.
- **Cons:** Can lead to a messy, cluttered history with many merge commits (the "subway map" effect).

### Git Rebase
- **How it works:** Rewrites commit history by transferring commits to a new base.
- **Pros:** Creates a perfectly clean, linear history. Easy to follow the progression of the project.
- **Cons:** Rewrites history. If done incorrectly on shared branches, it can cause major headaches for the team.

---

## ⚠️ The Golden Rule of Rebasing

**NEVER REBASE PUBLIC BRANCHES.**

If a branch has been pushed to a remote repository and other developers are collaborating on it (like `main`, `develop`, or a shared feature branch), do not rebase it. 

Rebasing rewrites commit hashes. If you rebase a shared branch and force-push it, your teammates' local histories will instantly become incompatible with the remote repository, resulting in chaotic merge conflicts.

*Rule of thumb: Only rebase your local, private branches before pushing them to the remote.*

---

## 🛠️ How to Perform a Basic Rebase

Let's say you are on a branch called `feature-login` and you want to incorporate the latest changes from `main`.

**Step 1:** Ensure your local `main` is up to date.
```bash
git checkout main
git pull origin main
```

**Step 2:** Switch back to your feature branch.
```bash
git checkout feature-login
```

**Step 3:** Initiate the rebase.
```bash
git rebase main
```
Git will now replay your `feature-login` commits on top of the latest `main`.

---

## 🪄 Interactive Rebase (`-i`)

Interactive rebasing is where the true magic happens. It allows you to alter individual commits in the process of rebasing. You can combine (squash) multiple commits into one, reword commit messages, or delete commits entirely.

To start an interactive rebase for the last 3 commits, use:
```bash
git rebase -i HEAD~3
```

This will open your terminal text editor with a list of your commits and commands you can apply to them:
```text
pick 1a2b3c4 Add login UI
pick 5d6e7f8 Fix typo in UI
pick 9g0h1i2 Add login backend logic

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# s, squash = use commit, but meld into previous commit
# d, drop = remove commit
```

If you want to combine the first and second commits, you would change `pick` to `squash` (or `s`) for the second commit, save, and exit.

---

## 💥 Handling Conflicts During Rebase

Because a rebase applies your commits one by one, you might encounter conflicts at multiple stages of the rebase process.

1. Git will pause the rebase and tell you which file has a conflict.
2. Open the file, resolve the conflict (remove the `<<<<`, `====`, `>>>>` markers), and save.
3. Stage the resolved file:
   ```bash
   git add <filename>
   ```
4. **DO NOT COMMIT.** Instead, tell Git to continue to the next step of the rebase:
   ```bash
   git rebase --continue
   ```

---

## 🚑 Aborting a Rebase

If things go completely wrong, you get overwhelmed with conflicts, or you realize you shouldn't be rebasing, you can easily hit the panic button to stop the process and return your branch to exactly how it was before you started:

```bash
git rebase --abort
```

---

## 🎯 Summary

- Use `git rebase` to keep a clean, linear project history.
- Use `git rebase -i` to clean up your messy local commits before submitting a Pull Request.
- Resolve conflicts step-by-step using `git rebase --continue`.
- **Never, ever rebase a public, shared branch.**
