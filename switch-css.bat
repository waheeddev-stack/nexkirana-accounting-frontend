@echo off
if "%1"=="plain" (
    echo Switching to plain CSS without Tailwind directives...
    powershell -Command "(Get-Content src\main.jsx) -replace \"import './index.css'\", \"import './styles.css'\" | Set-Content src\main.jsx"
    echo ✅ Switched to plain CSS without Tailwind directives
    echo Note: This avoids editor warnings but may have limited styling.
) else if "%1"=="tailwind" (
    echo Switching to Tailwind CSS with @tailwind directives...
    powershell -Command "(Get-Content src\main.jsx) -replace \"import './styles.css'\", \"import './index.css'\" | Set-Content src\main.jsx"
    echo ✅ Switched to Tailwind CSS with @tailwind directives
    echo Note: You may see "Unknown at rule" warnings in your editor, but the app will work fine.
) else (
    echo Usage:
    echo   switch-css.bat tailwind  # Use Tailwind with @tailwind directives
    echo   switch-css.bat plain     # Use plain CSS without directives
)
pause