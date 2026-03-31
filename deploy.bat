@echo off
chcp 65001 > nul
title ABL AI Demo - Vercel 배포

echo.
echo ================================
echo  우리금융그룹 AI 플랫폼 배포
echo  Powered by 42Maru
echo ================================
echo.

cd /d "%~dp0"

echo [1/3] 패키지 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install 실패
    pause
    exit /b 1
)

echo.
echo [2/3] 빌드 확인 중...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: 빌드 실패
    pause
    exit /b 1
)

echo.
echo [3/3] Vercel 배포 중...
echo (처음 실행 시 로그인 페이지가 열립니다)
echo.
call npx vercel --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo 배포 중 오류가 발생했습니다.
    echo 수동으로 실행: npx vercel --prod
    pause
    exit /b 1
)

echo.
echo ================================
echo  배포 완료! 위 URL을 확인하세요
echo ================================
echo.
pause
