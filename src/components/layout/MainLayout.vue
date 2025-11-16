<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Top Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container-fluid">
        <button class="btn btn-link text-white" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>
        <div class="d-flex align-items-center">
          <div class="text-white me-3 d-none d-md-block">
            <i class="bi bi-calendar3 me-1"></i>
            {{ currentDate }}
          </div>
          <div class="position-relative me-3">
            <button ref="notificationButton" class="btn btn-link text-white position-relative" @click="toggleNotifications">
              <i class="bi bi-bell fs-5"></i>
              <span v-if="unreadNotifications > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ unreadNotifications }}
              </span>
            </button>
            <div v-if="showNotifications" ref="notificationDropdown" class="notifications-dropdown">
              <div class="notification-header">
                <h6>Notificaciones</h6>
                <small>{{ unreadNotifications }} sin leer</small>
              </div>
              <div class="notification-list">
                <div v-for="notification in notifications" :key="notification.id" 
                     class="notification-item" :class="{ 'unread': !notification.read }">
                  <div class="notification-icon">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <p class="mb-0">{{ notification.message }}</p>
                    <small class="text-muted">{{ formatTime(notification.time) }}</small>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="text-center py-3">
                  <p class="text-muted mb-0">No hay notificaciones</p>
                </div>
              </div>
            </div>
          </div>
          <div class="dropdown" @click.stop>
            <button ref="userDropdownButton" class="btn btn-link text-white dropdown-toggle d-flex align-items-center" 
                    type="button" 
                    @click="toggleUserDropdown"
                    :aria-expanded="isUserDropdownOpen">
              <div class="user-avatar me-2">
                <i class="bi bi-person-circle fs-4"></i>
              </div>
              <span class="d-none d-md-inline">{{ user.name }}</span>
            </button>
            <div v-if="isUserDropdownOpen" ref="userDropdownMenu" class="dropdown-menu dropdown-menu-end show" style="display: block;">
              <ul>
                <li><a class="dropdown-item" href="#" @click.prevent="navigateToProfile"><i class="bi bi-person me-2"></i>Perfil</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="navigateToSettings"><i class="bi bi-gear me-2"></i>Configuración</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-container" style="padding-top: 56px;">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h5 class="mb-0">Menú Principal</h5>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item" v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" class="nav-link" :class="{ active: $route.path === item.path }">
              <i :class="item.icon"></i>
              <span class="ms-2">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </aside>

      <!-- Main Content Area -->
      <main class="content" style="padding: 1rem;">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores';

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter();
    const appStore = useAppStore();
    
    // Refs for dropdown elements
    const notificationButton = ref(null);
    const notificationDropdown = ref(null);
    const userDropdownButton = ref(null);
    const userDropdownMenu = ref(null);
    
    // State
    const showNotifications = ref(false);
    const isSidebarCollapsed = ref(false);
    const isUserDropdownOpen = ref(false);
    const currentDate = ref('');
    const user = ref({
      name: 'Administrador',
      role: 'admin'
    });
    
    // Update current date
    const updateCurrentDate = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      currentDate.value = now.toLocaleDateString('es-ES', options);
    };
    
    // Initialize date and update it every minute
    onMounted(() => {
      updateCurrentDate();
      // Update date every minute to keep it current
      const dateInterval = setInterval(updateCurrentDate, 60000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(dateInterval);
    });

    const menuItems = [
      { path: '/pos', title: 'Punto de Venta', icon: 'bi bi-cash-register' },
      { path: '/inventory', title: 'Inventario', icon: 'bi bi-box-seam' },
      { path: '/products', title: 'Productos', icon: 'bi bi-tags' },
      { path: '/categories', title: 'Categorías', icon: 'bi bi-collection' },
      { path: '/sales', title: 'Ventas', icon: 'bi bi-receipt' },
      { path: '/customers', title: 'Clientes', icon: 'bi bi-people' },
      { path: '/reports', title: 'Reportes', icon: 'bi bi-graph-up' },
      { path: '/users', title: 'Usuarios', icon: 'bi bi-person-badge' },
      { path: '/settings', title: 'Configuración', icon: 'bi bi-gear' }
    ];

    const notifications = ref([
      { id: 1, type: 'sale', message: 'Nueva venta realizada', time: new Date(), read: false },
      { id: 2, type: 'inventory', message: 'Producto con stock bajo', time: new Date(Date.now() - 3600000), read: true },
      { id: 3, type: 'system', message: 'Actualización del sistema disponible', time: new Date(Date.now() - 86400000), read: true }
    ]);

    const unreadNotifications = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
      appStore.toggleSidebar();
    };

    const toggleUserDropdown = (event) => {
      isUserDropdownOpen.value = !isUserDropdownOpen.value;
      event.stopPropagation();
    };

    const closeUserDropdown = () => {
      isUserDropdownOpen.value = false;
    };

    const navigateToProfile = () => {
      closeUserDropdown();
      router.push('/profile');
    };

    const navigateToSettings = () => {
      closeUserDropdown();
      router.push('/settings');
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      // Mark notifications as read when opening
      if (showNotifications.value) {
        notifications.value = notifications.value.map(n => ({ ...n, read: true }));
      }
    };

    const getNotificationIcon = (type) => {
      const icons = {
        sale: 'bi bi-cash-coin text-success',
        inventory: 'bi bi-exclamation-triangle text-warning',
        system: 'bi bi-gear text-primary'
      };
      return icons[type] || 'bi bi-bell';
    };

    const formatTime = (date) => {
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `Hace ${diffInMinutes} min`;
      } else if (diffInHours < 24) {
        return `Hace ${diffInHours} h`;
      } else {
        return date.toLocaleDateString();
      }
    };

    const logout = async () => {
      try {
        // Clear user session from store
        if (appStore.logout) {
          appStore.logout();
        }
        
        // Clear any stored tokens or user data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Get current path for redirect after login
        const currentPath = router.currentRoute.value.fullPath;
        
        // Redirect to login page with current path as redirect parameter
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } catch (error) {
        console.error('Error during logout:', error);
        // Fallback to basic login path if there's an error
        router.push('/login');
      }
    };

    // Close notifications and dropdowns when clicking outside
    const handleClickOutside = (event) => {
      // Close notifications dropdown
      if (notificationDropdown.value && notificationButton.value) {
        if (!notificationDropdown.value.contains(event.target) && 
            !notificationButton.value.contains(event.target)) {
          showNotifications.value = false;
        }
      }
      
      // Close user dropdown
      if (userDropdownMenu.value && userDropdownButton.value) {
        if (!userDropdownMenu.value.contains(event.target) && 
            !userDropdownButton.value.contains(event.target)) {
          isUserDropdownOpen.value = false;
        }
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });

    // Close dropdowns when clicking outside
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });

    return {
      // Refs
      showNotifications,
      isSidebarCollapsed,
      isUserDropdownOpen,
      currentDate,
      user,
      menuItems,
      notifications,
      unreadNotifications,
      
      // Template Refs
      notificationButton,
      notificationDropdown,
      userDropdownButton,
      userDropdownMenu,
      
      // Methods
      toggleSidebar,
      toggleNotifications,
      toggleUserDropdown,
      navigateToProfile,
      navigateToSettings,
      getNotificationIcon,
      formatTime,
      logout
    };
  }
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.navbar {
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1030;
}

