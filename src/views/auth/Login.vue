<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-lg">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <div class="auth-logo mb-3">
                  <img src="@/assets/logo.svg" alt="Logo" height="50" class="me-2">
                  <h2 class="mb-0">Escorpión POS</h2>
                </div>
                <p class="text-muted">Inicia sesión para continuar</p>
              </div>
              
              <form @submit.prevent="handleLogin">
                <!-- Alert for errors -->
                <div v-if="error" class="alert alert-danger" role="alert">
                  {{ error }}
                </div>
                
                <!-- Username/Email -->
                <div class="mb-3">
                  <label for="username" class="form-label">Usuario o Correo</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="username"
                      v-model="username"
                      :class="{ 'is-invalid': errors.username }"
                      placeholder="Ingresa tu usuario o correo"
                      required
                      autofocus
                    >
                    <div v-if="errors.username" class="invalid-feedback">
                      {{ errors.username }}
                    </div>
                  </div>
                </div>
                
                <!-- Password -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label for="password" class="form-label">Contraseña</label>
                    <router-link to="/forgot-password" class="small text-decoration-none">
                      ¿Olvidaste tu contraseña?
                    </router-link>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control" 
                      id="password"
                      v-model="password"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Ingresa tu contraseña"
                      required
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password }}
                    </div>
                  </div>
                </div>
                
                <!-- Remember Me -->
                <div class="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="remember"
                    v-model="rememberMe"
                  >
                  <label class="form-check-label" for="remember">Recordar sesión</label>
                </div>
                
                <!-- Submit Button -->
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                  </button>
                </div>
              </form>
              
              <!-- Social Login -->
              <div class="text-center mt-4">
                <p class="text-muted mb-3">O inicia sesión con</p>
                <div class="d-flex justify-content-center gap-3">
                  <button class="btn btn-outline-primary rounded-circle" type="button">
                    <i class="bi bi-google"></i>
                  </button>
                  <button class="btn btn-outline-primary rounded-circle" type="button">
                    <i class="bi bi-facebook"></i>
                  </button>
                  <button class="btn btn-outline-primary rounded-circle" type="button">
                    <i class="bi bi-microsoft"></i>
                  </button>
                </div>
              </div>
              
              <!-- Register Link -->
              <div class="text-center mt-4">
                <p class="mb-0">
                  ¿No tienes una cuenta? 
                  <router-link to="/register" class="text-decoration-none">Regístrate</router-link>
                </p>
              </div>
            </div>
          </div>
          
          <!-- App Download Links -->
          <div class="text-center mt-4">
            <p class="text-muted mb-2">Descarga nuestra aplicación móvil</p>
            <div class="d-flex justify-content-center gap-2">
              <a href="#" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-apple me-1"></i> App Store
              </a>
              <a href="#" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-google-play me-1"></i> Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const appStore = useAppStore();
    
    // Form state
    const username = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref('');
    const errors = ref({
      username: '',
      password: ''
    });
    
    // Handle login
    const handleLogin = async () => {
      // Reset errors
      error.value = '';
      errors.value = { username: '', password: '' };
      
      // Simple validation
      if (!username.value) {
        errors.value.username = 'Por favor ingresa tu usuario o correo';
        return;
      }
      
      if (!password.value) {
        errors.value.password = 'Por favor ingresa tu contraseña';
        return;
      }
      
      try {
        loading.value = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, accept any non-empty credentials
        if (username.value && password.value) {
          // In a real app, you would make an API call to authenticate
          const userData = {
            id: 1,
            name: username.value === 'admin' ? 'Administrador' : 'Usuario',
            email: username.value.includes('@') ? username.value : `${username.value}@example.com`,
            role: username.value === 'admin' ? 'admin' : 'user',
            token: 'demo-token-1234567890',
            permissions: ['view_dashboard', 'manage_products', 'process_sales']
          };
          
          // Save user data to the store
          appStore.login(userData, rememberMe.value);
          
          // Redirect to the original URL or dashboard
          const redirectPath = route.query.redirect || '/';
          router.push(redirectPath);
          
          // Show success message that will auto-dismiss after 5 seconds
          const notification = appStore.addNotification({
            type: 'success',
            message: '¡Bienvenido de nuevo!',
            read: false,
            timeout: 5000 // 5 seconds in milliseconds
          });
        } else {
          throw new Error('Credenciales inválidas');
        }
      } catch (err) {
        error.value = err.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        console.error('Login error:', err);
      } finally {
        loading.value = false;
      }
    };
    
    return {
      // State
      username,
      password,
      rememberMe,
      showPassword,
      loading,
      error,
      errors,
      
      // Methods
      handleLogin
    };
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 2rem 0;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj4KICAgIDxwYXRoIGQ9Ik0gMTAgMCBMIDAgMTAgTCAwIDAgWiIgZmlsbD0icmdiYSgyNDksIDI0OSwgMjQ5LCAwLjEpIi8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz4KPC9zdmc+');
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.card {
  border: none;
  border-radius: 0.75rem;
  overflow: hidden;
}

.card-body {
  padding: 2.5rem;
}

.btn-google {
  background-color: #db4437;
  color: white;
}

.btn-facebook {
  background-color: #4267B2;
  color: white;
}

.btn-microsoft {
  background-color: #00A4EF;
  color: white;
}

.input-group-text {
  background-color: #f8f9fa;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn-outline-secondary:hover {
  color: #0d6efd;
  border-color: #0d6efd;
  background-color: transparent;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 576px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .auth-page {
    padding: 1rem;
  }
}
</style>
