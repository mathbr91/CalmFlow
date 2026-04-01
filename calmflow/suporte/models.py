"""
Modelos para o sistema de suporte emocional CalmFlow.

Modelos Principais:
- CheckIn: Prevenção - Monitoramento diário de bem-estar
- Emergencia: Ação Rápida - Logs rápidos de crise
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class CheckIn(models.Model):
    """
    Modelo de PREVENÇÃO: Monitoramento contínuo do estado emocional.
    Permite rastrear padrões e gatilhos emocionais diariamente.
    """
    
    CLIMA_INTERNO_CHOICES = [
        ('ensolarado', 'Ensolarado ☀️'),
        ('nublado', 'Nublado ☁️'),
        ('tempestuoso', 'Tempestuoso ⛈️'),
        ('neblina', 'Neblina 🌫️'),
    ]
    
    GATILHO_CHOICES = [
        ('trabalho', 'Trabalho'),
        ('familia', 'Família'),
        ('telas', 'Telas/Redes Sociais'),
        ('sono', 'Falta de Sono'),
        ('saude', 'Saúde Física'),
        ('relacionamento', 'Relacionamento'),
        ('financeiro', 'Financeiro'),
        ('desconhecido', 'Desconhecido'),
        ('outro', 'Outro'),
    ]
    
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='check_ins'
    )
    
    clima_interno = models.CharField(
        max_length=20,
        choices=CLIMA_INTERNO_CHOICES,
        help_text='Como está seu estado emocional interno?'
    )
    
    nivel_ruido = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text='Nível de "ruído mental" (1=silencioso, 10=caótico)'
    )
    
    gatilho = models.CharField(
        max_length=50,
        choices=GATILHO_CHOICES,
        help_text='Qual foi o gatilho principal do seu estado?'
    )
    
    auto_eficacia = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        help_text='Nível de confiança em lidar com as emoções (0-10)'
    )
    
    sintomas = models.TextField(
        blank=True,
        help_text='Descreva os sintomas físicos ou emocionais que está sentindo'
    )
    
    notas = models.TextField(
        blank=True,
        help_text='Notas adicionais ou observações sobre o seu estado'
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Check-in de Prevenção'
        verbose_name_plural = 'Check-ins de Prevenção'
        indexes = [
            models.Index(fields=['usuario', '-criado_em']),
            models.Index(fields=['clima_interno']),
            models.Index(fields=['gatilho']),
        ]
    
    def __str__(self):
        clima_display = dict(self.CLIMA_INTERNO_CHOICES).get(self.clima_interno, 'Desconhecido')
        return f'CheckIn {clima_display} - {self.usuario.username} em {self.criado_em.strftime("%d/%m/%Y %H:%M")}'


class Emergencia(models.Model):
    """
    Modelo de AÇÃO RÁPIDA: Registro imediato de crises emocionais.
    Permite logging rápido em momentos de emergência emocional.
    Pode ser usado anonimamente (usuario=null) para casos urgentes.
    """
    
    SINTOMA_PRINCIPAL_CHOICES = [
        ('peito', 'Aperto no Peito 🫀'),
        ('respiracao', 'Dificuldade de Respirar 😤'),
        ('confusao', 'Confusão Mental 🌀'),
        ('medo', 'Medo Intenso 😨'),
        ('outro', 'Outro'),
    ]

    TIPO_EVENTO_CHOICES = [
        ('emergencia', 'Emergência'),
        ('sessao_respiracao', 'Sessão de Respiração'),
        ('alivio_emergencia', 'Alívio de Emergência'),
    ]
    
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='emergencias',
        null=True,
        blank=True,
        help_text='Deixe vazio para registro anônimo'
    )
    
    sintoma_principal = models.CharField(
        max_length=50,
        choices=SINTOMA_PRINCIPAL_CHOICES,
        help_text='Qual é seu sintoma principal neste momento?'
    )

    tipo_evento = models.CharField(
        max_length=30,
        choices=TIPO_EVENTO_CHOICES,
        default='emergencia',
        help_text='Classifica se foi uma emergência, sessão de respiração ou alívio após técnica'
    )
    
    ambiente_seguro = models.BooleanField(
        default=True,
        help_text='Você está em um ambiente seguro no momento?'
    )

    tecnica_utilizada = models.CharField(
        max_length=50,
        blank=True,
        help_text='Técnica aplicada durante a sessão (ex: respiração_quadrada)'
    )

    alivio_percebido = models.BooleanField(
        null=True,
        blank=True,
        help_text='Resposta do usuário ao final da técnica: sentiu melhora?'
    )

    duracao_segundos = models.PositiveIntegerField(
        default=0,
        help_text='Duração total da sessão ou exercício em segundos'
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Emergência Emocional'
        verbose_name_plural = 'Emergências Emocionais'
        indexes = [
            models.Index(fields=['usuario', '-criado_em']),
            models.Index(fields=['sintoma_principal']),
            models.Index(fields=['ambiente_seguro']),
        ]
    
    def __str__(self):
        usuario_str = self.usuario.username if self.usuario else 'Anônimo'
        sintoma_display = dict(self.SINTOMA_PRINCIPAL_CHOICES).get(self.sintoma_principal, 'Desconhecido')
        return f'Emergência {sintoma_display} - {usuario_str} em {self.criado_em.strftime("%d/%m/%Y %H:%M")}'


class UserProfile(models.Model):
    """
    Perfil estendido do usuário.
    Armazena informações adicionais como contato de apoio para crises.
    """
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    contato_apoio = models.CharField(
        max_length=20,
        blank=True,
        help_text='Número de telefone para contato em caso de crise (ex: +5511999999999)'
    )

    nome_contato_apoio = models.CharField(
        max_length=120,
        blank=True,
        help_text='Nome da pessoa que deve ser acionada em caso de crise'
    )

    vinculo_contato_apoio = models.CharField(
        max_length=80,
        blank=True,
        help_text='Vínculo com a pessoa de apoio (ex: Mãe, Amigo, Cônjuge)'
    )

    nome_psicologo = models.CharField(
        max_length=120,
        blank=True,
        help_text='Nome do psicólogo informado pelo paciente'
    )

    telefone_psicologo = models.CharField(
        max_length=20,
        blank=True,
        help_text='Telefone do psicólogo informado pelo paciente'
    )

    registro_ordem_psicologo = models.CharField(
        max_length=40,
        blank=True,
        db_index=True,
        help_text='Registro profissional do psicólogo (ordem) informado pelo paciente'
    )
    
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Perfil do Usuário'
        verbose_name_plural = 'Perfis do Usuário'
    
    def __str__(self):
        return f'Perfil - {self.usuario.username}'


class PsicologoProfile(models.Model):
    """Perfil do psicólogo com registro profissional único."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='psicologo_profile'
    )
    registro_profissional = models.CharField(max_length=40, unique=True, db_index=True)
    especialidade = models.CharField(max_length=120, blank=True)
    telefone = models.CharField(max_length=20, blank=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de Psicólogo'
        verbose_name_plural = 'Perfis de Psicólogo'

    def __str__(self):
        return f'Psicólogo - {self.user.username} ({self.registro_profissional})'

    def sincronizar_vinculos_por_registro(self):
        """Vincula automaticamente pacientes com mesmo registro da ordem."""
        registro = (self.registro_profissional or '').strip()
        if not registro:
            return 0

        pacientes = UserProfile.objects.filter(registro_ordem_psicologo__iexact=registro).select_related('usuario')
        total = 0
        for perfil_paciente in pacientes:
            if perfil_paciente.usuario_id == self.user_id:
                continue
            VinculoTerapeutico.objects.update_or_create(
                paciente=perfil_paciente.usuario,
                defaults={
                    'psicologo': self,
                    'status': 'ativo',
                }
            )
            total += 1
        return total


class VinculoTerapeutico(models.Model):
    """Vínculo 1:1 entre paciente e psicólogo."""

    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
    ]

    psicologo = models.ForeignKey(
        PsicologoProfile,
        on_delete=models.CASCADE,
        related_name='vinculos'
    )
    paciente = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='vinculo_terapeutico'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Vínculo Terapêutico'
        verbose_name_plural = 'Vínculos Terapêuticos'
        indexes = [
            models.Index(fields=['psicologo', 'status']),
        ]

    def __str__(self):
        return f'{self.paciente.username} -> {self.psicologo.user.username} ({self.status})'


class NotaClinica(models.Model):
    """Notas privadas do psicólogo para acompanhamento clínico."""

    psicologo = models.ForeignKey(
        PsicologoProfile,
        on_delete=models.CASCADE,
        related_name='notas_clinicas'
    )
    paciente = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notas_clinicas'
    )
    conteudo = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Nota Clínica'
        verbose_name_plural = 'Notas Clínicas'
        indexes = [
            models.Index(fields=['psicologo', 'paciente', '-criado_em']),
        ]

    def __str__(self):
        return f'Nota de {self.psicologo.user.username} para {self.paciente.username}'

