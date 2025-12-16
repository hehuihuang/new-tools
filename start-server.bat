@echo off
echo ========================================
echo 在线工具箱 - 本地服务器启动
echo ========================================
echo.

REM 检查端口 8000 是否被占用
netstat -ano | findstr ":8000 " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [警告] 端口 8000 已被占用！
    echo.
    echo 选择操作：
    echo   1. 使用备用端口 8080
    echo   2. 关闭占用端口 8000 的进程
    echo   3. 退出
    echo.
    set /p choice="请输入选项 (1/2/3): "
    
    if "!choice!"=="2" (
        echo.
        echo 正在查找占用端口 8000 的进程...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " ^| findstr "LISTENING"') do (
            echo 正在终止进程 PID: %%a
            taskkill /F /PID %%a >nul 2>&1
        )
        echo 进程已终止，正在启动服务器...
        goto :start8000
    ) else if "!choice!"=="3" (
        exit /b
    ) else (
        goto :start8080
    )
) else (
    goto :start8000
)

:start8000
echo 正在启动本地 Web 服务器 (端口 8000)...
echo.
echo 服务器启动后，请在浏览器中访问：
echo.
echo   导航页: http://localhost:8000/tooles/index.html
echo   测试页: http://localhost:8000/test-links.html
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.
python -m http.server 8000
goto :end

:start8080
echo 正在启动本地 Web 服务器 (端口 8080)...
echo.
echo 服务器启动后，请在浏览器中访问：
echo.
echo   导航页: http://localhost:8080/tooles/index.html
echo   测试页: http://localhost:8080/test-links.html
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.
python -m http.server 8080
goto :end

:end
if %errorlevel% neq 0 (
    echo.
    echo 错误: 服务器启动失败
    echo.
    echo 请尝试以下方法：
    echo 1. 安装 Python: https://www.python.org/downloads/
    echo 2. 使用 VS Code Live Server 扩展
    echo 3. 使用 Node.js: npx http-server -p 8000
    echo.
    pause
)
