Aquí tienes un procedimiento para actualizar tu instalación de Fedired cuando haya nuevas versiones disponibles:

---

# Actualización de Fedired

A continuación, te explico cómo mantener tu instancia de Fedired actualizada a la última versión. Este proceso debe ejecutarse como usuario `root` y el usuario `fedired` en algunos pasos específicos.

## Pre-requisitos antes de la actualización

1. Asegúrate de realizar una **copia de seguridad completa** de los datos:
   - **Base de datos PostgreSQL**
   - **Archivos subidos (carpeta `public/system`)**
   - **Archivo de configuración `.env.production`**

2. Verifica que tu sistema operativo y dependencias estén actualizados:

   ```bash
   apt update && apt upgrade -y
   ```

---

## Procedimiento de actualización

### 1. Cambiar al usuario `fedired`

```bash
su - fedired
cd ~/live
```

### 2. Descargar la última versión de Fedired

```bash
git fetch --all
git checkout $(git tag -l | grep '^v[0-9.]*$' | sort -V | tail -n 1)
```

Este comando asegura que se descargue la última versión disponible de Fedired.

---

### 3. Actualizar dependencias

#### a. Actualizar dependencias de Ruby

```bash
bundle install
```

#### b. Actualizar dependencias de JavaScript

```bash
yarn install
```

---

### 4. Migrar la base de datos

Ejecuta las migraciones necesarias para la nueva versión:

```bash
RAILS_ENV=production bundle exec rails db:migrate
```

---

### 5. Precompilar activos

Genera los nuevos archivos estáticos para la interfaz:

```bash
RAILS_ENV=production bundle exec rails assets:precompile
```

---

### 6. Reiniciar los servicios

Sal del usuario `fedired` para volver a `root`:

```bash
exit
```

Reinicia todos los servicios relacionados con Fedired:

```bash
systemctl restart fedired-web fedired-sidekiq fedired-streaming
```

---

## Verificar la actualización

1. Abre tu dominio en un navegador y confirma que todo funcione correctamente.  
2. Revisa los logs de los servicios para asegurarte de que no haya errores:

   ```bash
   journalctl -u fedired-web -f
   journalctl -u fedired-sidekiq -f
   journalctl -u fedired-streaming -f
   ```

---

**Nota:** Siempre revisa las notas de la nueva versión en el repositorio de Fedired para detectar cambios específicos que puedan requerir pasos adicionales.

¡Con estos pasos, tu instancia estará actualizada y lista para seguir funcionando sin problemas! Si necesitas ayuda con alguna parte del proceso, no dudes en pedírmelo.