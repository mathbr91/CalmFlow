import json
import urllib.request
import urllib.error

# Ler token salvo
try:
    with open('temp_token.txt', 'r') as f:
        access_token = f.read().strip()
except:
    print("❌ Token não encontrado.")
    exit(1)

print('5️⃣ Testando GET /api/v1/profile/ (Dados do usuário logado) ...')
url = 'http://localhost:8000/api/v1/profile/'
req = urllib.request.Request(url, method='GET')
req.add_header('Authorization', f'Bearer {access_token}')

try:
    with urllib.request.urlopen(req) as response:
        print(f'✅ Status: {response.status}')
        resp_data = json.loads(response.read())
        print(json.dumps(resp_data, indent=2, ensure_ascii=False))
except urllib.error.HTTPError as e:
    print(f'❌ Status: {e.code}')
    try:
        print(json.dumps(json.loads(e.read()), indent=2, ensure_ascii=False))
    except:
        print(e.read())


print('\\n6️⃣ Testando Validação - Email Duplicado ...')
url = 'http://localhost:8000/api/v1/register/'
payload = {
    'username': 'outro_usuario',
    'email': 'maria@example.com',  # ← Email que já existe!
    'first_name': 'Outro',
    'last_name': 'Usuário',
    'password': 'SenhaForte789!',
    'password_confirm': 'SenhaForte789!'
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        print(f'Criado (não deveria): {response.status}')
except urllib.error.HTTPError as e:
    print(f'✅ Erro esperado - Status: {e.code}')
    try:
        error_data = json.loads(e.read())
        print(json.dumps(error_data, indent=2, ensure_ascii=False))
        if 'email' in error_data and 'já existe' in str(error_data['email']):
            print("✅ Validação de email único funcionando!")
    except:
        print(e.read())


print('\\n7️⃣ Testando Validacao - Senhas Não Conferem ...')
url = 'http://localhost:8000/api/v1/register/'
payload = {
    'username': 'usuario_novo',
    'email': 'novo@example.com',
    'first_name': 'Novo',
    'last_name': 'Usuário',
    'password': 'SenhaForte123!',
    'password_confirm': 'SenhaErrada456!'  # ← Senhas diferentes!
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as response:
        print(f'Criado (não deveria): {response.status}')
except urllib.error.HTTPError as e:
    print(f'✅ Erro esperado - Status: {e.code}')
    try:
        error_data = json.loads(e.read())
        print(json.dumps(error_data, indent=2, ensure_ascii=False))
        if 'não conferem' in str(error_data).lower():
            print("✅ Validação de senha funcionando!")
    except:
        print(e.read())