.main-container {
  display: flex;
  flex: 1;
  background-color: #f8f9fa;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 1020;
  height: calc(100vh - 56px);
  position: fixed;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-link {
  padding: 0.75rem 1.5rem;
  color: #495057;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-link:hover, .nav-link.active {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border-left-color: #0d6efd;
}

.nav-link i {
  width: 20px;
  text-align: center;
}

.content {
  flex: 1;
  margin-left: 250px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  min-height: calc(100vh - 56px);
}

/* Notifications */
.notifications-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  width: 320px;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  margin-top: 0.5rem;
  z-index: 1000;
  display: none;
}

.notifications-dropdown.show {
  display: block;
}

.notification-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #f8f9fa;
}

.notification-icon {
  margin-right: 1rem;
  font-size: 1.25rem;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    left: 0;
    top: 56px;
    bottom: 0;
    z-index: 1040;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .content {
    margin-left: 0;
  }
  
  .app-layout.sidebar-collapsed .content {
    margin-left: 0;
  }
}

/* Collapsed sidebar */
.app-layout.sidebar-collapsed .sidebar {
  width: 70px;
  overflow: hidden;
}

.app-layout.sidebar-collapsed .sidebar .nav-link span {
  display: none;
}

.app-layout.sidebar-collapsed .sidebar .sidebar-header h5 {
  display: none;
}

.app-layout.sidebar-collapsed .content {
  margin-left: 70px;
}
</style>
