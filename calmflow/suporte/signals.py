from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def add_user_to_default_group(sender, instance, created, **kwargs):
    """Adiciona novos usuários ao grupo padrão do sistema."""
    if not created:
        return

    group, _ = Group.objects.get_or_create(name='Usuarios_Padrao')
    instance.groups.add(group)
