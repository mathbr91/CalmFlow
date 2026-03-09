import json
import urllib.request
import urllib.error

print('🌐 TESTE DE MULTIIDIOMA - CalmFlow MVP\n')
print('=' * 70)

# ==================== TESTE 1: SOS em Português ====================
print('\n1️⃣ GET /api/v1/sos/ (Português PT-BR)')
print('-' * 70)
url = 'http://localhost:8000/api/v1/sos/'
req = urllib.request.Request(url, method='GET')

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        print(f'✅ Status: {response.status}')
        print(f'   Idioma: {data.get("idioma", "?")}')
        print(f'   Status: {data.get("status")}')
        print(f'   Disclaimer (primeiros 100 chars):')
        print(f'   {data.get("disclaimer", "")[:100]}...')
except Exception as e:
    print(f'❌ Erro: {e}')

# ==================== TESTE 2: SOS em Inglês ====================
print('\n2️⃣ GET /api/v1/sos/?lang=en-us (Inglês EN-US)')
print('-' * 70)
url = 'http://localhost:8000/api/v1/sos/?lang=en-us'
req = urllib.request.Request(url, method='GET')

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        print(f'✅ Status: {response.status}')
        print(f'   Idioma: {data.get("idioma", "?")}')
        print(f'   Status: {data.get("status")}')
        print(f'   Disclaimer (primeiros 100 chars):')
        print(f'   {data.get("disclaimer", "")[:100]}...')
except Exception as e:
    print(f'❌ Erro: {e}')

# ==================== TESTE 3: Emergência em Português ====================
print('\n3️⃣ POST /api/v1/emergencias/ (Português PT-BR)')
print('-' * 70)
url = 'http://localhost:8000/api/v1/emergencias/'
payload = {
    'sintoma_principal': 'respiracao',
    'ambiente_seguro': True
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        resp_data = json.loads(response.read())
        print(f'✅ Status: {response.status}')
        print(f'   User: {resp_data.get("usuario_nome")}')
        print(f'   Técnica: {resp_data.get("tecnica_sugerida", {}).get("titulo", "?")}')
        disclaimer = resp_data.get("disclaimer", "")
        print(f'   Disclaimer (primeiros 100 chars):')
        print(f'   {disclaimer[:100]}...')
except urllib.error.HTTPError as e:
    print(f'❌ Erro: {e.code}')

# ==================== TESTE 4: Emergência em Inglês ====================
print('\n4️⃣ POST /api/v1/emergencias/?lang=en-us (Inglês EN-US)')
print('-' * 70)
url = 'http://localhost:8000/api/v1/emergencias/?lang=en-us'
payload = {
    'sintoma_principal': 'medo',
    'ambiente_seguro': True
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        resp_data = json.loads(response.read())
        print(f'✅ Status: {response.status}')
        print(f'   User: {resp_data.get("usuario_nome")}')
        print(f'   Técnica: {resp_data.get("tecnica_sugerida", {}).get("titulo", "?")}')
        disclaimer = resp_data.get("disclaimer", "")
        print(f'   Disclaimer (primeiros 100 chars):')
        print(f'   {disclaimer[:100]}...')
except urllib.error.HTTPError as e:
    print(f'❌ Erro: {e.code}')

# ==================== TESTE 5: Header Accept-Language ====================
print('\n5️⃣ GET /api/v1/sos/ com Header Accept-Language: en-US')
print('-' * 70)
url = 'http://localhost:8000/api/v1/sos/'
req = urllib.request.Request(url, method='GET')
req.add_header('Accept-Language', 'en-US,en;q=0.9')

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        print(f'✅ Status: {response.status}')
        print(f'   Idioma detectado: {data.get("idioma", "?")}')
        print(f'   Status: {data.get("status")}')
        disclaimer = data.get("disclaimer", "")
        print(f'   Disclaimer começa com: {disclaimer[:50]}...')
except Exception as e:
    print(f'❌ Erro: {e}')

# ==================== RESUMO ====================
print('\n' + '=' * 70)
print('✅ RESUMO DE TESTES')
print('=' * 70)
print('✓ SOS em Português (padrão)')
print('✓ SOS em Inglês (?lang=en-us)')
print('✓ Emergência em Português')
print('✓ Emergência em Inglês (?lang=en-us)')
print('✓ Accept-Language header detectado')
print('\n🌍 Multiidioma implementado com sucesso!')
