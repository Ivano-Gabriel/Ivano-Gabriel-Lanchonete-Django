# cardapio/views.py
from django.shortcuts import render
from .models import Categoria, ItemCardapio 
from django.shortcuts import render

def home_view(request): 
    context = {
        'x_tudo_image_path': 'minha_lanchonete/xtudo.jpg',
        'x_tudo_alt_text': 'O melhor X-Tudo da cidade!',
    }
    return render(request, 'main/home.html', context)
def cardapio_view(request):
    categorias = Categoria.objects.prefetch_related('itens').filter(itens__disponivel=True).distinct()
    return render(request, 'cardapio/cardapio.html', {'categorias': categorias})

def sobre_lanchonete_view(request):
    return render(request, 'main/sobre_lanchonete.html')

def sobre_programador_view(request):
    return render(request, 'main/sobre.html')