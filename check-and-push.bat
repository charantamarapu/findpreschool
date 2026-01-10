@echo off
echo 🚀 FindYourPreSchool - GitHub Repository Check & Push
echo.

echo Checking if GitHub repository exists...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://api.github.com/repos/charantamarapu/findyourpreschool' -UseBasicParsing -ErrorAction Stop; echo '✅ Repository found! Pushing code...'; } catch { echo '❌ Repository not found. Please create it on GitHub first.'; echo 'Go to: https://github.com/new'; echo 'Name: findyourpreschool'; echo 'Make it Public, uncheck all options'; exit 1; }"

echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Your code is now on GitHub!
    echo.
    echo 🚀 Next: Deploy to Render.com
    echo 1. Go to https://render.com
    echo 2. Connect your GitHub repo
    echo 3. Follow DEPLOYMENT_GUIDE.md
) else (
    echo.
    echo ❌ Push failed. Make sure repository exists.
)

echo.
pause