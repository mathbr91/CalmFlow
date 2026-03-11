"""
Configuração do admin para os modelos do CalmFlow.
"""

from django.contrib import admin
from .models import CheckIn, Emergencia, UserProfile


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'get_clima_display', 'nivel_ruido', 'auto_eficacia', 'criado_em')
    list_filter = ('clima_interno', 'gatilho', 'criado_em')
    search_fields = ('usuario__username',)
    readonly_fields = ('criado_em',)
    
    fieldsets = (
        ('Usuário', {
            'fields': ('usuario',)
        }),
        ('Estado Emocional', {
            'fields': ('clima_interno', 'nivel_ruido', 'auto_eficacia')
        }),
        ('Gatilho e Context', {
            'fields': ('gatilho',)
        }),
        ('Metadata', {
            'fields': ('criado_em',),
            'classes': ('collapse',)
        }),
    )
    
    def get_clima_display(self, obj):
        return dict(CheckIn.CLIMA_INTERNO_CHOICES).get(obj.clima_interno, 'Desconhecido')
    get_clima_display.short_description = "Clima Interno"


@admin.register(Emergencia)
class EmergenciaAdmin(admin.ModelAdmin):
    list_display = ('get_usuario_display', 'get_sintoma_display', 'ambiente_seguro', 'criado_em')
    list_filter = ('sintoma_principal', 'ambiente_seguro', 'criado_em')
    search_fields = ('usuario__username',)
    readonly_fields = ('criado_em',)
    
    fieldsets = (
        ('Informações do Usuário', {
            'fields': ('usuario',)
        }),
        ('Sintomas e Segurança', {
            'fields': ('sintoma_principal', 'ambiente_seguro')
        }),
        ('Metadata', {
            'fields': ('criado_em',),
            'classes': ('collapse',)
        }),
    )
    
    def get_usuario_display(self, obj):
        return obj.usuario.username if obj.usuario else 'Anônimo'
    get_usuario_display.short_description = "Usuário"
    
    def get_sintoma_display(self, obj):
        return dict(Emergencia.SINTOMA_PRINCIPAL_CHOICES).get(obj.sintoma_principal, 'Desconhecido')
    get_sintoma_display.short_description = "Sintoma"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'contato_apoio', 'atualizado_em')
    search_fields = ('usuario__username', 'contato_apoio')
    readonly_fields = ('atualizado_em',)
    
    fieldsets = (
        ('Usuário', {
            'fields': ('usuario',)
        }),
        ('Informações de Apoio', {
            'fields': ('contato_apoio',)
        }),
        ('Metadata', {
            'fields': ('atualizado_em',),
            'classes': ('collapse',)
        }),
    )
