@echo off
echo 🚀 FindYourPreSchool - GitHub Push Helper
echo.

echo Checking if repository exists...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://api.github.com/repos/charantamarapu/findyourpreschool' -UseBasicParsing; if ($response.StatusCode -eq 200) { echo '✅ Repository exists!'; } } catch { echo '❌ Repository not found. Please create it first.'; exit 1; }"

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Your code is now on GitHub!
    echo.
    echo Next steps:
    echo 1. Go to https://render.com
    echo 2. Connect your GitHub repository
    echo 3. Follow DEPLOYMENT_GUIDE.md for deployment
) else (
    echo.
    echo ❌ Push failed. Make sure you created the repository first.
)

pause