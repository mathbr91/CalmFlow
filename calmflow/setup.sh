#!/bin/bash

# Script de setup para o projeto CalmFlow
# Executar com: bash setup.sh

echo "====================================="
echo "    CalmFlow - Setup Inicial"
echo "    App de Suporte Emocional"
echo "====================================="
echo ""

echo "[1/4] Criando ambiente virtual..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Erro ao criar venv. Certifique-se que Python 3 está instalado."
    exit 1
fi
echo "✓ Ambiente virtual criado"

echo ""
echo "[2/4] Ativando ambiente virtual..."
source venv/bin/activate
echo "✓ Ambiente virtual ativado"

echo ""
echo "[3/4] Instalando dependências..."
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Erro ao instalar dependências."
    exit 1
fi
echo "✓ Dependências instaladas"

echo ""
echo "[4/4] Executando migrações iniciais..."
python manage.py migrate
echo "✓ Banco de dados configurado"

echo ""
echo "====================================="
echo "    Setup Concluído!"
echo "====================================="
echo ""
echo "Próximos passos:"
echo "1. Criar superusuário: python manage.py createsuperuser"
echo "2. Iniciar servidor: python manage.py runserver"
echo "3. Acessar admin em: http://localhost:8000/admin"
echo ""
