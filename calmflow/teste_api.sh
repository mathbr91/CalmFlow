#!/bin/bash
# 🧪 Script de Teste - API CalmFlow
# Testa os endpoints da API com curl

API_URL="http://localhost:8000/api/v1"

echo "=========================================="
echo "🧪 CalmFlow API Testing Script"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO] Verificando se servidor está rodando...${NC}"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Servidor está online!${NC}"
else
    echo -e "${RED}✗ Servidor NÃO está respondendo. Inicie com: python manage.py runserver${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "1️⃣  TESTE: Endpoint SOS (sem autenticação)"
echo "=========================================="
echo -e "${BLUE}GET ${API_URL}/sos/${NC}"
echo ""
curl -s -X GET "${API_URL}/sos/" -H "Content-Type: application/json" | python -m json.tool
echo ""

echo ""
echo "=========================================="
echo "2️⃣  TESTE: Criar Emergência - Sintoma RESPIRAÇÃO (anônimo)"
echo "=========================================="
echo -e "${BLUE}POST ${API_URL}/emergencias/${NC}"
echo ""
curl -s -X POST "${API_URL}/emergencias/" \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "respiracao",
    "ambiente_seguro": true
  }' | python -m json.tool
echo ""

echo ""
echo "=========================================="
echo "3️⃣  TESTE: Criar Emergência - Sintoma PEITO (anônimo)"
echo "=========================================="
echo -e "${BLUE}POST ${API_URL}/emergencias/${NC}"
echo ""
curl -s -X POST "${API_URL}/emergencias/" \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "peito",
    "ambiente_seguro": false
  }' | python -m json.tool
echo ""

echo ""
echo "=========================================="
echo "4️⃣  TESTE: Criar Emergência - Sintoma MEDO (anônimo)"
echo "=========================================="
echo -e "${BLUE}POST ${API_URL}/emergencias/${NC}"
echo ""
curl -s -X POST "${API_URL}/emergencias/" \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "medo",
    "ambiente_seguro": true
  }' | python -m json.tool
echo ""

echo ""
echo "=========================================="
echo "5️⃣  TESTE: Criar Emergência - Sintoma CONFUSÃO (anônimo)"
echo "=========================================="
echo -e "${BLUE}POST ${API_URL}/emergencias/${NC}"
echo ""
curl -s -X POST "${API_URL}/emergencias/" \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "confusao",
    "ambiente_seguro": true
  }' | python -m json.tool
echo ""

echo ""
echo "=========================================="
echo "📝 RESUMO DOS TESTES"
echo "=========================================="
echo -e "${GREEN}✓ /api/v1/sos/${NC} - Retorna números de emergência + hospitais"
echo -e "${GREEN}✓ POST /api/v1/emergencias/ - Retorna técnica sugerida${NC}"
echo ""
echo -e "${YELLOW}Endpoints Autenticados (ex com token):${NC}"
echo "# Criar token:"
echo "  curl -X POST http://localhost:8000/api-token-auth/ \\"
echo "    -d username=seu_usuario -d password=sua_senha"
echo ""
echo "# Usar token:"
echo "  curl -X POST ${API_URL}/emergencias/ \\"
echo "    -H 'Authorization: Token seu_token_aqui'"
echo ""

echo -e "${BLUE}Para testes interativos, use Postman ou Insomnia!${NC}"
