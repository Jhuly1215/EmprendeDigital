# Emprende Digital

Aplicación web que permite realizar encuestas, obtener diagnósticos y mostrar contenido personalizado.  
El proyecto está dividido en **frontend** y **backend**, con una base de datos en **MySQL**.  

---

## 📂 Estructura del proyecto

```
EMPRENDE-DIGITAL
│── backend/ # Servidor Node.js con Express
│ ├── sql/ # Scripts SQL (schema y seeds)
│ ├── src/ # Código fuente principal
│ │ ├── db/ # Conexión y configuración BD
│ │ ├── middlewares/ # Middlewares
│ │ ├── routes/ # Rutas de la API (auth, survey, responses, etc.)
│ │ └── services/ # Lógica de negocio
│ ├── app.js # Configuración de la app Express
│ ├── server.js # Punto de entrada del servidor
│ ├── swagger.js # Configuración de Swagger
│ └── package.json
│
│── frontend/public/ # Frontend (HTML, CSS, JS)
│ ├── assets/ # Recursos (css, img)
│ ├── js/ # Lógica en JavaScript
│ ├── index.html # Página principal
│ ├── encuesta.html # Encuesta
│ ├── resultados.html # Resultados
│ └── ...
│
└── .gitignore
```

---

## ⚙️ Tecnologías

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Base de datos:** MySQL  
- **Autenticación:** JWT (JSON Web Token)  
- **Documentación de API:** Swagger  

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone <url-del-repo>
cd EMPRENDE-DIGITAL
```
---
### 2️⃣ Configuración del Backend

Ir a la carpeta backend:
```bash
cd backend
npm install
```
Crear un archivo .env con la configuración de la base de datos y JWT:
```
PORT=8000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=emprende_digital

# JWT Configuration
JWT_SECRET=clave_secreta_para_jwt
JWT_EXPIRES_IN=7d
```
Ejecutar migraciones y seeds desde los archivos en /sql para crear la base de datos.
Levantar el servidor:
```bash
npm run dev
```

El backend quedará disponible en: `http://localhost:8000`

---

### 3️⃣ Configuración del Frontend

Ir a la carpeta frontend/public:

```bash
cd ../frontend/public
npx serve .
```

El frontend quedará disponible en: http://localhost:3000


(puerto asignado por serve).

## 📌 Endpoints principales

- `POST /api/auth/login` → Login de usuarios  
- `POST /api/auth/register` → Registro de usuarios  
- `GET /api/survey` → Obtener encuestas  
- `POST /api/responses` → Guardar respuestas  
- `GET /api/diagnosis` → Obtener diagnóstico  
- `GET /api/content` → Obtener contenido recomendado  

👉 Para más detalles ver [Swagger UI](http://localhost:8000/api/docs).

---

## 📊 Base de datos

Los scripts SQL para crear y poblar la base están en la carpeta `/backend/sql`:

1. `001_schema.sql` → Creación de tablas  
2. `002_seed_survey.sql` → Encuestas  
3. `003_seed_catalog.sql` → Catálogo inicial  
4. `004_seed_rules.sql` → Reglas de negocio  
5. `005_auth.sql` → Usuarios  
6. `statistics.sql` → Estadísticas  

---

## 🛠 Scripts útiles

Backend:
```bash
npm run dev     # Correr en modo desarrollo
npm start       # Producción
```
Frontend:
```bash
npx serve .     # Correr frontend
```
