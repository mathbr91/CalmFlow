@echo off
REM Script de setup para o projeto CalmFlow
REM Windows PowerShell ou CMD

echo =====================================
echo    CalmFlow - Setup Inicial
echo    App de Suporte Emocional
echo =====================================
echo.

echo [1/4] Criando ambiente virtual...
python -m venv venv
if errorlevel 1 (
    echo Erro ao criar venv. Certifique-se que Python está instalado.
    exit /b 1
)
echo ✓ Ambiente virtual criado

echo.
echo [2/4] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo ✓ Ambiente virtual ativado

echo.
echo [3/4] Instalando dependências...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo Erro ao instalar dependências.
    exit /b 1
)
echo ✓ Dependências instaladas

echo.
echo [4/4] Executando migrações iniciais...
python manage.py migrate
echo ✓ Banco de dados configurado

echo.
echo =====================================
echo    Setup Concluído!
echo =====================================
echo.
echo Próximos passos:
echo 1. Criar superusuário: python manage.py createsuperuser
echo 2. Iniciar servidor: python manage.py runserver
echo 3. Acessar admin em: http://localhost:8000/admin
echo.
