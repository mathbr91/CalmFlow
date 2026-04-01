"""Testes de API para autenticação, profile, check-in e histórico."""

from datetime import timedelta
from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CheckIn, Emergencia, UserProfile, PsicologoProfile, VinculoTerapeutico


class BaseApiTestCase(APITestCase):
    def create_user(self, email='user@example.com', password='StrongPass123!', first_name='User'):
        return User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
        )

    def authenticate(self, email='user@example.com', password='StrongPass123!', first_name='User'):
        self.create_user(email=email, password=password, first_name=first_name)
        response = self.client.post(
            '/api/v1/token/',
            {'username': email, 'password': password},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return token

    def extract_items(self, response):
        data = response.data
        if isinstance(data, dict) and 'results' in data:
            return data['results']
        return data


class AuthenticationApiTests(BaseApiTestCase):
    def test_register_and_login_flow(self):
        register_response = self.client.post(
            '/api/v1/register/',
            {
                'email': 'newuser@example.com',
                'first_name': 'New',
                'password': 'StrongPass123!',
                'password_confirm': 'StrongPass123!',
            },
            format='json',
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(register_response.data['email'], 'newuser@example.com')

        login_response = self.client.post(
            '/api/v1/token/',
            {'username': 'newuser@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)
        self.assertEqual(login_response.data['user']['email'], 'newuser@example.com')

    def test_demo_user_login_and_case_sensitive_password(self):
        ok_response = self.client.post(
            '/api/v1/token/',
            {'username': 'demo@calmflow.com', 'password': 'Demo12345'},
            format='json',
        )
        self.assertEqual(ok_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', ok_response.data)

        wrong_case_response = self.client.post(
            '/api/v1/token/',
            {'username': 'demo@calmflow.com', 'password': 'demo12345'},
            format='json',
        )
        self.assertEqual(wrong_case_response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileApiTests(BaseApiTestCase):
    def test_profile_requires_authentication(self):
        response = self.client.get('/api/v1/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_and_profile_extended_flow(self):
        self.authenticate(email='profile@example.com', first_name='Profile')

        profile_response = self.client.get('/api/v1/profile/')
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['email'], 'profile@example.com')

        extended_get = self.client.get('/api/v1/profile-extended/')
        self.assertEqual(extended_get.status_code, status.HTTP_200_OK)
        self.assertIn('contato_apoio', extended_get.data)

        extended_put = self.client.put(
            '/api/v1/profile-extended/',
            {
                'nome_contato_apoio': 'Contato Teste',
                'vinculo_contato_apoio': 'Amigo',
                'contato_apoio': '+55 11 99999-9999',
            },
            format='json',
        )
        self.assertEqual(extended_put.status_code, status.HTTP_200_OK)
        self.assertEqual(extended_put.data['nome_contato_apoio'], 'Contato Teste')
        self.assertEqual(extended_put.data['vinculo_contato_apoio'], 'Amigo')
        self.assertEqual(extended_put.data['contato_apoio'], '+55 11 99999-9999')


class CheckInApiTests(BaseApiTestCase):
    def test_create_checkin_and_prevent_duplicate_same_day(self):
        self.authenticate(email='checkin@example.com')

        payload = {
            'clima_interno': 'nublado',
            'nivel_ruido': 6,
            'gatilho': 'trabalho',
            'auto_eficacia': 7,
            'sintomas': 'ansiedade',
            'notas': 'dia corrido',
        }

        first_response = self.client.post('/api/v1/check-ins/', payload, format='json')
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CheckIn.objects.count(), 1)

        second_response = self.client.post('/api/v1/check-ins/', payload, format='json')
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_checkins_list_only_returns_authenticated_user_data(self):
        owner = self.create_user(email='owner@example.com')
        other = self.create_user(email='other@example.com')

        CheckIn.objects.create(
            usuario=owner,
            clima_interno='ensolarado',
            nivel_ruido=2,
            gatilho='trabalho',
            auto_eficacia=8,
        )
        CheckIn.objects.create(
            usuario=other,
            clima_interno='tempestuoso',
            nivel_ruido=9,
            gatilho='familia',
            auto_eficacia=3,
        )

        login_response = self.client.post(
            '/api/v1/token/',
            {'username': 'owner@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get('/api/v1/check-ins/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = self.extract_items(response)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['usuario_nome'], 'owner@example.com')


class HistoryApiTests(BaseApiTestCase):
    def test_history_endpoints_return_user_data_and_sorted_emergencias(self):
        owner = self.create_user(email='history@example.com')
        other = self.create_user(email='otherhistory@example.com')

        owner_checkin = CheckIn.objects.create(
            usuario=owner,
            clima_interno='nublado',
            nivel_ruido=4,
            gatilho='sono',
            auto_eficacia=6,
        )
        CheckIn.objects.create(
            usuario=other,
            clima_interno='tempestuoso',
            nivel_ruido=9,
            gatilho='familia',
            auto_eficacia=2,
        )

        old_event = Emergencia.objects.create(
            usuario=owner,
            sintoma_principal='respiracao',
            ambiente_seguro=True,
            tipo_evento='sessao_respiracao',
            duracao_segundos=60,
        )
        new_event = Emergencia.objects.create(
            usuario=owner,
            sintoma_principal='medo',
            ambiente_seguro=True,
            tipo_evento='alivio_emergencia',
            alivio_percebido=True,
            duracao_segundos=120,
        )
        Emergencia.objects.create(
            usuario=other,
            sintoma_principal='peito',
            ambiente_seguro=True,
            tipo_evento='sessao_respiracao',
            duracao_segundos=45,
        )

        now = timezone.now()
        Emergencia.objects.filter(id=old_event.id).update(criado_em=now - timedelta(hours=3))
        Emergencia.objects.filter(id=new_event.id).update(criado_em=now)

        login_response = self.client.post(
            '/api/v1/token/',
            {'username': 'history@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        checkins_response = self.client.get('/api/v1/check-ins/')
        self.assertEqual(checkins_response.status_code, status.HTTP_200_OK)
        checkins_items = self.extract_items(checkins_response)
        self.assertEqual(len(checkins_items), 1)
        self.assertEqual(checkins_items[0]['id'], owner_checkin.id)

        emergencias_response = self.client.get('/api/v1/emergencias/')
        self.assertEqual(emergencias_response.status_code, status.HTTP_200_OK)
        emergencias_items = self.extract_items(emergencias_response)
        self.assertEqual(len(emergencias_items), 2)
        self.assertEqual(emergencias_items[0]['id'], new_event.id)
        self.assertEqual(emergencias_items[1]['id'], old_event.id)


class PsicologoApiTests(BaseApiTestCase):
    def test_psicologo_register_login_me_flow(self):
        register_response = self.client.post(
            '/api/v1/psi/register/',
            {
                'email': 'psi1@example.com',
                'first_name': 'Psi',
                'password': 'StrongPass123!',
                'password_confirm': 'StrongPass123!',
                'registro_profissional': 'CRP-12345',
                'especialidade': 'TCC',
                'telefone': '+55 11 98888-7777',
            },
            format='json',
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        psicologo_user = User.objects.get(username='psi1@example.com')
        self.assertTrue(psicologo_user.groups.filter(name='Psicologos').exists())

        login_response = self.client.post(
            '/api/v1/psi/login/',
            {'username': 'psi1@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertEqual(login_response.data['psicologo']['registro_profissional'], 'CRP-12345')

        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        me_response = self.client.get('/api/v1/psi/me/')
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data['registro_profissional'], 'CRP-12345')

    def test_patient_cannot_use_psi_flow(self):
        self.create_user(email='patient@example.com')

        login_response = self.client.post(
            '/api/v1/psi/login/',
            {'username': 'patient@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_400_BAD_REQUEST)

        regular_login = self.client.post(
            '/api/v1/token/',
            {'username': 'patient@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        token = regular_login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        me_response = self.client.get('/api/v1/psi/me/')
        self.assertEqual(me_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_automatic_link_by_registro_ordem(self):
        patient = self.create_user(email='paciente1@example.com')
        UserProfile.objects.create(
            usuario=patient,
            nome_psicologo='Dr. Ana',
            telefone_psicologo='+55 11 97777-6666',
            registro_ordem_psicologo='CRP-7777',
        )

        psi_user = self.create_user(email='psi2@example.com')
        psicologos_group, _ = Group.objects.get_or_create(name='Psicologos')
        psi_user.groups.add(psicologos_group)

        psi_profile = PsicologoProfile.objects.create(
            user=psi_user,
            registro_profissional='CRP-7777',
            especialidade='Ansiedade',
        )

        vinculo = VinculoTerapeutico.objects.filter(paciente=patient).first()
        self.assertIsNotNone(vinculo)
        self.assertEqual(vinculo.psicologo_id, psi_profile.id)

        other_psi_user = self.create_user(email='psi3@example.com')
        other_psi_user.groups.add(psicologos_group)
        PsicologoProfile.objects.create(
            user=other_psi_user,
            registro_profissional='CRP-7778',
        )

        self.assertEqual(VinculoTerapeutico.objects.filter(paciente=patient).count(), 1)
