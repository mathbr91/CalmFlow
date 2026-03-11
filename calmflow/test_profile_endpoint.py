#!/usr/bin/env python
"""
Test script para validar o endpoint de perfil estendido
"""

import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Dados de teste
TEST_USER = {
    'username': 'test_profile_user',
    'email': 'testprofile@test.com',
    'password': 'TestPass123!',
    'password_confirm': 'TestPass123!',
    'first_name': 'Test',
}

def test_profile_flow():
    """Teste completo do fluxo de perfil"""
    print("\n" + "="*80)
    print("🧪 TESTE DO ENDPOINT DE PERFIL ESTENDIDO")
    print("="*80)
    
    # 1. Register
    print("\n1️⃣ Registrando novo usuário...")
    try:
        register_response = requests.post(
            f'{BASE_URL}/register/',
            json=TEST_USER,
            timeout=5
        )
        print(f"   Status: {register_response.status_code}")
        print(f"   Response: {json.dumps(register_response.json(), indent=2)}")
        
        if register_response.status_code != 201:
            print("   ❌ Falha no registro!")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    # 2. Login
    print("\n2️⃣ Fazendo login...")
    login_data = {
        'username': TEST_USER['username'],
        'password': TEST_USER['password'],
    }
    try:
        login_response = requests.post(
            f'{BASE_URL}/token/',
            json=login_data,
            timeout=5
        )
        print(f"   Status: {login_response.status_code}")
        data = login_response.json()
        print(f"   Access Token: {data.get('access', '')[:50]}...")
        
        if login_response.status_code != 200:
            print("   ❌ Falha no login!")
            return
        
        token = data['access']
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # 3. GET profile-extended (sem contato_apoio)
    print("\n3️⃣ Obtendo perfil estendido (GET)...")
    try:
        profile_response = requests.get(
            f'{BASE_URL}/profile-extended/',
            headers=headers,
            timeout=5
        )
        print(f"   Status: {profile_response.status_code}")
        profile_data = profile_response.json()
        print(f"   Response: {json.dumps(profile_data, indent=2)}")
        
        if profile_response.status_code != 200:
            print("   ❌ Falha ao obter perfil!")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    # 4. PUT profile-extended (atualizar contato_apoio)
    print("\n4️⃣ Atualizando contato de apoio (PUT)...")
    update_data = {
        'contato_apoio': '+55 11 98765-4321'
    }
    try:
        update_response = requests.put(
            f'{BASE_URL}/profile-extended/',
            json=update_data,
            headers=headers,
            timeout=5
        )
        print(f"   Status: {update_response.status_code}")
        updated_data = update_response.json()
        print(f"   Response: {json.dumps(updated_data, indent=2)}")
        
        if update_response.status_code != 200:
            print("   ❌ Falha ao atualizar perfil!")
            return
        
        if updated_data.get('contato_apoio') != '+55 11 98765-4321':
            print("   ❌ contato_apoio não foi atualizado corretamente!")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    # 5. GET profile-extended (com contato_apoio)
    print("\n5️⃣ Verificando perfil atualizado (GET)...")
    try:
        verify_response = requests.get(
            f'{BASE_URL}/profile-extended/',
            headers=headers,
            timeout=5
        )
        print(f"   Status: {verify_response.status_code}")
        verify_data = verify_response.json()
        print(f"   Response: {json.dumps(verify_data, indent=2)}")
        
        if verify_data.get('contato_apoio') == '+55 11 98765-4321':
            print("   ✅ contato_apoio persistiu corretamente!")
        else:
            print("   ❌ contato_apoio não foi persistido!")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    print("\n" + "="*80)
    print("✅ TODOS OS TESTES PASSARAM!")
    print("="*80)

if __name__ == '__main__':
    test_profile_flow()
