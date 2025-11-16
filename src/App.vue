<template>
  <div id="app">
    <!-- Toast Notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="toast show mb-2" 
        :class="`bg-${notification.type}`"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body text-white">
            <i :class="getNotificationIcon(notification.type)" class="me-2"></i>
            {{ notification.message }}
          </div>
          <button 
            type="button" 
            class="btn-close btn-close-white me-2 m-auto" 
            data-bs-dismiss="toast" 
            aria-label="Close"
            @click="removeNotification(notification.id)"
          ></button>
        </div>
      </div>
    </div>

    <!-- Public Navigation -->
    <nav v-if="!isPOSRoute && !isLoginRoute" class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-journal-text me-2" viewBox="0 0 16 16">
            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
          </svg>
          <span>Escorpión POS</span>
        </router-link>
        <button 
          class="navbar-toggler" 
          type="button" 
          @click="toggleNav"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :class="{'show': isNavOpen}" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" @click="closeNav">Inicio</router-link>
            </li>
            <li class="nav-item dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
              <a class="nav-link dropdown-toggle" href="#" role="button" @click.prevent="toggleDropdown">
                Blog
              </a>
              <ul class="dropdown-menu" :class="{'show': showDropdown}">
                <li><router-link to="/blog/bi-para-pymes" class="dropdown-item" @click="closeNav">BI para PYMES</router-link></li>
                <li><router-link to="/blog/estrategias-optimizacion-inventario" class="dropdown-item" @click="closeNav">Estrategias de Inventario</router-link></li>
                <li><router-link to="/blog/evolucion-pos-modernos" class="dropdown-item" @click="closeNav">Evolución POS</router-link></li>
                <li><router-link to="/blog/guia-implementacion-pos" class="dropdown-item" @click="closeNav">Guía POS</router-link></li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/servicios" class="nav-link" @click="closeNav">Servicios</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contacto" class="nav-link" @click="closeNav">Contacto</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link btn btn-outline-light ms-2" @click="closeNav">Iniciar sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAppStore } from './stores/app';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  data() {
    return {
      isNavOpen: false,
      showDropdown: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['notifications']),
    isPOSRoute() {
      return this.$route.path.startsWith('/pos');
    },
    isLoginRoute() {
      return this.$route.path === '/login' || this.$route.path === '/auth/login';
    },
  },
  methods: {
    ...mapActions(useAppStore, ['removeNotification']),
    
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    
    closeNav() {
      this.isNavOpen = false;
      this.showDropdown = false;
    },
    
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    
    getNotificationIcon(type) {
      const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-triangle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
      };
      return icons[type] || 'bi-info-circle-fill';
    }
  }
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #4361ee;
  --secondary-color: #3a0ca3;
  --success-color: #4bb543;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #212529;
}

/* Base Styles */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #212529;
  line-height: 1.6;
}

/* Layout */
.main-content {
  padding-top: 76px;
  min-height: calc(100vh - 76px);
  background-color: #f8f9fa;
}

/* Navigation */
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
}

.nav-link:hover,
.nav-link:focus {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dropdown Menu */
.dropdown-menu {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.5rem 1.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: var(--primary-color);
  color: white !important;
  transform: translateX(5px);
}

/* Footer */
footer {
  background-color: var(--dark-color);
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
}

footer h5 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}

footer a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
  display: block;
  margin-bottom: 0.5rem;
}

footer a:hover {
  color: #fff;
  text-decoration: none;
}

/* Toast Notifications */
.toast {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: var(--primary-color);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .dropdown-menu {
    background-color: rgba(255, 255, 255, 0.05);
    margin-left: 1rem;
    box-shadow: none;
    border-radius: 0.25rem;
  }
  
  .dropdown-item {
    color: rgba(255, 255, 255, 0.8);
    padding: 0.5rem 1rem;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white !important;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

/* Utility Classes */
.text-decoration-none {
  text-decoration: none !important;
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    color: black;
  }
  
  .container {
    width: 100%;
    max-width: 100%;
    padding: 0;
  }
}
</style>
