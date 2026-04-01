"""
URL routing para a app suporte do CalmFlow.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CheckInViewSet, EmergenciaViewSet, sos_endpoint
from .views_auth import (
    RegisterView,
    CustomTokenObtainPairView,
    profile_view,
    UserProfileView,
    PsicologoRegisterView,
    PsicologoTokenObtainPairView,
    PsicologoMeView,
)

# Registrar os viewsets na router padrão do DRF
router = DefaultRouter()
router.register(r'check-ins', CheckInViewSet, basename='check-in')
router.register(r'emergencias', EmergenciaViewSet, basename='emergencia')

urlpatterns = [
    path('', include(router.urls)),
    
    # 🔐 Autenticação e Registro
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('psi/register/', PsicologoRegisterView.as_view(), name='psi_register'),
    path('psi/login/', PsicologoTokenObtainPairView.as_view(), name='psi_login'),
    path('psi/me/', PsicologoMeView.as_view(), name='psi_me'),
    path('profile/', profile_view, name='profile'),
    path('profile-extended/', UserProfileView.as_view(), name='profile_extended'),
    
    # 🚨 Emergência e SOS
    path('sos/', sos_endpoint, name='sos'),
]
