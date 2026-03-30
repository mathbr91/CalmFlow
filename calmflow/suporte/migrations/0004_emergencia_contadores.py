# Generated manually for CalmFlow on 2026-03-12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suporte', '0003_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='emergencia',
            name='alivio_percebido',
            field=models.BooleanField(blank=True, help_text='Resposta do usuário ao final da técnica: sentiu melhora?', null=True),
        ),
        migrations.AddField(
            model_name='emergencia',
            name='duracao_segundos',
            field=models.PositiveIntegerField(default=0, help_text='Duração total da sessão ou exercício em segundos'),
        ),
        migrations.AddField(
            model_name='emergencia',
            name='tecnica_utilizada',
            field=models.CharField(blank=True, help_text='Técnica aplicada durante a sessão (ex: respiração_quadrada)', max_length=50),
        ),
        migrations.AddField(
            model_name='emergencia',
            name='tipo_evento',
            field=models.CharField(choices=[('emergencia', 'Emergência'), ('sessao_respiracao', 'Sessão de Respiração'), ('alivio_emergencia', 'Alívio de Emergência')], default='emergencia', help_text='Classifica se foi uma emergência, sessão de respiração ou alívio após técnica', max_length=30),
        ),
    ]
