# Installing Git — Windows & Mac

## Installing Git on Windows

### Option 1: Official Installer (Recommended)

1. Go to **[git-scm.com](https://git-scm.com/download/win)** — the download should start automatically for your system (or pick 32-bit/64-bit manually).
2. Run the downloaded `.exe` file.
3. Click through the setup wizard. The default options work fine for most people, but a few worth knowing:
   - **Adjusting your PATH environment** — choose *"Git from the command line and also from 3rd-party software"* (recommended default).
   - **Choosing the default editor** — pick whichever you're comfortable with (VS Code is a common choice if installed).
   - **Line ending conversions** — keep the default *"Checkout Windows-style, commit Unix-style line endings"* unless you have a specific reason not to.
4. Click **Install**, then **Finish**.
5. Verify the install by opening **Command Prompt**, **PowerShell**, or **Git Bash** (installed alongside Git) and running:
   ```bash
   git --version
   ```
   You should see something like `git version 2.4x.x.windows.1`.

### Option 2: Winget (Windows Package Manager)

If you're on Windows 10/11 with `winget` available:

```powershell
winget install --id Git.Git -e --source winget
```

### Option 3: Chocolatey

If you use the Chocolatey package manager:

```powershell
choco install git
```

### First-time Setup (Windows)

After installing, set your identity (used in every commit):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Installing Git on Mac

### Option 1: Check if It's Already Installed

macOS often ships with Git pre-installed (via Xcode Command Line Tools). Check first:

```bash
git --version
```

If Git isn't installed, this command will prompt you to install the **Xcode Command Line Tools** — just click **Install** in the popup. This is often the easiest route.

### Option 2: Homebrew (Recommended for latest version)

If you have [Homebrew](https://brew.sh) installed:

```bash
brew install git
```

If you don't have Homebrew yet, install it first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then run `brew install git`.

### Option 3: Official Installer

1. Go to **[git-scm.com](https://git-scm.com/download/mac)**.
2. Download the `.dmg` installer.
3. Open it and follow the installation prompts.

### First-time Setup (Mac)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Verifying the Install (Both Platforms)

```bash
git --version
git config --list
```

The first confirms Git is installed; the second shows your current configuration (name, email, editor, etc.).

## Quick Comparison

| | Windows | Mac |
|---|---|---|
| Easiest method | Official `.exe` installer | Xcode Command Line Tools prompt |
| Package manager | winget / Chocolatey | Homebrew |
| Bundled terminal | Git Bash | Uses macOS Terminal |
| Official site | git-scm.com/download/win | git-scm.com/download/mac |

---

*Once installed, you're ready to `git init`, `git clone`, and start version-controlling your projects.*
