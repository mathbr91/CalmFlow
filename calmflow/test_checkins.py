import json
import urllib.request
import urllib.error

# Ler token salvo
try:
    with open('temp_token.txt', 'r') as f:
        access_token = f.read().strip()
except:
    print("❌ Token não encontrado. Execute test_authentication.py primeiro.")
    exit(1)

print('3️⃣ Testando POST /api/v1/check-ins/ (com autenticação) ...')
url = 'http://localhost:8000/api/v1/check-ins/'
payload = {
    'clima_interno': 'nublado',
    'nivel_ruido': 6,
    'gatilho': 'trabalho',
    'auto_eficacia': 7
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')
req.add_header('Authorization', f'Bearer {access_token}')

try:
    with urllib.request.urlopen(req) as response:
        print(f'✅ Status: {response.status}')
        resp_data = json.loads(response.read())
        print(json.dumps(resp_data, indent=2, ensure_ascii=False))
        print(f"\\n✅ Usuario foi auto-preenchido: usuario={resp_data.get('usuario')}")
        
except urllib.error.HTTPError as e:
    print(f'❌ Status: {e.code}')
    try:
        print(json.dumps(json.loads(e.read()), indent=2, ensure_ascii=False))
    except:
        print(e.read())


print('\\n4️⃣ Testando POST /api/v1/emergencias/ (anônimo - AllowAny) ...')
url = 'http://localhost:8000/api/v1/emergencias/'
payload = {
    'sintoma_principal': 'respiracao',
    'ambiente_seguro': True
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')
# SEM autenticação - deve funcionar com AllowAny

try:
    with urllib.request.urlopen(req) as response:
        print(f'✅ Status: {response.status}')
        resp_data = json.loads(response.read())
        print(json.dumps(resp_data, indent=2, ensure_ascii=False))
        print(f"\\n✅ Emergencia anônima criada! usuario_nome={resp_data.get('usuario_nome')}")
        print(f"✅ Tecnica foi retornada automaticamente:")
        if resp_data.get('tecnica_sugerida'):
            tecnica = resp_data['tecnica_sugerida']
            print(f"   - Título: {tecnica.get('titulo')}")
            print(f"   - Passos: {len(tecnica.get('passos', []))} instruções")
        
except urllib.error.HTTPError as e:
    print(f'❌ Status: {e.code}')
    try:
        print(json.dumps(json.loads(e.read()), indent=2, ensure_ascii=False))
    except:
        print(e.read())
