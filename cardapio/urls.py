# cardapio/urls.py

from django.urls import path
from . import views

app_name = 'cardapio' 

urlpatterns = [
    path('', views.home_view, name='home'),
    path('cardapio/', views.cardapio_view, name='cardapio_view'),
    path('sobre-lanchonete/', views.sobre_lanchonete_view, name='sobre_lanchonete'),
    path('sobre-mim/', views.sobre_programador_view, name='sobre_mim'),
]