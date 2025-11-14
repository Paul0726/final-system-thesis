# 📥 PAANO I-INSTALL ANG GIT - Step by Step

## ⚠️ IMPORTANTE: Kailangan mo muna i-install ang Git bago magpatuloy!

---

## 🎯 STEP 1: I-DOWNLOAD ANG GIT

### Option A: Direct Download (Pinakamadali)

1. **Buksan ang web browser** (Chrome, Edge, Firefox, etc.)

2. **I-type sa address bar:**
   ```
   https://git-scm.com/download/win
   ```
   O i-click ang link na ito: [Download Git for Windows](https://git-scm.com/download/win)

3. **Press Enter**

4. **Mag-download automatically** ang Git installer
   - Makikita mo sa Downloads folder
   - File name: `Git-2.x.x-64-bit.exe` (o similar)

---

## 🎯 STEP 2: I-INSTALL ANG GIT

1. **Pumunta sa Downloads folder:**
   - Buksan ang File Explorer
   - I-click ang "Downloads" sa left sidebar
   - O pumunta sa: `C:\Users\marianne\Downloads`

2. **I-double click ang Git installer file:**
   - Hanapin ang file na `Git-2.x.x-64-bit.exe`
   - I-double click

3. **Kung may Security Warning:**
   - I-click ang "Run" o "Yes"

4. **Follow ang Installation Wizard:**

   **Screen 1: License Information**
   - I-click ang "Next"

   **Screen 2: Select Destination Location**
   - I-click ang "Next" (default location ay OK)

   **Screen 3: Select Components**
   - ✅ I-check ang lahat (default na checked na)
   - I-click ang "Next"

   **Screen 4: Select Start Menu Folder**
   - I-click ang "Next" (default ay OK)

   **Screen 5: Choosing the default editor**
   - Piliin: "Use Visual Studio Code as Git's default editor" (kung may VS Code)
   - O "Use Notepad as Git's default editor" (kung wala)
   - I-click ang "Next"

   **Screen 6: Adjusting the name of the initial branch**
   - Piliin: "Let Git decide" (recommended)
   - I-click ang "Next"

   **Screen 7: Adjusting your PATH environment**
   - ⚠️ IMPORTANTE: Piliin ang **"Git from the command line and also from 3rd-party software"**
   - I-click ang "Next"

   **Screen 8: Choosing HTTPS transport backend**
   - Piliin: "Use the OpenSSL library" (default)
   - I-click ang "Next"

   **Screen 9: Configuring the line ending conversions**
   - Piliin: "Checkout Windows-style, commit Unix-style line endings" (default)
   - I-click ang "Next"

   **Screen 10: Configuring the terminal emulator**
   - Piliin: "Use Windows' default console window" (default)
   - I-click ang "Next"

   **Screen 11: Configuring extra options**
   - ✅ I-check ang "Enable file system caching"
   - ✅ I-check ang "Enable Git Credential Manager"
   - I-click ang "Next"

   **Screen 12: Configuring experimental options**
   - I-click ang "Install" (walang i-check)

   **Screen 13: Installing**
   - Hintayin matapos ang installation (1-2 minutes)

   **Screen 14: Completing the Git Setup Wizard**
   - ✅ I-check ang "Launch Git Bash" (optional)
   - I-click ang "Finish"

---

## 🎯 STEP 3: I-VERIFY KUNG NAKA-INSTALL NA

1. **I-close ang lahat ng Command Prompt windows** (kung may bukas)

2. **Buksan ang bagong Command Prompt:**
   - Press `Windows Key + R`
   - I-type: `cmd`
   - Press Enter

3. **I-type ang command:**
   ```
   git --version
   ```
   Press Enter

4. **Dapat makita mo:**
   ```
   git version 2.xx.x.windows.x
   ```
   (kahit anong version number, OK lang)

5. **Kung may error pa rin:**
   - I-restart ang computer
   - Subukan ulit ang `git --version`

---

## 🎯 STEP 4: I-CONFIGURE ANG GIT (Optional pero Recommended)

1. **Sa Command Prompt, i-type:**
   ```
   git config --global user.name "Your Name"
   ```
   Press Enter
   - Palitan ang "Your Name" ng actual name mo

2. **I-type:**
   ```
   git config --global user.email "your.email@example.com"
   ```
   Press Enter
   - Palitan ang email ng actual email mo (yung ginamit mo sa GitHub)

**Example:**
```
git config --global user.name "Marianne"
git config --global user.email "marianne@example.com"
```

---

## ✅ TAPOS NA! Pwede ka na magpatuloy sa setup ng repository

**Next Steps:**
1. Bumalik sa `STEP_BY_STEP_GUIDE.md`
2. O i-run ang `setup_repo.bat` script
3. O sundin ang Part 2 ng guide

---

## 🆘 TROUBLESHOOTING

### "git is not recognized" pa rin after installation
- **Solution 1:** I-restart ang computer
- **Solution 2:** I-close lahat ng Command Prompt, buksan ulit
- **Solution 3:** I-check kung naka-install talaga:
  - Pumunta sa: `C:\Program Files\Git\bin\`
  - Dapat may `git.exe` file doon

### Hindi ma-download ang installer
- **Solution:** Subukan ang alternative download link:
  - https://github.com/git-for-windows/git/releases
  - I-download ang latest `Git-x.x.x-64-bit.exe`

### Installation failed
- **Solution:** 
  1. I-run ang installer as Administrator (right-click → Run as administrator)
  2. O i-check kung may antivirus na nag-block

---

**Need help?** I-check ang installation logs o i-try ulit ang installation.

