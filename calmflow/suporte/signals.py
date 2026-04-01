from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile, PsicologoProfile


@receiver(post_save, sender=User)
def add_user_to_default_group(sender, instance, created, **kwargs):
    """Adiciona novos usuários ao grupo padrão do sistema."""
    if not created:
        return

    group, _ = Group.objects.get_or_create(name='Usuarios_Padrao')
    instance.groups.add(group)


@receiver(post_save, sender=PsicologoProfile)
def sync_patients_when_psychologist_profile_changes(sender, instance, **kwargs):
    """Sincroniza vínculos ao criar/atualizar registro do psicólogo."""
    instance.sincronizar_vinculos_por_registro()


@receiver(post_save, sender=UserProfile)
def sync_patient_link_when_profile_changes(sender, instance, **kwargs):
    """Sincroniza vínculo quando paciente atualiza registro da ordem no perfil."""
    registro = (instance.registro_ordem_psicologo or '').strip()
    if not registro:
        return

    psicologo = PsicologoProfile.objects.filter(registro_profissional__iexact=registro, ativo=True).first()
    if psicologo:
        psicologo.sincronizar_vinculos_por_registro()
