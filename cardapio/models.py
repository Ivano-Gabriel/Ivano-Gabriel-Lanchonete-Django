from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"

    def __str__(self):
        return self.nome

# Modelo para os Itens do Cardápio (Lanches, Bebidas, Doces)
class ItemCardapio(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='itens')
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True) # Pode ser vazio
    preco = models.DecimalField(max_digits=5, decimal_places=2) # Ex: 999.99
    imagem = models.ImageField(upload_to='cardapio_imagens/', blank=True, null=True)
    disponivel = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Item do Cardápio"
        verbose_name_plural = "Itens do Cardápio"
        ordering = ['categoria', 'nome'] # Ordenar por categoria e nome

    def __str__(self):
        return f"{self.nome} ({self.categoria.nome})"