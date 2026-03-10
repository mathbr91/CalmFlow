import requests

base = 'http://127.0.0.1:8000/api/v1'

print('Register new user')
r = requests.post(base + '/register/', json={
    'username': 'testflow',
    'email': 'testflow@example.com',
    'first_name': 'Flow',
    'last_name': 'User',
    'password': 'FlowPass123!',
    'password_confirm': 'FlowPass123!'
})
print(r.status_code, r.text)

print('Login')
r = requests.post(base + '/token/', json={'email': 'testflow@example.com', 'password': 'FlowPass123!'})
print(r.status_code, r.text)
if r.status_code == 200:
    token = r.json()['access']
    headers = {'Authorization': f'Bearer {token}'}
    print('Create check-in')
    payload = {
        'clima_interno': 'ensolarado',
        'nivel_ruido': 1,
        'gatilho': 'nenhum',
        'auto_eficacia': 7,
        'sintomas': 'nenhum',
        'notas': ''
    }
    r2 = requests.post(base + '/check-ins/', json=payload, headers=headers)
    print(r2.status_code, r2.text)
    print('List check-ins')
    r3 = requests.get(base + '/check-ins/', headers=headers)
    print(r3.status_code, r3.text)
else:
    print('login failed')
