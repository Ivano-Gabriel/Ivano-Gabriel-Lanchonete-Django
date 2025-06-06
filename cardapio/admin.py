
from django.contrib import admin
from .models import Categoria, ItemCardapio

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome',) 

@admin.register(ItemCardapio)
class ItemCardapioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'preco', 'disponivel') 
    list_filter = ('disponivel', 'categoria') 
    search_fields = ('nome', 'descricao') 