# TFG 
Basado en: https://github.com/ucrem/docker-laravel-angular (plantilla pública)

Este proyecto utiliza Docker para proporcionar un entorno de desarrollo completo sin necesidad de instalar manualmente dependencias como PHP, Node o MySQL en el sistema local.

---

## Descripción del entorno

Este stack incluye varios contenedores Docker, cada uno con una función específica:

### Backend (Laravel)

Contenedor configurado con:

* Laravel 11
* PHP 8.3
* Supervisor ejecutando el proceso `php artisan queue:work` para gestionar colas
* Xdebug 3 para depuración

Este contenedor alberga la lógica de negocio y la API del proyecto.

---

### Frontend (Angular)

* Basado en la imagen oficial de Node 20
* Incluye Angular CLI 18

Este contenedor ejecuta la aplicación frontend desarrollada en Angular.

---

### Base de datos (MySQL)

* Basado en la imagen oficial `mysql:latest`

Se encarga del almacenamiento de datos de la aplicación.

---

### phpMyAdmin

* Basado en la imagen oficial `phpmyadmin/phpmyadmin`
* Conectado al contenedor MySQL

Permite la gestión de la base de datos a través de una interfaz web.

---

### Servidor web (Nginx)

* Basado en la imagen `nginx:alpine`

Se encarga de servir la aplicación backend Laravel.

---

## Inicialización del entorno

### Configuración de Supervisor

El archivo:

/docker/backend/supervisor/supervisord.conf

está vinculado directamente al contenedor backend. Cualquier modificación realizada en este archivo se refleja automáticamente en el contenedor.

---

## Primera instalación

### Configuración del entorno
    1. Abre Microsoft Store desde Windows, busca: Ubuntu 22.04 LTS  Pulsa Instalar y espera a que termine la descarga.
    2. Abrir Ubuntu desde el menú Inicio (MUY IMPORTANTE: no abras Ubuntu desde PowerShell)
    3. Crear usuario Linux, la primera vez aparecerá: " Please create a default UNIX user account: "
        Introduce:
        - usuario Linux (ejemplo: pepe)
        - contraseña Linux
    4. Verificar que Ubuntu funciona, dentro de Ubuntu ejecuta:
```bash
whoami
pwd
```
        Debe mostrar algo parecido a:
        pepe
        /home/pepe
    5. Verificar la carpeta home, ejecuta:
```bash
ls /home
```
        Debe aparecer:
        pepe
    6. Crear carpeta de proyectos, dentro de Ubuntu:
```bash
mkdir -p ~/projects
cd ~/projects
```
    7. Clonar el proyecto, ejecuta:
```bash
git clone URL_DEL_REPO
```
    8. Descarga e instala Docker Desktop para Windows. Abre Docker Desktop y espera a que termine de iniciar.
    9. Activar integración WSL, en Docker Desktop ve a:
        Settings → Resources → WSL Integration
        Activa:
        - Enable integration with my default WSL distro
        - Ubuntu
        Luego pulsa:
        Apply & Restart
    10. Verificar Docker desde Ubuntu, dentro de Ubuntu ejecuta:
```bash
    docker ps
```
    11. Ejecutar el proyecto desde Linux, siempre trabaja desde:
        ~/projects/tu-proyecto
        NO uses:
        /mnt/c/Users/...
    12. Abrir el proyecto en VS Code, instalar la extensión WSL en VS Code y luego dentro de la cmd de ubuntu, en la caarpeta del projects ejecuta:
```bash
code .
```
---

### 1. Configuración inicial del proyecto

Copiar el archivo de entorno dentro de la carpeta principal del proyecto:

```bash
cp .env.example .env
```

En este archivo se configuran parámetros como el nombre del proyecto y las credenciales de la base de datos.

---

### 2. Construcción de contenedores

```bash
docker-compose build
```

Este comando descarga las imágenes necesarias y construye los contenedores.

---

### 3. Inicio de los contenedores

```bash
docker-compose up -d
```

Levanta todos los servicios en segundo plano.

---

## Acceso al contenedor backend

Para acceder al contenedor backend:

```bash
docker exec -it marketplace_backend /bin/bash
```

El nombre del contenedor puede variar. Para comprobarlo:

```bash
docker ps
```

---

## Configuración dentro del backend

Una vez dentro del contenedor, se trabajará en el directorio:

```
/var/www/backend
```

### Configuración de entorno de Laravel

Copiar el archivo de entorno:

```bash
cp .env.example .env
```

Modificar únicamente:

* Nombre de la base de datos
* Usuario
* Contraseña

Estos valores deben coincidir con los definidos en el archivo `.env` de Docker.

---

### Instalación de dependencias

```bash
composer install
```

Este comando instala todas las dependencias necesarias del proyecto Laravel.

---
### Cragar migraciones y seeders

```bash
php artisan storage:link
php artisan migrate:fresh --seed
```

### Ejecución del backend

El servidor Nginx ya está configurado para servir la aplicación desde la carpeta `public` de Laravel.

---

## Funcionamiento del frontend

El puerto 4200 está expuesto, lo que permite:

* Editar el código Angular en local
* Sincronización automática con el contenedor
* Recarga automática mediante Angular CLI

---

## Acceso a los servicios

Una vez iniciado el entorno, los servicios estarán disponibles en:

* Backend (Laravel): http://localhost:8000
* Frontend (Angular): http://localhost:4200
* phpMyAdmin: http://localhost:7000

