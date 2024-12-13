

# Pre-requisitos

- Una máquina con Ubuntu 24.04 o Debian 12 con acceso root.  
- Un nombre de dominio (o subdominio) para el servidor de Fedired, por ejemplo: `example.com`.  
- Un servicio de correo electrónico o servidor SMTP.  

En este ejemplo, utilizaremos `example.com` como el dominio. Recuerda reemplazarlo con tu propio dominio al ejecutar los comandos.

Si no estás trabajando como usuario root, cambia a root utilizando el comando:  
```bash
sudo -i
```

# Repositorios del sistema

Asegúrate de que los siguientes paquetes estén instalados: `curl`, `wget`, `gnupg`, `apt-transport-https`, `lsb-release` y `ca-certificates`:

```bash
apt install -y curl wget gnupg apt-transport-https lsb-release ca-certificates
```

## Node.js

```bash
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
```

## PostgreSQL

```bash
wget -O /usr/share/keyrings/postgresql.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
echo "deb [signed-by=/usr/share/keyrings/postgresql.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/postgresql.list
```

# Paquetes del sistema

Actualiza la lista de paquetes e instala los siguientes:  

```bash
apt update
apt install -y \
  imagemagick ffmpeg libvips-tools libpq-dev libxml2-dev libxslt1-dev file git-core \
  g++ libprotobuf-dev protobuf-compiler pkg-config gcc autoconf \
  bison build-essential libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev \
  nginx nodejs redis-server redis-tools postgresql postgresql-contrib \
  certbot python3-certbot-nginx libidn11-dev libicu-dev libjemalloc-dev
```

## Yarn

Habilita `corepack` para instalar automáticamente la versión correcta de `yarn`:

```bash
corepack enable
```

# Creación del usuario `fedired`

Crea el usuario bajo el cual Fedired se ejecutará:

```bash
adduser --disabled-password fedired
```

# Configuración inicial

## Configuración de PostgreSQL

### Configuración de rendimiento (opcional)

Para un rendimiento óptimo, utiliza [pgTune](https://pgtune.leopard.in.ua/#/) para generar configuraciones adecuadas y edítalas en `/etc/postgresql/17/main/postgresql.conf`. Luego, reinicia PostgreSQL:

```bash
systemctl restart postgresql
```

### Creación de un usuario

Abre el prompt de PostgreSQL:

```bash
sudo -u postgres psql
```

Ejecuta los siguientes comandos:

```sql
CREATE USER fedired CREATEDB;
\q
```

¡Hecho!

## Configuración de Fedired

Cambia al usuario `fedired`:

```bash
su - fedired
```

### Descarga del código

Usa `git` para descargar la última versión estable de Fedired:

```bash
git clone https://github.com/fedired-dev/masto.git live && cd live
git checkout $(git tag -l | grep '^v[0-9.]*$' | sort -V | tail -n 1)
```

### Instalación de Ruby

Instala y configura `rbenv` para gestionar las versiones de Ruby:

```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec bash
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

Instala la versión correcta de Ruby:

```bash
RUBY_CONFIGURE_OPTS=--with-jemalloc rbenv install
```

### Instalación de dependencias

Instala las dependencias de Ruby y JavaScript:

```bash
bundle config deployment 'true'
bundle config without 'development test'
bundle install -j$(getconf _NPROCESSORS_ONLN)
yarn install
```

Ejecuta el asistente interactivo de configuración:

```bash
RAILS_ENV=production bin/rails fedired:setup
```

Esto creará un archivo de configuración `.env.production`, que puedes editar según tus necesidades.

Sal del usuario `fedired` para volver a `root`:

```bash
exit
```

# Certificado SSL con Cloudflare

Para utilizar los certificados SSL proporcionados por Cloudflare, asegúrate de tener configurado el proxy de Cloudflare para tu dominio. Una vez que el tráfico pase por Cloudflare, puedes configurar Nginx para usar los certificados SSL de Cloudflare.

### 1. Obtén los Certificados SSL de Cloudflare

1. Dirígete al **Panel de Control de Cloudflare** y selecciona tu dominio.
2. En el menú "SSL/TLS", accede a la sección de "Edge Certificates".
3. Busca la opción "Origin Certificates" y crea un certificado para tu dominio.
4. Descarga el **certificado** y la **clave privada** proporcionados por Cloudflare.

Estos archivos generalmente tendrán los siguientes nombres:

- `origin-cert.pem` (certificado)
- `origin-key.pem` (clave privada)

### 2. Guarda los Archivos en el Directorio de SSL

Una vez descargados, copia el **certificado** y la **clave privada** a las ubicaciones correspondientes en tu servidor:

```bash
sudo cp /ruta/a/origin-cert.pem /etc/ssl/private/cloudflare-cert.pem
sudo cp /ruta/a/origin-key.pem /etc/ssl/private/cloudflare-key.pem
```

**Nota**: Asegúrate de reemplazar `/ruta/a/` con la ubicación donde descargaste los archivos del certificado.

### 3. Configuración de Nginx con los Certificados de Cloudflare

#### a. Copia la plantilla de configuración de Nginx

```bash
cp /home/fedired/live/dist/nginx.conf /etc/nginx/sites-available/fedired
ln -s /etc/nginx/sites-available/fedired /etc/nginx/sites-enabled/fedired
rm /etc/nginx/sites-enabled/default
```

#### b. Edita la configuración de Nginx

Abre el archivo de configuración de Nginx:

```bash
nano /etc/nginx/sites-available/fedired
```

Busca las directivas `ssl_certificate` y `ssl_certificate_key`, y actualiza las rutas para que apunten a los certificados de Cloudflare:

```plaintext
ssl_certificate     /etc/ssl/private/cloudflare-cert.pem;
ssl_certificate_key /etc/ssl/private/cloudflare-key.pem;
```

Asegúrate de reemplazar `example.com` con tu dominio real, si es necesario.

#### c. Configura permisos para el directorio de Fedired

Permite que otros usuarios accedan al directorio de usuario `fedired`:

```bash
chmod o+x /home/fedired
```

### 4. Reinicia Nginx

Aplica la nueva configuración reiniciando el servicio Nginx:

```bash
systemctl restart nginx
```

---

### Verificación

Abre tu dominio en un navegador y verifica que la conexión sea segura (deberías ver el candado verde en la barra de direcciones). Si no ves el candado, revisa que los archivos de los certificados estén en las ubicaciones correctas y que Nginx esté apuntando a ellos.

---

**Nota**: Cloudflare maneja el SSL en su capa, por lo que no es necesario tener un certificado completo de cadena (como Let's Encrypt) en tu servidor. Solo necesitas los certificados originados por Cloudflare para establecer la conexión segura entre tu servidor y Cloudflare.

# Servicios systemd

Copia los archivos de servicio de systemd:

```bash
cp /home/fedired/live/dist/fedired-*.service /etc/systemd/system/
```

Inicia y habilita los servicios:

```bash
systemctl daemon-reload
systemctl enable --now fedired-web fedired-sidekiq fedired-streaming
```

A partir de este momento, los servicios se iniciarán automáticamente al encender el servidor.

#section}`. Si necesitas algún ajuste, ¡házmelo saber!