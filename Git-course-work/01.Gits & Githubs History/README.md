# Git & GitHub — History and Overview

## What is Git?

Git is a **distributed version control system (DVCS)**. It tracks changes to files over time, so you can:

- See the full history of every change made to a project
- Work on new features in isolated **branches** without breaking the main codebase
- Merge work from multiple people together
- Roll back to any previous version if something breaks

Unlike older version control systems, Git is *distributed* — every developer has a full copy of the entire project history on their own machine, not just the files they're currently working on. This means you can commit, branch, and view history even without an internet connection.

## History of Git

- **2005** — Git was created by **Linus Torvalds**, the creator of Linux, to manage the source code of the Linux kernel.
- The Linux kernel project had been using a proprietary tool called **BitKeeper**, but in 2005 the company that owned it withdrew free usage rights for the open-source community.
- Torvalds needed a replacement that was **fast**, **distributed**, and could handle a massive project like Linux with thousands of contributors. Existing tools (like CVS and Subversion) were too slow and centralized.
- He wrote the first version of Git in about **10 days**, focusing on speed, data integrity, and support for distributed, non-linear workflows.
- The name "Git" is British slang for an unpleasant person — Torvalds joked he names his projects after himself. ("I'm an egotistical bastard, so I name all my projects after myself.")
- Git was quickly adopted for Linux kernel development, and over the following years, it became the de facto standard for version control across the software industry, eventually overtaking Subversion and Mercurial.

## What is GitHub?

GitHub is a **cloud-based hosting platform** for Git repositories. Git itself is just the underlying tool that runs on your computer — GitHub adds a website and set of services around it, including:

- Remote hosting for your repositories (so your code lives online, not just on your machine)
- **Pull Requests** — a way to propose, review, and discuss code changes before merging them
- **Issues** — for tracking bugs, tasks, and feature requests
- Collaboration tools (code review, discussions, project boards, wikis)
- **GitHub Actions** — automation and CI/CD pipelines
- Social/discovery features — following users, starring repos, exploring open-source projects

In short: **Git is the tool, GitHub is a place to host and collaborate using that tool.**

## History of GitHub

- **2007–2008** — GitHub was founded by **Tom Preston-Werner, Chris Wanstrath, PJ Hyett, and Scott Chacon**.
- It officially launched in **April 2008**, built specifically to make Git — which was originally a command-line-only tool — easier to use through a web interface, and to make open-source collaboration simpler.
- GitHub grew rapidly because it introduced social-coding features (forking, pull requests, following developers) that made collaborative, open-source development far more accessible.
- **2018** — Microsoft acquired GitHub for approximately **$7.5 billion**.
- Today GitHub hosts well over **100 million repositories** and is used by individual developers, open-source communities, and large enterprises alike.

## Git vs. GitHub — Quick Comparison

| | Git | GitHub |
|---|---|---|
| What it is | Version control software | Hosting platform / service |
| Runs where | Locally on your machine | In the cloud |
| Created by | Linus Torvalds (2005) | Tom Preston-Werner et al. (2008) |
| Requires internet? | No | Yes (for remote features) |
| Alternatives | Mercurial, SVN | GitLab, Bitbucket |

## Other Notable Alternatives to GitHub

Since Git is open and free, several other platforms host Git repositories too:

- **GitLab** — similar feature set, popular for self-hosting and built-in CI/CD
- **Bitbucket** — made by Atlassian, integrates tightly with Jira and Trello
- **SourceForge** — one of the older code-hosting platforms, predates Git itself

## Basic Git Commands (for reference)

```bash
git init                 # start a new repository
git clone <url>           # copy a remote repository locally
git status                 # see what's changed
git add <file>              # stage changes
git commit -m "message"      # save staged changes to history
git push                      # send commits to a remote (e.g. GitHub)
git pull                       # fetch and merge changes from a remote
git branch <name>                # create a new branch
git checkout <branch>              # switch branches
git merge <branch>                   # merge a branch into the current one
```

---

*Git turns 20 years old in 2025, and remains the dominant version control system in software development worldwide.*
