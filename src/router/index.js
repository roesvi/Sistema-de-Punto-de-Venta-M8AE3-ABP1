import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '../stores/app.js';

// Layouts
import MainLayout from '../components/layout/MainLayout.vue';

// Auth Views
import Login from '../views/auth/Login.vue';

// Views are loaded lazily for better performance
const PointOfSale = () => import('../views/pos/PointOfSale.vue');
const Inventory = () => import('../views/pos/Inventory.vue');
const Products = () => import('../views/pos/Products.vue');
const Categories = () => import('../views/pos/Categories.vue');
const Sales = () => import('../views/pos/Sales.vue');
const Customers = () => import('../views/pos/Customers.vue');
const Reports = () => import('../views/pos/Reports.vue');
const Users = () => import('../views/pos/Users.vue');
const Settings = () => import('../views/pos/Settings.vue');

// Blog Views
const BiParaPymes = () => import('../views/blog/BiParaPymes.vue');
const EstrategiasOptimizacion = () => import('../views/blog/EstrategiasOptimizacion.vue');
const EvolucionPos = () => import('../views/blog/EvolucionPos.vue');
const GuiaImplementacionPos = () => import('../views/blog/GuiaImplementacionPos.vue');

const routes = [
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Iniciar Sesión | Escorpión POS',
      layout: 'auth',
      public: true
    }
  },
  
  // Blog Routes
  {
    path: '/blog/bi-para-pymes',
    name: 'BiParaPymes',
    component: BiParaPymes,
    meta: {
      title: 'BI para PYMES | Blog',
      description: 'Descubre cómo el Business Intelligence puede transformar tu negocio.'
    }
  },
  {
    path: '/blog/estrategias-optimizacion-inventario',
    name: 'EstrategiasOptimizacion',
    component: EstrategiasOptimizacion,
    meta: {
      title: 'Estrategias de Optimización de Inventario | Blog',
      description: 'Mejora la gestión de tu inventario con estas estrategias probadas.'
    }
  },
  {
    path: '/blog/evolucion-pos-modernos',
    name: 'EvolucionPos',
    component: EvolucionPos,
    meta: {
      title: 'Evolución de los Sistemas POS Modernos | Blog',
      description: 'Conoce la evolución de los sistemas de punto de venta y su impacto en los negocios.'
    }
  },
  {
    path: '/blog/guia-implementacion-pos',
    name: 'GuiaImplementacionPos',
    component: GuiaImplementacionPos,
    meta: {
      title: 'Guía de Implementación de POS | Blog',
      description: 'Todo lo que necesitas saber para implementar un sistema POS exitosamente.'
    }
  },
  
  // Main App Routes
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        redirect: '/pos'
      },
      {
        path: '/pos',
        name: 'PointOfSale',
        component: PointOfSale,
        meta: {
          title: 'Punto de Venta | Escorpión POS',
          icon: 'bi-cash-register'
        }
      },
      {
        path: '/inventory',
        name: 'Inventory',
        component: Inventory,
        meta: {
          title: 'Inventario | Escorpión POS',
          icon: 'bi-box-seam'
        }
      },
      {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
          title: 'Productos | Escorpión POS',
          icon: 'bi-tags'
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: Categories,
        meta: {
          title: 'Categorías | Escorpión POS',
          icon: 'bi-collection'
        }
      },
      {
        path: '/sales',
        name: 'Sales',
        component: Sales,
        meta: {
          title: 'Ventas | Escorpión POS',
          icon: 'bi-receipt'
        }
      },
      {
        path: '/customers',
        name: 'Customers',
        component: Customers,
        meta: {
          title: 'Clientes | Escorpión POS',
          icon: 'bi-people'
        }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports,
        meta: {
          title: 'Reportes | Escorpión POS',
          icon: 'bi-graph-up'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
          title: 'Usuarios | Escorpión POS',
          icon: 'bi-people-fill'
        }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        meta: {
          title: 'Configuración | Escorpión POS',
          icon: 'bi-gear'
        }
      }
    ]
  },
  
  // Redirect old blog URLs to new structure
  {
    path: '/bi-para-pymes',
    redirect: '/blog/bi-para-pymes'
  },
  {
    path: '/estrategias-optimizacion-inventario',
    redirect: '/blog/estrategias-optimizacion-inventario'
  },
  {
    path: '/evolucion-pos-modernos',
    redirect: '/blog/evolucion-pos-modernos'
  },
  {
    path: '/guia-implementacion-pos',
    redirect: '/blog/guia-implementacion-pos'
  },
  // Catch all 404 - must be the last one
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Página no encontrada | Escorpión POS',
      public: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } 
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 100 // Offset for fixed header
      };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  
  // Set page title
  document.title = to.meta.title || 'Escorpión POS';
  
  // If trying to access login page while already authenticated
  if (to.path === '/login' && appStore.isAuthenticated) {
    return next({ path: '/' });
  }
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!appStore.isAuthenticated) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
    
    // Check for admin role if required
    if (to.matched.some(record => record.meta.requiresAdmin) && !appStore.user?.isAdmin) {
      return next({ path: '/unauthorized' });
    }
  }
  
  next();
});

export default router;
