import json
import urllib.request
import urllib.error

print('2️⃣ Testando POST /api/v1/token/ (Login) ...')
url = 'http://localhost:8000/api/v1/token/'
payload = {
    'username': 'maria_silva',
    'password': 'SenhaForte456!'
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        print(f'✅ Status: {response.status}')
        resp_data = json.loads(response.read())
        print(json.dumps(resp_data, indent=2, ensure_ascii=False))
        
        # Extrair e salvar em arquivo para próximo teste
        access_token = resp_data.get('access', '')
        with open('temp_token.txt', 'w') as f:
            f.write(access_token)
        print(f"\n💾 Token salvo para próximos testes")
        
except urllib.error.HTTPError as e:
    print(f'❌ Status: {e.code}')
    try:
        print(json.dumps(json.loads(e.read()), indent=2, ensure_ascii=False))
    except:
        print(e.read())
