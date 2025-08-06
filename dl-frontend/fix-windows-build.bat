@echo off
echo Cleaning Next.js build cache...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo Clearing npm cache...
npm cache clean --force

echo Reinstalling dependencies...
npm install

echo Building Next.js application...
npm run build

echo Build completed!
pause