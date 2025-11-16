<template>
  <div class="settings-container">
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Configuración</h2>
        <button 
          class="btn btn-primary" 
          @click="saveSettings"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
          {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>

      <div class="row">
        <!-- Left Sidebar -->
        <div class="col-lg-3 mb-4">
          <div class="card">
            <div class="list-group list-group-flush">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="list-group-item list-group-item-action border-0 rounded-0 text-start"
                :class="{ 'active': activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                <i :class="`bi bi-${tab.icon} me-2`"></i>
                {{ tab.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="tab-content">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title mb-4">Configuración General</h5>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nombre del Negocio</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="settings.businessName"
                        placeholder="Ej: Mi Tienda"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Moneda</label>
                      <select class="form-select" v-model="settings.currency">
                        <option value="CLP">Peso Chileno (CLP)</option>
                        <option value="USD">Dólar Estadounidense (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="maintenanceMode"
                        v-model="settings.maintenanceMode"
                      >
                      <label class="form-check-label" for="maintenanceMode">
                        Modo Mantenimiento
                      </label>
                      <div class="form-text">
                        Cuando está activado, solo los administradores pueden acceder al sistema
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- More tabs will be added here -->
          <div v-else class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-gear-fill display-4 text-muted mb-3"></i>
              <h4>Configuración de {{ activeTabName }}</h4>
              <p class="text-muted">Esta sección estará disponible pronto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Settings',
  setup() {
    // Tabs configuration
    const tabs = [
      { id: 'general', name: 'General', icon: 'gear' },
      { id: 'company', name: 'Empresa', icon: 'building' },
      { id: 'localization', name: 'Ubicación', icon: 'globe2' },
      { id: 'email', name: 'Correo Electrónico', icon: 'envelope' },
      { id: 'invoices', name: 'Facturación', icon: 'receipt' },
      { id: 'taxes', name: 'Impuestos', icon: 'percent' },
      { id: 'backup', name: 'Copia de Seguridad', icon: 'cloud-arrow-down' }
    ];
    
    const activeTab = ref('general');
    const isSaving = ref(false);
    
    // Settings data
    const settings = ref({
      businessName: 'Mi Tienda',
      currency: 'CLP',
      maintenanceMode: false
    });

    // Computed
    const activeTabName = computed(() => {
      const tab = tabs.find(t => t.id === activeTab.value);
      return tab ? tab.name : '';
    });

    // Methods
    const saveSettings = async () => {
      isSaving.value = true;
      
      try {
        // In a real app, this would be an API call
        // await axios.put('/api/settings', settings.value);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        alert('Configuración guardada exitosamente');
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Ocurrió un error al guardar la configuración');
      } finally {
        isSaving.value = false;
      }
    };

    return {
      // Refs
      tabs,
      activeTab,
      isSaving,
      
      // Data
      settings,
      
      // Computed
      activeTabName,
      
      // Methods
      saveSettings
    };
  }
};
</script>

<style scoped>
.settings-container {
  padding: 1.5rem;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
}

.list-group-item {
  border-left: 0;
  border-right: 0;
  padding: 0.75rem 1.25rem;
}

.list-group-item:first-child {
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.list-group-item:last-child {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.list-group-item.active {
  background-color: #4361ee;
  border-color: #4361ee;
}

.list-group-item i {
  width: 1.25rem;
  text-align: center;
  margin-right: 0.5rem;
}

.form-check-input:checked {
  background-color: #4361ee;
  border-color: #4361ee;
}

.btn-primary {
  background-color: #4361ee;
  border-color: #4361ee;
}

.btn-primary:hover {
  background-color: #3a56d4;
  border-color: #3a56d4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .settings-container {
    padding: 1rem 0.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style>
