# 🍔 Lanchonete Projeto

Bem-vindo ao **Lanchonete Projeto**! Este é um sistema web de cardápio interativo e carrinho de compras, desenvolvido com Django para o backend e uma interface dinâmica construída com HTML, CSS e JavaScript puro (Vanilla JS).

Este projeto é um exemplo prático de como construir uma aplicação web completa, desde a estrutura do banco de dados até as interações de usuário no navegador.

## ✨ Funcionalidades Principais

* **Cardápio Dinâmico:** Exibe categorias e itens de lanches, bebidas, doces e gelados, gerenciados via Django.
* **Seleção de Quantidade:** Botões interativos para adicionar ou remover quantidades de cada item.
* **Carrinho de Compras:** Um carrinho lateral (`Offcanvas` do Bootstrap) onde os usuários podem visualizar e gerenciar os itens selecionados.
* **Persistência do Carrinho:** Os itens do carrinho são salvos no armazenamento local do navegador (`localStorage`), persistindo mesmo após recarregar a página.
* **Simulação de Pagamento:** Um fluxo de pagamento simbólico com opções de Pix (desconto), Cartão (acréscimo) e Dinheiro.
* **Comprovante de Compra:** Modal interativo que exibe os detalhes da compra finalizada.
* **Responsividade:** Design adaptável para funcionar perfeitamente em dispositivos móveis e desktops.
* **Tema Moderno:** Interface com tema preto, dourado e laranja.

## 💻 Tecnologias Utilizadas

* **Backend:**
    * Python
    * Django
    * SQLite (para desenvolvimento e deploy inicial)
    * WhiteNoise (para servir arquivos estáticos em produção)
    * Gunicorn (servidor WSGI para produção)
* **Frontend:**
    * HTML5
    * CSS3 (com customizações para o tema e responsividade)
    * JavaScript (Vanilla JS)
    * Bootstrap 5.3.3 (Framework CSS e JS)
    * Font Awesome (para ícones)
* **Versionamento:** Git & GitHub
* **Deploy (Exemplo):** Render

## 🚀 Como Rodar Localmente

Siga estes passos para configurar e rodar o projeto em sua máquina:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Ivano-Gabriel/Ivano-Gabriel-Lanchonete-Django.git](https://github.com/Ivano-Gabriel/Ivano-Gabriel-Lanchonete-Django.git)
    cd Ivano-Gabriel-Lanchonete-Django
    ```

2.  **Crie e ative o ambiente virtual:**
    ```bash
    python -m venv venv
    # No Windows:
    .\venv\Scripts\activate
    # No macOS/Linux:
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Faça as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```
    * (Opcional) Crie um superusuário para acessar o admin: `python manage.py createsuperuser`

5.  **Coleta de arquivos estáticos (opcional para desenvolvimento, mas recomendado):**
    ```bash
    python manage.py collectstatic --noinput
    ```

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver
    ```

O projeto estará disponível em `http://127.0.0.1:8000/`.

## 🌐 Deploy

Este projeto está configurado para deploy no Render.

## 🤝 Contribuição

Sinta-se à vontade para explorar o código, aprender e sugerir melhorias!

## 🧑‍💻 Autor

Ivano Gabriel / https://www.instagram.com/i.gabriel13_/

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. (Se você não tem um arquivo LICENSE, pode remover esta seção ou criar um).
