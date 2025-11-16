<template>
  <div class="customers-management">
    <div class="container-fluid">
      <!-- Header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Clientes</h2>
          <p class="text-muted mb-0">Gestión de clientes y su historial</p>
        </div>
        <div>
          <button class="btn btn-primary" @click="addNewCustomer">
            <i class="bi bi-plus-lg me-1"></i> Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Buscar</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar clientes..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Tipo</label>
              <select class="form-select" v-model="filters.type">
                <option value="">Todos</option>
                <option value="individual">Particulares</option>
                <option value="business">Empresas</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="filters.status">
                <option value="">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-1"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary bg-opacity-10 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Total Clientes</h6>
                  <h3 class="mb-0">{{ stats.totalCustomers }}</h3>
                </div>
                <div class="bg-primary bg-opacity-25 p-3 rounded">
                  <i class="bi bi-people text-primary" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success bg-opacity-10 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Clientes Activos</h6>
                  <h3 class="mb-0">{{ stats.activeCustomers }}</h3>
                </div>
                <div class="bg-success bg-opacity-25 p-3 rounded">
                  <i class="bi bi-person-check text-success" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning bg-opacity-10 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Clientes Nuevos (30d)</h6>
                  <h3 class="mb-0">{{ stats.newCustomers }}</h3>
                </div>
                <div class="bg-warning bg-opacity-25 p-3 rounded">
                  <i class="bi bi-person-plus text-warning" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info bg-opacity-10 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Valor Promedio</h6>
                  <h3 class="mb-0">${{ formatNumber(stats.avgOrderValue) }}</h3>
                </div>
                <div class="bg-info bg-opacity-25 p-3 rounded">
                  <i class="bi bi-cash-coin text-info" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Última Compra</th>
                  <th class="text-end">Total Gastado</th>
                  <th>Pedidos</th>
                  <th>Estado</th>
                  <th class="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredCustomers.length === 0">
                  <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                      <i class="bi bi-people" style="font-size: 2rem;"></i>
                      <p class="mt-2 mb-0">No se encontraron clientes</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="customer in paginatedCustomers" :key="customer.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar me-3">
                        <span 
                          class="avatar-initial rounded-circle"
                          :style="{
                            backgroundColor: stringToColor(customer.type === 'business' ? customer.businessName : `${customer.firstName} ${customer.lastName}`),
                            color: getContrastColor(stringToColor(customer.type === 'business' ? customer.businessName : `${customer.firstName} ${customer.lastName}`))
                          }"
                        >
                          {{ customer.type === 'business' ? (customer.businessName || '').charAt(0).toUpperCase() : (customer.firstName || '').charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <h6 class="mb-0">{{ customer.type === 'business' ? customer.businessName : `${customer.firstName} ${customer.lastName}` }}</h6>
                        <small class="text-muted">{{ customer.type === 'business' ? 'Empresa' : 'Particular' }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div v-if="customer.email || customer.phone">
                      <div v-if="customer.email" class="text-truncate" style="max-width: 200px;" :title="customer.email">
                        <i class="bi bi-envelope me-1 text-muted"></i> {{ customer.email }}
                      </div>
                      <div v-if="customer.phone" class="text-muted">
                        <i class="bi bi-telephone me-1"></i> {{ formatPhoneNumber(customer.phone) }}
                      </div>
                    </div>
                    <span v-else class="text-muted">Sin contacto</span>
                  </td>
                  <td>
                    <div v-if="customer.lastPurchase">
                      <div>{{ formatDate(customer.lastPurchase) }}</div>
                      <small class="text-muted">Hace {{ timeAgo(customer.lastPurchase) }}</small>
                    </div>
                    <span v-else class="text-muted">Sin compras</span>
                  </td>
                  <td class="text-end fw-medium">
                    {{ customer.totalSpent ? '$' + formatNumber(customer.totalSpent) : '-' }}
                  </td>
                  <td>
                    <span class="badge bg-light text-dark">
                      {{ customer.orderCount || 0 }} pedidos
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="customer.isActive ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">
                      {{ customer.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewCustomer(customer)" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-outline-secondary" @click="editCustomer(customer)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn" 
                        :class="customer.isActive ? 'btn-outline-warning' : 'btn-outline-success'"
                        @click="toggleCustomerStatus(customer)"
                        :title="customer.isActive ? 'Desactivar' : 'Activar'"
                      >
                        <i :class="customer.isActive ? 'bi-person-x' : 'bi-person-check'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center p-3 border-top">
            <div class="text-muted">
              Mostrando {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredCustomers.length) }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }} de 
              {{ filteredCustomers.length }} clientes
            </div>
            <nav>
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage--">Anterior</button>
                </li>
                <li 
                  v-for="page in totalPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="currentPage = page">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="currentPage++">Siguiente</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Form Modal -->
    <div class="modal fade" :class="{ 'show d-block': showCustomerModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCustomer">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tipo de Cliente <span class="text-danger">*</span></label>
                    <div class="d-flex gap-3">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="radio" 
                          v-model="currentCustomer.type" 
                          value="individual"
                          id="typeIndividual"
                          required
                        >
                        <label class="form-check-label" for="typeIndividual">
                          Particular
                        </label>
                      </div>
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="radio" 
                          v-model="currentCustomer.type" 
                          value="business"
                          id="typeBusiness"
                        >
                        <label class="form-check-label" for="typeBusiness">
                          Empresa
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-check form-switch">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="currentCustomer.isActive"
                      >
                      <span class="form-check-label">Cliente Activo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="currentCustomer.type === 'business'">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nombre de la Empresa <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="currentCustomer.businessName"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">RUT/RUC</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="currentCustomer.taxId"
                        :placeholder="currentCustomer.type === 'business' ? 'RUT con guión y DV' : 'RUT sin puntos con guión y DV'"
                      >
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre del Contacto</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="currentCustomer.contactName"
                  >
                </div>
              </div>
              <div v-else>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nombre <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="currentCustomer.firstName"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Apellido <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="currentCustomer.lastName"
                        required
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email <span class="text-danger">*</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="currentCustomer.email"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="currentCustomer.phone"
                    >
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Dirección</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="currentCustomer.address"
                  placeholder="Calle y número"
                >
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Ciudad</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="currentCustomer.city"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Código Postal</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="currentCustomer.postalCode"
                    >
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Notas</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  v-model="currentCustomer.notes"
                  placeholder="Notas adicionales sobre el cliente..."
                ></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Actualizar Cliente' : 'Guardar Cliente' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCustomerModal" class="modal-backdrop fade show"></div>

    <!-- Customer Details Modal -->
    <div class="modal fade" :class="{ 'show d-block': showCustomerDetails }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del Cliente</h5>
            <div class="btn-group">
              <button 
                type="button" 
                class="btn btn-outline-secondary btn-sm"
                @click="editCustomer(currentCustomerView)"
              >
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button 
                type="button" 
                class="btn"
                :class="currentCustomerView?.isActive ? 'btn-outline-warning' : 'btn-outline-success'"
                @click="toggleCustomerStatus(currentCustomerView)"
              >
                <i :class="currentCustomerView?.isActive ? 'bi-person-x' : 'bi-person-check'"></i>
                {{ currentCustomerView?.isActive ? 'Desactivar' : 'Activar' }}
              </button>
              <button type="button" class="btn-close" @click="showCustomerDetails = false"></button>
            </div>
          </div>
          <div class="modal-body" v-if="currentCustomerView">
            <div class="row mb-4">
              <div class="col-md-8">
                <div class="d-flex align-items-center mb-3">
                  <div class="avatar me-3" style="width: 80px; height: 80px;">
                    <span 
                      class="avatar-initial rounded-circle d-flex align-items-center justify-content-center"
                      :style="{
                        backgroundColor: stringToColor(currentCustomerView.name),
                        color: getContrastColor(stringToColor(currentCustomerView.name)),
                        fontSize: '2rem',
                        width: '100%',
                        height: '100%'
                      }"
                    >
                      {{ getInitials(currentCustomerView.name) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="mb-1">{{ currentCustomerView.name }}</h3>
                    <span class="badge" 
                      :class="currentCustomerView.isActive ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">
                      {{ currentCustomerView.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span class="badge bg-light text-dark ms-2">
                      {{ currentCustomerView.type === 'business' ? 'Empresa' : 'Particular' }}
                    </span>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <h6 class="text-muted mb-2">Información de Contacto</h6>
                    <p class="mb-1" v-if="currentCustomerView.email">
                      <i class="bi bi-envelope me-2 text-muted"></i> {{ currentCustomerView.email }}
                    </p>
                    <p class="mb-1" v-if="currentCustomerView.phone">
                      <i class="bi bi-telephone me-2 text-muted"></i> {{ formatPhoneNumber(currentCustomerView.phone) }}
                    </p>
                    <p class="mb-1" v-if="currentCustomerView.address">
                      <i class="bi bi-geo-alt me-2 text-muted"></i> {{ currentCustomerView.address }}
                    </p>
                    <p class="mb-0" v-if="currentCustomerView.city || currentCustomerView.postalCode">
                      {{ currentCustomerView.city }} {{ currentCustomerView.postalCode ? ', ' + currentCustomerView.postalCode : '' }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="text-muted mb-2">Información Adicional</h6>
                    <p class="mb-1" v-if="currentCustomerView.taxId">
                      <strong>RUT/RUC:</strong> {{ currentCustomerView.taxId }}
                    </p>
                    <p class="mb-1">
                      <strong>Miembro desde:</strong> {{ formatDate(currentCustomerView.createdAt) }}
                    </p>
                    <p class="mb-0" v-if="currentCustomerView.lastPurchase">
                      <strong>Última compra:</strong> {{ formatDate(currentCustomerView.lastPurchase) }}
                    </p>
                  </div>
                </div>

                <div v-if="currentCustomerView.notes" class="mb-3">
                  <h6 class="text-muted mb-2">Notas</h6>
                  <div class="p-3 bg-light rounded">
                    {{ currentCustomerView.notes }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 bg-light">
                  <div class="card-body text-center">
                    <h6 class="text-muted mb-3">Resumen de Compras</h6>
                    <div class="d-flex justify-content-around mb-4">
                      <div>
                        <div class="h2 mb-0">{{ currentCustomerView.orderCount || 0 }}</div>
                        <small class="text-muted">Pedidos</small>
                      </div>
                      <div>
                        <div class="h2 mb-0">${{ formatNumber(currentCustomerView.totalSpent || 0) }}</div>
                        <small class="text-muted">Total Gastado</small>
                      </div>
                    </div>
                    <button class="btn btn-outline-primary w-100 mb-2" @click="viewCustomerOrders(currentCustomerView)">
                      <i class="bi bi-cart3 me-1"></i> Ver Pedidos
                    </button>
                    <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-envelope me-1"></i> Enviar Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Activity Timeline -->
            <div>
              <h6 class="text-muted mb-3">Actividad Reciente</h6>
              <div class="timeline">
                <div v-for="(activity, index) in customerActivities" :key="index" class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="d-flex justify-content-between">
                      <h6 class="mb-1">{{ activity.title }}</h6>
                      <small class="text-muted">{{ timeAgo(activity.date) }}</small>
                    </div>
                    <p class="mb-0">{{ activity.description }}</p>
                    <div v-if="activity.details" class="mt-1">
                      <small class="text-muted">{{ activity.details }}</small>
                    </div>
                  </div>
                </div>
                <div v-if="customerActivities.length === 0" class="text-center py-3 text-muted">
                  No hay actividad reciente para mostrar
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="showCustomerDetails = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCustomerDetails" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Customers',
  setup() {
    // Sample data - in a real app, this would come from an API
    const customers = ref([
      {
        id: 1,
        type: 'individual',
        firstName: 'Rober',
        lastName: 'Escobar',
        email: 'rober.escobar@example.com',
        phone: '+56912345678',
        address: 'Av. Providencia 1234',
        city: 'Santiago',
        postalCode: '7500000',
        taxId: '12.345.678-9',
        isActive: true,
        orderCount: 5,
        totalSpent: 1250000,
        lastPurchase: new Date('2023-11-05T14:30:00'),
        createdAt: new Date('2023-01-15T10:00:00'),
        notes: 'Cliente frecuente, prefiere contacto por email.'
      },
      {
        id: 2,
        type: 'business',
        businessName: 'TecnoSoluciones SpA',
        contactName: 'María González',
        email: 'contacto@tecnosoluciones.cl',
        phone: '+56987654321',
        address: 'Av. Apoquindo 4500',
        city: 'Las Condes',
        postalCode: '7550000',
        taxId: '76.543.210-8',
        isActive: true,
        orderCount: 12,
        totalSpent: 3250000,
        lastPurchase: new Date('2023-11-08T11:15:00'),
        createdAt: new Date('2022-11-20T09:30:00'),
        notes: 'Empresa con descuento corporativo del 10%.'
      },
      // Add more sample customers as needed
    ]);

    const filters = ref({
      search: '',
      type: '',
      status: ''
    });

    const showCustomerModal = ref(false);
    const showCustomerDetails = ref(false);
    const isEditing = ref(false);
    const currentCustomer = ref(createEmptyCustomer());
    const currentCustomerView = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 10;

    // Computed properties
    const filteredCustomers = computed(() => {
      if (!Array.isArray(customers.value)) {
        return [];
      }
      
      return customers.value.filter(customer => {
        if (!customer) return false;
        
        // Filter by search term
        const name = customer.type === 'business' 
          ? (customer.businessName || '') 
          : `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
          
        const searchTerm = (filters.value.search || '').toLowerCase();
        const matchesSearch = !searchTerm || 
          name.toLowerCase().includes(searchTerm) ||
          (customer.email || '').toLowerCase().includes(searchTerm) ||
          (customer.phone || '').includes(filters.value.search);
        
        // Filter by type
        const matchesType = !filters.value.type || customer.type === filters.value.type;
        
        // Filter by status
        const matchesStatus = filters.value.status === '' || 
          (filters.value.status === 'active' && customer.isActive) ||
          (filters.value.status === 'inactive' && !customer.isActive);

        return matchesSearch && matchesType && matchesStatus;
      }).sort((a, b) => {
        // Sort by last purchase date (most recent first)
        if (!a || !b) return 0;
        if (!a.lastPurchase && !b.lastPurchase) return 0;
        if (!a.lastPurchase) return 1;
        if (!b.lastPurchase) return -1;
        return new Date(b.lastPurchase) - new Date(a.lastPurchase);
      }) || [];
    });

    const paginatedCustomers = computed(() => {
      if (!filteredCustomers.value || !Array.isArray(filteredCustomers.value)) {
        return [];
      }
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredCustomers.value.slice(start, end) || [];
    });

    const totalPages = computed(() => {
      if (!filteredCustomers.value || !filteredCustomers.value.length) return 1;
      return Math.ceil(filteredCustomers.value.length / itemsPerPage) || 1;
    });

    const stats = computed(() => {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      const activeCustomers = customers.value.filter(c => c.isActive).length;
      const newCustomers = customers.value.filter(c => 
        new Date(c.createdAt) >= thirtyDaysAgo
      ).length;
      
      const totalSpent = customers.value.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
      const avgOrderValue = customers.value.length > 0 
        ? Math.round(totalSpent / customers.value.length) 
        : 0;
      
      return {
        totalCustomers: customers.value.length,
        activeCustomers,
        newCustomers,
        avgOrderValue
      };
    });

    const customerActivities = computed(() => {
      if (!currentCustomerView.value) return [];
      
      const activities = [];
      
      // Add account creation
      activities.push({
        title: 'Cuenta creada',
        date: currentCustomerView.value.createdAt,
        description: 'El cliente se registró en el sistema',
        type: 'account_created'
      });
      
      // Add last purchase
      if (currentCustomerView.value.lastPurchase) {
        activities.push({
          title: 'Última compra',
          date: currentCustomerView.value.lastPurchase,
          description: `Realizó una compra por $${formatNumber(currentCustomerView.value.totalSpent)}`,
          type: 'purchase',
          details: `Pedido #${Math.floor(1000 + Math.random() * 9000)}`
        });
      }
      
      // Add some sample activities
      const activityTypes = [
        {
          title: 'Actualización de perfil',
          description: 'El cliente actualizó su información de contacto',
          type: 'profile_update'
        },
        {
          title: 'Contacto de soporte',
          description: 'El cliente contactó al servicio al cliente',
          type: 'support_contact'
        },
        {
          title: 'Revisión de producto',
          description: 'El cliente dejó una reseña de un producto',
          type: 'product_review',
          details: 'Calificación: 5 estrellas'
        }
      ];
      
      // Add 1-3 random activities
      const randomActivityCount = Math.floor(Math.random() * 3) + 1;
      const shuffledActivities = [...activityTypes].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < randomActivityCount; i++) {
        if (shuffledActivities[i]) {
          const daysAgo = Math.floor(Math.random() * 30) + 1;
          const activityDate = new Date();
          activityDate.setDate(activityDate.getDate() - daysAgo);
          
          activities.push({
            ...shuffledActivities[i],
            date: activityDate
          });
        }
      }
      
      // Sort by date (newest first)
      return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // Methods
    function createEmptyCustomer() {
      return {
        type: 'individual',
        firstName: '',
        lastName: '',
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        taxId: '',
        isActive: true,
        notes: '',
        orderCount: 0,
        totalSpent: 0,
        lastPurchase: null,
        createdAt: new Date()
      };
    }

    function formatNumber(value) {
      return new Intl.NumberFormat('es-CL').format(value);
    }

    function formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    function formatDateTime(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function formatPhoneNumber(phone) {
      if (!phone) return '';
      // Simple formatting for Chilean phone numbers
      return phone.replace(/(\+56)(\d{2})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }

    function timeAgo(date) {
      if (!date) return 'Nunca';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
      
      const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60,
        segundo: 1
      };
      
      for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
          return interval === 1 
            ? `hace ${interval} ${unit}` 
            : `hace ${interval} ${unit}s`;
        }
      }
      
      return 'hace unos segundos';
    }

    function stringToColor(str) {
      if (!str) return '#6c757d';
      
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 60%)`;
    }

    function getContrastColor(hexColor) {
      // Convert hex to RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Return black for light colors, white for dark colors
      return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    function getInitials(name) {
      if (!name) return '?';
      const names = name.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`
        : names[0].charAt(0);
    }

    function resetFilters() {
      filters.value = {
        search: '',
        type: '',
        status: ''
      };
      currentPage.value = 1;
    }

    function addNewCustomer() {
      isEditing.value = false;
      currentCustomer.value = createEmptyCustomer();
      showCustomerModal.value = true;
    }

    function editCustomer(customer) {
      isEditing.value = true;
      currentCustomer.value = JSON.parse(JSON.stringify(customer));
      showCustomerModal.value = true;
      showCustomerDetails.value = false;
    }

    function viewCustomer(customer) {
      currentCustomerView.value = JSON.parse(JSON.stringify(customer));
      showCustomerDetails.value = true;
    }

    function viewCustomerOrders(customer) {
      // In a real app, this would navigate to the orders page filtered by this customer
      console.log('Viewing orders for customer:', customer.id);
      alert(`Mostrando pedidos del cliente: ${customer.name}`);
    }

    function saveCustomer() {
      // Basic validation
      if (!currentCustomer.value.email) {
        alert('Por favor ingrese un correo electrónico');
        return;
      }

      if (isEditing.value) {
        // Update existing customer
        const index = customers.value.findIndex(c => c.id === currentCustomer.value.id);
        if (index !== -1) {
          customers.value[index] = { ...currentCustomer.value };
        }
      } else {
        // Add new customer
        const newId = Math.max(0, ...customers.value.map(c => c.id)) + 1;
        const newCustomer = {
          ...currentCustomer.value,
          id: newId,
          createdAt: new Date(),
          orderCount: 0,
          totalSpent: 0
        };
        
        if (newCustomer.type === 'business') {
          newCustomer.name = newCustomer.businessName;
        } else {
          newCustomer.name = `${newCustomer.firstName} ${newCustomer.lastName}`.trim();
        }
        
        customers.value.unshift(newCustomer);
      }
      
      closeModal();
    }

    function toggleCustomerStatus(customer) {
      const index = customers.value.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        customers.value[index].isActive = !customers.value[index].isActive;
        
        // Update the current customer view if it's the same customer
        if (currentCustomerView.value && currentCustomerView.value.id === customer.id) {
          currentCustomerView.value.isActive = customers.value[index].isActive;
        }
      }
    }

    function closeModal() {
      showCustomerModal.value = false;
      showCustomerDetails.value = false;
      currentCustomer.value = createEmptyCustomer();
    }

    // Initialize with some sample data if empty
    onMounted(() => {
      // This would typically be an API call in a real app
      // For now, we're using the sample data defined above
    });

    return {
      // Data
      filters,
      showCustomerModal,
      showCustomerDetails,
      isEditing,
      currentCustomer,
      currentCustomerView,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredCustomers,
      paginatedCustomers,
      totalPages,
      stats,
      customerActivities,
      
      // Methods
      formatNumber,
      formatDate,
      formatDateTime,
      formatPhoneNumber,
      timeAgo,
      stringToColor,
      getContrastColor,
      getInitials,
      resetFilters,
      addNewCustomer,
      editCustomer,
      viewCustomer,
      viewCustomerOrders,
      saveCustomer,
      toggleCustomerStatus,
      closeModal
    };
  }
};
</script>

<style scoped>
.customers-management {
  padding: 1.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
  margin: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #4361ee;
  border: 2px solid white;
  z-index: 1;
}

.timeline-content {
  background-color: white;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .customers-management {
    padding: 1rem 0.5rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}
</style>
