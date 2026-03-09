import json
import urllib.request
import urllib.error

# Ler token  
try:
    with open('temp_token.txt', 'r') as f:
        access_token = f.read().strip()
except:
    print("❌ Refresh token não encontrado.")
    exit(1)

print('8️⃣ Testando Token Refresh ...')
url = 'http://localhost:8000/api/v1/token/refresh/'

# Primeiro, vou obter o refresh token fazendo login novamente
print('  Fazendo login para obter refresh_token...')
login_url = 'http://localhost:8000/api/v1/token/'
login_payload = {
    'username': 'maria_silva',
    'password': 'SenhaForte456!'
}
login_data = json.dumps(login_payload).encode('utf-8')
login_req = urllib.request.Request(login_url, data=login_data, method='POST')
login_req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(login_req) as response:
        login_resp = json.loads(response.read())
        refresh_token = login_resp.get('refresh')
        print(f"  ✅ Refresh token obtido")
except Exception as e:
    print(f"  ❌ Erro: {e}")
    exit(1)

# Agora testar refresh
payload = {'refresh': refresh_token}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        print(f'✅ Status: {response.status}')
        resp_data = json.loads(response.read())
        print(json.dumps(resp_data, indent=2, ensure_ascii=False))
        
        new_access = resp_data.get('access', '')
        print(f"\n✅ Novo access token gerado: {new_access[:50]}...")
        print("✅ Token refresh funcionando corretamente!")
        
        # Salvar novo token
        with open('temp_token.txt', 'w') as f:
            f.write(new_access)
        
except urllib.error.HTTPError as e:
    print(f'❌ Status: {e.code}')
    try:
        print(json.dumps(json.loads(e.read()), indent=2, ensure_ascii=False))
    except:
        print(e.read())
