# 🛍️ Sistema de Punto de Venta (POS) Moderno

## 📋 Descripción del Proyecto

Un sistema de Punto de Venta (POS) moderno y eficiente diseñado para pequeñas y medianas empresas. Esta aplicación permite gestionar ventas, controlar inventario y analizar el rendimiento del negocio en tiempo real.

### Características Principales

- **Gestión de Ventas**: Procesamiento rápido de transacciones con múltiples métodos de pago.
- **Control de Inventario**: Seguimiento en tiempo real del stock de productos.
- **Autenticación de Usuarios**: Sistema seguro de roles y permisos.
- **Panel de Análisis**: Métricas clave y reportes de ventas.
- **Interfaz Intuitiva**: Diseño moderno y responsivo para una experiencia de usuario óptima.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework progresivo de JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **Vue Router** - Enrutamiento de la aplicación
- **Pinia** - Gestión de estado
- **Bootstrap 5** - Estilos y componentes UI
- **Axios** - Cliente HTTP

### Herramientas de Desarrollo
- **ESLint** - Análisis de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones

## 🖼️ Capturas de Pantalla

### Inicio de Sesión
![Inicio de Sesión](/src/assets/img/inicio-sesion.png)

### Panel de Control
![Panel de Control](/src/assets/img/reporte-ventas.png)

### Gestión de Productos
![Productos](/src/assets/img/gestion_productos.png)

### Proceso de Venta
![Ventas](/src/assets/img/proceso_venta.png)

## 🛠️ Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/roesvi/sistema-pos-vue.git
   cd sistema-pos-vue
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_TITLE=Sistema POS
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   # o
   yarn build
   ```

## 🚀 Uso

1. **Iniciar Sesión**
   - Accede al sistema con tus credenciales de administrador o cajero.

2. **Realizar una Venta**
   - Navega a la sección de 'Nueva Venta'.
   - Escanea o busca productos por código o nombre.
   - Selecciona cantidades y aplica descuentos si es necesario.
   - Procesa el pago y genera el ticket.

3. **Gestionar Inventario**
   - En la sección 'Productos' puedes:
     - Agregar nuevos productos
     - Actualizar existentes
     - Controlar niveles de stock
     - Categorizar productos

4. **Generar Reportes**
   - Visualiza métricas clave en el dashboard.
   - Exporta reportes de ventas por período.
   - Analiza el rendimiento del negocio.




# **Producto Tecnológico: Escorpión POS - Sistema de Punto de Venta Inteligente con BI**

---

## **1. Descripción de la Problemática y Solución Implementada**

### **Problemática Abordada**
- **Contexto**: Pymes y retail enfrentan inefficiencias en gestión de ventas e inventarios
- **Problemas específicos**:
  - Descontrol en niveles de inventario (excesos o faltantes)
  - Falta de visibilidad en rendimiento de ventas en tiempo real
  - Procesos manuales propensos a errores
  - Toma de decisiones sin datos objetivos
  - Dificultad para identificar tendencias y patrones de compra

### **Solución Implementada**
**Escorpión POS**: Plataforma integral que combina:
- Sistema de punto de venta online/offline
- Gestión inteligente de inventarios con predicción
- Dashboard de Business Intelligence en tiempo real
- Análisis predictivo para compras y promociones
- Multi-dispositivo y multi-usuario

---
## **6. Documentación del Producto Final**

### **Tecnologías Empleadas**
```yaml
Frontend:
  Framework: Vue 3 + Composition API
  Estado: Pinia
  UI: Quasar Framework
  Gráficos: Apache ECharts
  Offline: Workbox + IndexedDB

Backend:
  Framework: NodeJS
  Base de datos: MySQL
  Cache: Redis 7
  Tareas async: Celery + Redis
  BI: Apache Superset
  ORM: SQLAlchemy 2.0 + async

Infraestructura:
   Base de datos: MySQL
  Cache: AWS ElastiCache
  CI/CD: GitLab CI/CD
  Monitoreo: Prometheus + Grafana
```

### **Instrucciones de Uso**

#### **Para Administradores**
1. **Configuración Inicial**
   ```
   Usuario: demo@ejemplo.com
   Contraseña: demo
   ```

2. **Gestión de Productos**
   - Importar productos masivamente via CSV/Excel
   - Configurar categorías y subcategorías
   - Establecer reglas de reabastecimiento automático
   - Gestionar precios y promociones

3. **Dashboard BI**
   - Métricas en tiempo real: ventas, inventario, rendimiento
   - Alertas automáticas: stock bajo, productos lentos
   - Reportes predictivos: tendencias, estacionalidad
   - KPI personalizables

#### **Para Cajeros/Vendedores**
1. **Interfaz POS**
   - Búsqueda rápida de productos por código, nombre o categoría
   - Múltiples métodos de pago: efectivo, tarjeta, transferencia
   - Gestión de clientes e historial de compras
   - Devoluciones y ajustes

2. **Funciones Avanzadas**
   - Aplicar descuentos por producto o ticket
   - Venta rápida con productos frecuentes
   - Modo offline con sincronización automática
   - Cierre de caja con arqueo automatizado

#### **Para Gerentes**
1. **Supervisión**
   - Monitoreo en tiempo real de múltiples locales
   - Rendimiento por vendedor/tiempo
   - Optimización de horarios y personal

2. **Toma de Decisiones**
   - Reportes de rentabilidad por producto/categoría
   - Análisis de margen y rotación
   - Predicción de demanda
   - Optimización de precios

### **Configuración del Entorno de Desarrollo**
```bash
# 1. Clonar repositorio
git clone https://github.com/roesvi/pos-system.git

# 2. Backend con Docker
cd backend
docker-compose up -d postgres redis
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# 3. Frontend
cd ../frontend
npm install
quasar dev

# 4. Acceder
# Frontend: http://localhost:9000
# API: http://localhost:8000
# BI Dashboard: http://localhost:8088
```

---
### **Alertas Inteligentes**
- Reabastecimiento automático basado en tendencias
- Detección de anomalías en ventas
- Alertas de productos con bajo rendimiento
- Sugerencias de precios óptimos

---
**Estado del Proyecto**: 🚧 En desarrollo  
**Versión Actual**: 1.0.0-beta  
**Última Actualización**: 16 de Noviembre de 2025  
**Equipo**: Equipo de Desarrollo  
