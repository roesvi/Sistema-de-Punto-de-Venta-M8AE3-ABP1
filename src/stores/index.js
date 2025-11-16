import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    // Authentication state
    isAuthenticated: false,
    user: null,
    
    // UI State
    isLoading: false,
    notifications: [],
    isSidebarCollapsed: false,
    
    // App settings
    theme: 'light',
    language: 'es',
    
    // Cart state
    cart: [],
    products: [],
    categories: [],
    currentView: 'pos',
    
    // Current business information
    currentBusiness: {
      id: null,
      name: 'Mi Negocio',
      logo: null,
      currency: 'CLP',
      taxRate: 0.19, // 19% IVA
      
      // Business hours
      businessHours: {
        monday: { open: '09:00', close: '19:00', isOpen: true },
        tuesday: { open: '09:00', close: '19:00', isOpen: true },
        wednesday: { open: '09:00', close: '19:00', isOpen: true },
        thursday: { open: '09:00', close: '19:00', isOpen: true },
        friday: { open: '09:00', close: '20:00', isOpen: true },
        saturday: { open: '10:00', close: '14:00', isOpen: true },
        sunday: { open: '', close: '', isOpen: false },
      }
    }
  }),
  
  getters: {
    // Check if user is admin
    isAdmin: (state) => state.user?.role === 'admin',
    
    // Get cart total
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    
    // Get cart item count
    cartItemsCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Get formatted business hours
    formattedBusinessHours: (state) => {
      const days = [
        'monday', 'tuesday', 'wednesday', 
        'thursday', 'friday', 'saturday', 'sunday'
      ];
      
      const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      };
      
      return days.map(day => ({
        day: dayNames[day],
        hours: state.currentBusiness.businessHours[day].isOpen 
          ? `${state.currentBusiness.businessHours[day].open} - ${state.currentBusiness.businessHours[day].close}`
          : 'Cerrado'
      }));
    }
  },
  
  actions: {
    // Authentication actions
    async login(credentials) {
      this.isLoading = true;
      try {
        // TODO: Replace with actual API call
        // const response = await authService.login(credentials);
        // this.user = response.user;
        // this.isAuthenticated = true;
        
        // Mock response for now
        this.user = {
          id: 1,
          name: 'Usuario Demo',
          email: 'demo@ejemplo.com',
          role: 'admin',
          avatar: null
        };
        this.isAuthenticated = true;
        
        // Add success notification
        this.addNotification({
          type: 'success',
          message: 'Sesión iniciada correctamente',
          timeout: 3000
        });
        
        return true;
      } catch (error) {
        this.addNotification({
          type: 'error',
          message: error.message || 'Error al iniciar sesión',
          timeout: 5000
        });
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async logout() {
      this.isLoading = true;
      try {
        // TODO: Add API call to invalidate session
        // await authService.logout();
        
        this.user = null;
        this.isAuthenticated = false;
        
        this.addNotification({
          type: 'success',
          message: 'Sesión cerrada correctamente',
          timeout: 3000
        });
        
        return true;
      } catch (error) {
        this.addNotification({
          type: 'error',
          message: error.message || 'Error al cerrar sesión',
          timeout: 5000
        });
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Cart actions
    addToCart(product, quantity = 1) {
      const existingItemIndex = this.cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        this.cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        this.cart.push({
          ...product,
          quantity
        });
      }
      
      this.addNotification({
        type: 'success',
        message: `${quantity} ${product.name} agregado al carrito`,
        timeout: 3000
      });
    },
    
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);
      
      this.addNotification({
        type: 'info',
        message: 'Producto eliminado del carrito',
        timeout: 3000
      });
    },
    
    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      
      const item = this.cart.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    clearCart() {
      this.cart = [];
    },
    
    // UI Actions
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    
    // Notification actions
    addNotification(notification) {
      const id = Date.now();
      this.notifications.push({
        id,
        ...notification
      });
      
      // Auto-remove notification after timeout
      if (notification.timeout) {
        setTimeout(() => {
          this.removeNotification(id);
        }, notification.timeout);
      }
    },
    
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
    
    // Theme actions
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.theme);
      
      // Save to localStorage
      localStorage.setItem('theme', this.theme);
    },
    
    // Initialize app
    initializeApp() {
      // Load theme from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.theme);
      }
      
      // Check for existing session
      // TODO: Implement session check
      // this.checkSession();
    }
  },
  
  // Persist state to localStorage
  persist: {
    paths: ['theme', 'language', 'cart', 'currentBusiness']
  }
});
