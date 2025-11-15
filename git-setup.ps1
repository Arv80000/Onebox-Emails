# Git Setup Script for Email Onebox Assignment
# Run this script to initialize and push to GitHub

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Email Onebox - Git Setup Script" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Get GitHub username
Write-Host "`nEnter your GitHub username:" -ForegroundColor Yellow
$username = Read-Host

# Confirm
Write-Host "`nYour repository will be:" -ForegroundColor Cyan
Write-Host "https://github.com/$username/email-onebox-assignment" -ForegroundColor White
Write-Host "`nIs this correct? (Y/N):" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Setup cancelled." -ForegroundColor Red
    exit
}

# Initialize Git
Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
git init

# Configure Git (if not already configured)
Write-Host "Configuring Git..." -ForegroundColor Yellow
Write-Host "Enter your name (for Git commits):" -ForegroundColor Cyan
$name = Read-Host
Write-Host "Enter your email (for Git commits):" -ForegroundColor Cyan
$email = Read-Host

git config user.name "$name"
git config user.email "$email"

# Add all files
Write-Host "`nAdding files to Git..." -ForegroundColor Yellow
git add .

# Create commit
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Complete Email Onebox Assignment - All 6 Features Implemented"

# Add remote
Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
$repoUrl = "https://github.com/$username/email-onebox-assignment.git"
git remote add origin $repoUrl

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for GitHub credentials..." -ForegroundColor Cyan
git push -u origin main

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nYour repository is now at:" -ForegroundColor Cyan
Write-Host "https://github.com/$username/email-onebox-assignment" -ForegroundColor White

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/$username/email-onebox-assignment" -ForegroundColor White
Write-Host "2. Click 'Settings' → 'Collaborators'" -ForegroundColor White
Write-Host "3. Add: Mitrajit" -ForegroundColor White
Write-Host "4. Add: sarvagya-chaudhary" -ForegroundColor White
Write-Host "5. Record demo video (max 5 minutes)" -ForegroundColor White
Write-Host "6. Submit form: https://forms.gle/DqF27M4Sw1dJsf4j6" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
