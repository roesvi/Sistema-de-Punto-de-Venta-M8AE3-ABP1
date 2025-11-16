import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAppStore } from './stores/app';

// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import custom styles
import './assets/css/style.css';

// Create Vue app
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Use plugins
app.use(pinia);
app.use(router);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err);
  console.error('Error info:', info);
  
  try {
    // Get app store inside the error handler
    const appStore = useAppStore();
    if (appStore && typeof appStore.addNotification === 'function') {
      appStore.addNotification({
        type: 'error',
        message: 'Ha ocurrido un error inesperado',
        read: false
      });
    }
  } catch (storeError) {
    console.error('Error in error handler:', storeError);
  }
};

// Global properties
app.config.globalProperties.$filters = {
  formatCurrency(value) {
    if (typeof value !== 'number') {
      return value;
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },
  formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('es-CL');
  },
  formatDateTime(value) {
    if (!value) return '';
    return new Date(value).toLocaleString('es-CL');
  }
};

// Mount the app
app.mount('#app');

// Log app info
console.log(`%cEscorpión POS v${import.meta.env.VITE_APP_VERSION || '1.0.0'}`, 
  'color: #4361ee; font-size: 14px; font-weight: bold');
