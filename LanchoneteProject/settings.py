# LanchoneteProject/LanchoneteProject/settings.py

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- INÍCIO: NOVAS CONFIGURAÇÕES PARA DEPLOY NO RENDER ---

# 1. SECRET_KEY: Chave secreta do Django (MUITO IMPORTANTE PARA SEGURANÇA!)
# Em produção (no Render), ela virá de uma variável de ambiente do Render.
# 'os.environ.get()' tenta pegar a variável 'SECRET_KEY'. Se não encontrar, usa a que está no código (para sua máquina).
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-7u!4uufy92bi137%y8luup2j&kln4ruv99(o2f_85n)++u^#&o')


# 2. DEBUG: Modo de Depuração (MUITO IMPORTANTE para produção!)
# NO SERVIDOR (Render), SEMPRE DEVE SER 'False' para segurança e performance.
# No seu computador, 'True' é bom para ver erros.
# 'os.environ.get('DJANGO_DEBUG', 'True') == 'True'' permite controlar isso com uma variável de ambiente.
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'


# 3. ALLOWED_HOSTS: Quais domínios podem acessar seu site (segurança!)
# Em produção, você só quer que seu site responda aos domínios corretos (ex: seu_site.onrender.com).
# 'os.environ.get('ALLOWED_HOSTS', '').split(',')' pega os domínios de uma variável de ambiente.
# Por padrão, se a variável estiver vazia, ele será uma lista vazia.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
# Para testar no Render pela primeira vez, você pode querer adicionar '*' (asterisco)
# temporariamente na variável ALLOWED_HOSTS no Render, mas NUNCA faça isso em produção final.
# Um exemplo de como ficaria a variável no Render: .render.com,seu-dominio.com
# Ou, na sua máquina, para testar: ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '.render.com']


# --- FIM: NOVAS CONFIGURAÇÕES PARA DEPLOY NO RENDER ---


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cardapio', # Seu aplicativo de cardápio

    # IMPORTANTE: Adicione o WhiteNoise para servir arquivos estáticos (CSS, JS, imagens) em produção.
    # Coloque-o APÓS 'django.contrib.staticfiles'
    'whitenoise.runserver_nostatic', # Útil para testar static files localmente em modo DEBUG
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # IMPORTANTE: Adicione o WhiteNoise AQUI, logo APÓS SecurityMiddleware.
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'LanchoneteProject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'cardapio' / 'templates' / 'main'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'LanchoneteProject.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
# ATENÇÃO: SQLite (db.sqlite3) funciona no Render para deploy inicial, mas os dados NÃO SÃO PERSISTENTES.
# Isso significa que se o seu site for reiniciado (deploy novo, inatividade), o banco de dados volta ao estado original
# do último deploy. Para dados persistentes (ex: usuários, itens de cardápio cadastrados via admin),
# você precisaria de um banco de dados como PostgreSQL (oferecido pelo Render ou externo).
# Para este projeto simples de apresentação, SQLite pode servir, mas saiba dessa limitação!


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'pt-br' # Mudei para português do Brasil!
TIME_ZONE = 'America/Sao_Paulo' # Mudei para o fuso horário de São Paulo!
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# Quando o DEBUG for False (em produção), o Django NÃO serve os arquivos estáticos.
# O WhiteNoise (que você adicionou) faz isso por você.
STATIC_URL = '/static/'
# IMPORTANTE: O STATIC_ROOT é para onde os arquivos estáticos vão após 'collectstatic'.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') 
# STATICFILES_DIRS aponta para onde o Django deve procurar arquivos estáticos ANTES de coletar.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'cardapio', 'static'), 
]

# Configuração WhiteNoise (para servir arquivos estáticos de forma eficiente em produção)
# IMPORTANTE: Isso diz ao WhiteNoise como armazenar e servir seus arquivos estáticos.
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
