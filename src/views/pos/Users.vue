<template>
  <div class="users-management">
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Usuarios</h2>
          <p class="text-muted mb-0">Gestión de usuarios y permisos del sistema</p>
        </div>
        <div>
          <button class="btn btn-primary" @click="showUserModal()">
            <i class="bi bi-plus-lg me-1"></i> Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-transparent">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar usuarios..."
                  v-model="searchQuery"
                >
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="statusFilter">
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="roleFilter">
                <option value="">Todos los roles</option>
                <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                  {{ role.label }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-1"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Total Usuarios</h6>
                  <h3 class="mb-0">{{ stats.totalUsers }}</h3>
                  <div class="mt-2">
                    <span class="text-success">
                      <i class="bi bi-arrow-up"></i>
                      {{ stats.newThisMonth }} este mes
                    </span>
                  </div>
                </div>
                <div class="bg-primary bg-opacity-25 p-3 rounded">
                  <i class="bi bi-people text-primary" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Activos</h6>
                  <h3 class="mb-0">{{ stats.activeUsers }}</h3>
                  <div class="mt-2">
                    <span class="text-muted">
                      {{ Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0 }}% del total
                    </span>
                  </div>
                </div>
                <div class="bg-success bg-opacity-25 p-3 rounded">
                  <i class="bi bi-check-circle text-success" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Inactivos</h6>
                  <h3 class="mb-0">{{ stats.inactiveUsers }}</h3>
                  <div class="mt-2">
                    <span class="text-muted">
                      {{ Math.round((stats.inactiveUsers / stats.totalUsers) * 100) || 0 }}% del total
                    </span>
                  </div>
                </div>
                <div class="bg-warning bg-opacity-25 p-3 rounded">
                  <i class="bi bi-pause-circle text-warning" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Suspendidos</h6>
                  <h3 class="mb-0">{{ stats.suspendedUsers }}</h3>
                  <div class="mt-2">
                    <span class="text-muted">
                      {{ Math.round((stats.suspendedUsers / stats.totalUsers) * 100) || 0 }}% del total
                    </span>
                  </div>
                </div>
                <div class="bg-danger bg-opacity-25 p-3 rounded">
                  <i class="bi bi-slash-circle text-danger" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="selectAll"
                        @change="toggleSelectAll"
                      >
                    </div>
                  </th>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Último Acceso</th>
                  <th>Estado</th>
                  <th class="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="7" class="text-center py-5">
                    <div class="text-muted">
                      <i class="bi bi-people display-5 d-block mb-3"></i>
                      No se encontraron usuarios que coincidan con los filtros
                    </div>
                  </td>
                </tr>
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td class="ps-4">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="selectedUsers"
                        :value="user.id"
                        @change="updateSelectAll"
                      >
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar me-3">
                        <img 
                          :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`" 
                          class="rounded-circle"
                          :alt="user.name"
                        >
                      </div>
                      <div>
                        <div class="fw-medium">{{ user.username }}</div>
                        <small class="text-muted">{{ user.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.name }}</td>
                  <td>
                    <span class="badge" :class="getRoleBadgeClass(user.role)">
                      {{ getRoleName(user.role) }}
                    </span>
                  </td>
                  <td>
                    <div v-if="user.lastLogin">
                      <div>{{ formatDate(user.lastLogin, 'short') }}</div>
                      <small class="text-muted">
                        {{ formatTimeAgo(user.lastLogin) }}
                      </small>
                    </div>
                    <span v-else class="text-muted">Nunca</span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(user.status)">
                      {{ getStatusName(user.status) }}
                    </span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="dropdown">
                      <button 
                        class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                        type="button" 
                        :id="'userDropdown' + user.id"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="true"
                        aria-expanded="false"
                        @click="initDropdown($event)"
                      >
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="'userDropdown' + user.id">
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="showUserModal(user); hideDropdown($event)">
                            <i class="bi bi-pencil me-2"></i>Editar
                          </a>
                        </li>
                        <li v-if="user.status === 'active'">
                          <a class="dropdown-item" href="#" @click.prevent="updateUserStatus(user.id, 'inactive'); hideDropdown($event)">
                            <i class="bi bi-pause me-2"></i>Desactivar
                          </a>
                        </li>
                        <li v-else>
                          <a class="dropdown-item" href="#" @click.prevent="updateUserStatus(user.id, 'active'); hideDropdown($event)">
                            <i class="bi bi-check-circle me-2"></i>Activar
                          </a>
                        </li>
                        <li v-if="user.status !== 'suspended'">
                          <a class="dropdown-item" href="#" @click.prevent="updateUserStatus(user.id, 'suspended')">
                            <i class="bi bi-slash-circle me-2"></i>Suspender
                          </a>
                        </li>
                        <li v-else>
                          <a class="dropdown-item" href="#" @click.prevent="updateUserStatus(user.id, 'active')">
                            <i class="bi bi-arrow-clockwise me-2"></i>Reactivar
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a 
                            class="dropdown-item text-danger" 
                            href="#" 
                            @click.prevent="confirmDeleteUser(user)"
                          >
                            <i class="bi bi-trash me-2"></i>Eliminar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center p-3 border-top" v-if="filteredUsers.length > 0">
            <div class="text-muted">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} de 
              {{ filteredUsers.length }} usuarios
            </div>
            <nav aria-label="Page navigation">
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                  </a>
                </li>
                <li 
                  v-for="page in totalPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="changePage(page)">
                    {{ page }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
            <div class="d-flex align-items-center">
              <label class="me-2 text-muted">Mostrar:</label>
              <select class="form-select form-select-sm" style="width: auto;" v-model="itemsPerPage">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-4 text-center mb-4">
                  <div class="position-relative d-inline-block">
                    <img 
                      :src="form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'U') + '&background=random'" 
                      class="rounded-circle mb-3" 
                      width="120" 
                      height="120"
                      style="object-fit: cover;"
                      :alt="form.name || 'Usuario'"
                    >
                    <button 
                      type="button" 
                      class="btn btn-sm btn-primary position-absolute bottom-0 start-50 translate-middle"
                      @click="triggerFileUpload"
                    >
                      <i class="bi bi-camera"></i>
                    </button>
                    <input 
                      type="file" 
                      ref="avatarInput" 
                      class="d-none" 
                      accept="image/*"
                      @change="handleAvatarUpload"
                    >
                  </div>
                  <div class="text-muted small">
                    Tamaño máximo: 2MB
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.name"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Apellido</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.lastName"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Nombre de usuario</label>
                      <div class="input-group">
                        <span class="input-group-text">@</span>
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="form.username"
                          required
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Correo electrónico</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="form.email"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="form.phone"
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Rol</label>
                      <select class="form-select" v-model="form.role" required>
                        <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                          {{ role.label }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Dirección</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.address"
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contraseña</label>
                      <div class="input-group">
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          class="form-control" 
                          v-model="form.password"
                          :required="!isEditing"
                          :minlength="isEditing && form.password ? 6 : 6"
                        >
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button"
                          @click="showPassword = !showPassword"
                        >
                          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <small class="text-muted" v-if="isEditing">
                        Dejar en blanco para mantener la contraseña actual
                      </small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Confirmar Contraseña</label>
                      <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control" 
                        v-model="form.password_confirmation"
                        :required="!isEditing || form.password"
                        :disabled="isEditing && !form.password"
                      >
                    </div>
                    <div class="col-12">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="statusSwitch"
                          v-model="form.isActive"
                        >
                        <label class="form-check-label" for="statusSwitch">
                          {{ form.isActive ? 'Activo' : 'Inactivo' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Permissions Section -->
              <div class="mt-4">
                <h6 class="mb-3">Permisos</h6>
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="(permission, key) in availablePermissions" :key="key">
                    <div class="card h-100">
                      <div class="card-header bg-light py-2">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            :id="'permissionGroup' + key"
                            :checked="isPermissionGroupChecked(permission.permissions)"
                            @change="togglePermissionGroup(permission.permissions, $event)"
                          >
                          <label class="form-check-label fw-medium" :for="'permissionGroup' + key">
                            {{ permission.name }}
                          </label>
                        </div>
                      </div>
                      <div class="card-body p-2">
                        <div v-for="item in permission.permissions" :key="item.key" class="mb-2">
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              :id="'permission' + item.key"
                              :value="item.key"
                              v-model="form.permissions"
                            >
                            <label class="form-check-label small" :for="'permission' + item.key">
                              {{ item.label }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
              Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete ? userToDelete.name : '' }}</strong>?</p>
            <p class="mb-0">Esta acción no se puede deshacer y el usuario perderá el acceso al sistema.</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="deleteUser"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
// Import Bootstrap components
import { Modal, Dropdown } from 'bootstrap';

// Make Bootstrap available globally
const bootstrap = { Modal, Dropdown };
window.bootstrap = bootstrap;

export default {
  name: 'Users',
  setup() {
    // Refs
    const users = ref([]);
    const searchQuery = ref('');
    const statusFilter = ref('');
    const roleFilter = ref('');
    const selectedUsers = ref([]);
    const selectAll = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const showPassword = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const isDeleting = ref(false);
    const userToDelete = ref(null);
    const userModal = ref(null);
    const deleteModal = ref(null);
    const avatarInput = ref(null);
    
    // Form data
    const form = ref({
      id: null,
      name: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      address: '',
      role: 'user',
      password: '',
      password_confirmation: '',
      avatar: '',
      isActive: true,
      permissions: []
    });
    
    // Available roles
    const availableRoles = [
      { value: 'admin', label: 'Administrador' },
      { value: 'manager', label: 'Gerente' },
      { value: 'cashier', label: 'Cajero' },
      { value: 'inventory', label: 'Inventario' },
      { value: 'user', label: 'Usuario Estándar' }
    ];
    
    // Available permissions
    const availablePermissions = [
      {
        name: 'Ventas',
        permissions: [
          { key: 'sales.view', label: 'Ver Ventas' },
          { key: 'sales.create', label: 'Crear Ventas' },
          { key: 'sales.edit', label: 'Editar Ventas' },
          { key: 'sales.delete', label: 'Eliminar Ventas' },
          { key: 'sales.returns', label: 'Devoluciones' },
          { key: 'sales.discounts', label: 'Aplicar Descuentos' }
        ]
      },
      {
        name: 'Productos',
        permissions: [
          { key: 'products.view', label: 'Ver Productos' },
          { key: 'products.create', label: 'Crear Productos' },
          { key: 'products.edit', label: 'Editar Productos' },
          { key: 'products.delete', label: 'Eliminar Productos' },
          { key: 'products.categories', label: 'Gestionar Categorías' },
          { key: 'products.import', label: 'Importar Productos' },
          { key: 'products.export', label: 'Exportar Productos' }
        ]
      },
      {
        name: 'Clientes',
        permissions: [
          { key: 'customers.view', label: 'Ver Clientes' },
          { key: 'customers.create', label: 'Crear Clientes' },
          { key: 'customers.edit', label: 'Editar Clientes' },
          { key: 'customers.delete', label: 'Eliminar Clientes' },
          { key: 'customers.credit', label: 'Gestionar Créditos' },
          { key: 'customers.notes', label: 'Agregar Notas' }
        ]
      },
      {
        name: 'Usuarios',
        permissions: [
          { key: 'users.view', label: 'Ver Usuarios' },
          { key: 'users.create', label: 'Crear Usuarios' },
          { key: 'users.edit', label: 'Editar Usuarios' },
          { key: 'users.delete', label: 'Eliminar Usuarios' },
          { key: 'users.roles', label: 'Gestionar Roles' },
          { key: 'users.permissions', label: 'Gestionar Permisos' }
        ]
      },
      {
        name: 'Reportes',
        permissions: [
          { key: 'reports.sales', label: 'Reportes de Ventas' },
          { key: 'reports.inventory', label: 'Reportes de Inventario' },
          { key: 'reports.customers', label: 'Reportes de Clientes' },
          { key: 'reports.taxes', label: 'Reportes de Impuestos' },
          { key: 'reports.export', label: 'Exportar Reportes' }
        ]
      },
      {
        name: 'Configuración',
        permissions: [
          { key: 'settings.general', label: 'Configuración General' },
          { key: 'settings.taxes', label: 'Impuestos' },
          { key: 'settings.payment_methods', label: 'Métodos de Pago' },
          { key: 'settings.invoice', label: 'Facturación' },
          { key: 'settings.backup', label: 'Copia de Seguridad' },
          { key: 'settings.update', label: 'Actualizaciones' }
        ]
      }
    ];
    
    // Stats
    const stats = ref({
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      suspendedUsers: 0,
      newThisMonth: 0
    });
    
    // Computed properties
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = 
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.value.toLowerCase());
          
        const matchesStatus = !statusFilter.value || user.status === statusFilter.value;
        const matchesRole = !roleFilter.value || user.role === roleFilter.value;
        
        return matchesSearch && matchesStatus && matchesRole;
      });
    });
    
    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
    });
    
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredUsers.value.slice(start, end);
    });
    
    // Methods
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/users');
        // users.value = response.data;
        
        // Mock data for demonstration
        users.value = [
          {
            id: 1,
            name: 'Rober',
            lastName: 'Escobar',
            username: 'rescobar',
            email: 'rober.escobar@example.com',
            phone: '+56912345678',
            address: 'Av. Principal 123, Santiago',
            role: 'admin',
            avatar: `https://ui-avatars.com/api/?name=Rober+Perez&background=random`,
            status: 'active',
            lastLogin: new Date(Date.now() - 3600000 * 2), // 2 hours ago
            permissions: ['sales.view', 'sales.create', 'products.view', 'users.view']
          },
          {
            id: 2,
            name: 'María',
            lastName: 'González',
            username: 'mgonzalez',
            email: 'maria.gonzalez@example.com',
            phone: '+56987654321',
            address: 'Av. El Rosal 5450, Santiago',
            role: 'manager',
            avatar: `https://ui-avatars.com/api/?name=Maria+Gonzalez&background=random`,
            status: 'active',
            lastLogin: new Date(Date.now() - 86400000), // 1 day ago
            permissions: ['sales.view', 'sales.create', 'products.view', 'customers.view']
          },
          {
            id: 3,
            name: 'Carlos',
            lastName: 'López',
            username: 'clopez',
            email: 'carlos.lopez@example.com',
            phone: '+56955556666',
            address: 'Av. Siempreviva 742, Ñuñoa',
            role: 'cashier',
            avatar: `https://ui-avatars.com/api/?name=Carlos+Lopez&background=random`,
            status: 'inactive',
            lastLogin: new Date(Date.now() - 86400000 * 7), // 1 week ago
            permissions: ['sales.view', 'sales.create']
          },
          {
            id: 4,
            name: 'Ana',
            lastName: 'Martínez',
            username: 'amartinez',
            email: 'ana.martinez@example.com',
            phone: '+56999998888',
            address: 'Av. Apoquindo 4500, Las Condes',
            role: 'inventory',
            avatar: `https://ui-avatars.com/api/?name=Ana+Martinez&background=random`,
            status: 'suspended',
            lastLogin: new Date(Date.now() - 86400000 * 30), // 1 month ago
            permissions: ['products.view', 'products.edit']
          },
          {
            id: 5,
            name: 'Pedro',
            lastName: 'Sánchez',
            username: 'psanchez',
            email: 'pedro.sanchez@example.com',
            phone: '+56977776666',
            address: 'Av. Vitacura 3567, Vitacura',
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=Pedro+Sanchez&background=random`,
            status: 'active',
            lastLogin: new Date(Date.now() - 3600000 * 5), // 5 hours ago
            permissions: ['sales.view']
          },
          {
            id: 6,
            name: 'Laura',
            lastName: 'Ramírez',
            username: 'lramirez',
            email: 'laura.ramirez@example.com',
            phone: '+56944445555',
            address: 'Av. Tobalaba 1234, Providencia',
            role: 'cashier',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
            status: 'active',
            lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
            permissions: ['sales.view', 'sales.create', 'customers.view']
          },
          {
            id: 7,
            name: 'Roberto',
            lastName: 'Mendoza',
            username: 'rmendoza',
            email: 'roberto.mendoza@example.com',
            phone: '+56933332222',
            address: 'Av. Providencia 2150, Providencia',
            role: 'inventory',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            status: 'active',
            lastLogin: new Date(Date.now() - 86400000 * 2), // 2 days ago
            permissions: ['products.view', 'products.edit', 'products.categories']
          },
          {
            id: 8,
            name: 'Carolina',
            lastName: 'Rojas',
            username: 'crojas',
            email: 'carolina.rojas@example.com',
            phone: '+56922221111',
            address: 'Av. Las Condes 12345, Las Condes',
            role: 'manager',
            avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
            status: 'inactive',
            lastLogin: new Date(Date.now() - 86400000 * 14), // 2 weeks ago
            permissions: ['sales.view', 'products.view', 'customers.view', 'reports.sales']
          },
          {
            id: 9,
            name: 'Diego',
            lastName: 'Silva',
            username: 'dsilva',
            email: 'diego.silva@example.com',
            phone: '+56911110000',
            address: 'Av. Vitacura 4500, Vitacura',
            role: 'admin',
            avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
            status: 'active',
            lastLogin: new Date(), // Now
            permissions: ['sales.view', 'sales.create', 'products.view', 'products.create', 'users.view', 'users.create', 'reports.sales', 'settings.general']
          },
          {
            id: 10,
            name: 'Valentina',
            lastName: 'Muñoz',
            username: 'vmunoz',
            email: 'valentina.munoz@example.com',
            phone: '+56966667777',
            address: 'Av. Apoquindo 3472, Las Condes',
            role: 'cashier',
            avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
            status: 'active',
            lastLogin: new Date(Date.now() - 3600000 * 3), // 3 hours ago
            permissions: ['sales.view', 'sales.create', 'customers.view']
          }
        ];
        
        // Update stats
        updateStats();
      } catch (error) {
        console.error('Error fetching users:', error);
        // Show error toast/notification
      }
    };
    
    const updateStats = () => {
      stats.value.totalUsers = users.value.length;
      stats.value.activeUsers = users.value.filter(u => u.status === 'active').length;
      stats.value.inactiveUsers = users.value.filter(u => u.status === 'inactive').length;
      stats.value.suspendedUsers = users.value.filter(u => u.status === 'suspended').length;
      
      // Count new users this month (for demo purposes, we'll just use a random number)
      stats.value.newThisMonth = Math.floor(Math.random() * 5) + 1;
    };
    
    const deleteUser = async () => {
      if (!userToDelete.value) return;
      
      isDeleting.value = true;
      
      try {
        // In a real app, this would be an API call
        // await axios.delete(`/api/users/${userToDelete.value.id}`);
        
        // Remove user from the list
        users.value = users.value.filter(u => u.id !== userToDelete.value.id);
        
        // Update stats
        updateStats();
        
        // Close modal
        const modal = Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        // Show success message
        showToast('success', 'Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('error', 'Error al eliminar el usuario');
      } finally {
        isDeleting.value = false;
        userToDelete.value = null;
      }
    };
    
    const showToast = (type, message) => {
      // In a real app, you would use a toast notification library
      // For this example, we'll just use a simple alert
      alert(`${type.toUpperCase()}: ${message}`);
    };
    
    const formatDate = (date, format = 'long') => {
      if (!date) return '';
      
      const d = new Date(date);
      const options = {
        year: 'numeric',
        month: format === 'short' ? 'short' : 'long',
        day: 'numeric'
      };
      
      return d.toLocaleDateString('es-CL', options);
    };
    
    const formatTimeAgo = (date) => {
      if (!date) return '';
      
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
          return `Hace ${interval} ${unit}${interval === 1 ? '' : unit === 'mes' ? 'es' : 's'}`;
        }
      }
      
      return 'Hace unos segundos';
    };
    
    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      // Scroll to top of the table
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const resetFilters = () => {
      searchQuery.value = '';
      statusFilter.value = '';
      roleFilter.value = '';
      currentPage.value = 1;
    };
    
    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        role: 'user',
        password: '',
        password_confirmation: '',
        avatar: '',
        isActive: true,
        permissions: []
      };
    };
    
    const showUserModal = (user = null) => {
      if (user) {
        // Edit mode
        isEditing.value = true;
        form.value = {
          id: user.id,
          name: user.name,
          lastName: user.lastName || '',
          username: user.username,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          role: user.role,
          password: '',
          password_confirmation: '',
          avatar: user.avatar || '',
          isActive: user.status === 'active',
          permissions: [...(user.permissions || [])]
        };
      } else {
        // Add new user mode
        isEditing.value = false;
        resetForm();
      }
      
      // Show modal
      const modal = new Modal(document.getElementById('userModal'));
      modal.show();
    };
    
    const saveUser = async () => {
      // Validate required fields
      if (!form.value.name || !form.value.email || !form.value.username) {
        alert('Por favor complete los campos obligatorios');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.value.email)) {
        alert('Por favor ingrese un correo electrónico válido');
        return;
      }
      
      // Validate password on new user or password change
      if ((!isEditing.value || form.value.password) && form.value.password !== form.value.password_confirmation) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      // Validate password strength
      if (form.value.password && form.value.password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      
      isSaving.value = true;
      
      try {
        // In a real app, this would be an API call
        // const url = isEditing.value 
        //   ? `/api/users/${form.value.id}` 
        //   : '/api/users';
        // const method = isEditing.value ? 'put' : 'post';
        // 
        // const userData = {
        //   name: form.value.name,
        //   lastName: form.value.lastName,
        //   username: form.value.username,
        //   email: form.value.email,
        //   phone: form.value.phone,
        //   address: form.value.address,
        //   role: form.value.role,
        //   status: form.value.isActive ? 'active' : 'inactive',
        //   permissions: form.value.permissions
        // };
        // 
        // // Only include password if it's being changed
        // if (form.value.password) {
        //   userData.password = form.value.password;
        //   userData.password_confirmation = form.value.password_confirmation;
        // }
        // 
        // const response = await axios[method](url, userData);
        
        // For demo, update the local data
        const userData = {
          id: form.value.id || Date.now().toString(),
          name: form.value.name,
          lastName: form.value.lastName,
          username: form.value.username,
          email: form.value.email,
          phone: form.value.phone,
          address: form.value.address,
          role: form.value.role,
          status: form.value.isActive ? 'active' : 'inactive',
          avatar: form.value.avatar,
          permissions: form.value.permissions,
          createdAt: isEditing.value 
            ? users.value.find(u => u.id === form.value.id)?.createdAt || new Date().toISOString()
            : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (isEditing.value) {
          // Update existing user
          const index = users.value.findIndex(u => u.id === form.value.id);
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              ...userData
            };
          }
        } else {
          // Add new user
          const newUser = {
            id: Math.max(0, ...users.value.map(u => u.id)) + 1,
            name: form.value.name,
            lastName: form.value.lastName,
            username: form.value.username,
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address,
            role: form.value.role,
            avatar: form.value.avatar || '',
            status: form.value.isActive ? 'active' : 'inactive',
            lastLogin: null,
            permissions: [...form.value.permissions]
          };
          
          users.value.unshift(newUser);
        }
        
        // Update stats
        updateStats();
        
        // Show success message
        alert(`Usuario ${isEditing.value ? 'actualizado' : 'creado'} exitosamente`);
        
        // Hide modal
        const modal = Modal.getInstance(document.getElementById('userModal'));
        modal.hide();
        
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Ocurrió un error al guardar el usuario');
      } finally {
        isSaving.value = false;
      }
    };
    
    const confirmDeleteUser = (user) => {
      userToDelete.value = user;
      const modal = new Modal(document.getElementById('deleteModal'));
      modal.show();
    };
    
    const updateUserStatus = async (userId, status) => {
      try {
        // In a real app, this would be an API call
        // await axios.patch(`/api/users/${userId}/status`, { status });
        
        // For demo, we'll just update the local data
        const user = users.value.find(u => u.id === userId);
        if (user) {
          user.status = status;
          
          // Update stats
          updateStats();
          
          // Show success message
          alert(`Usuario ${getStatusName(status)} exitosamente`);
        }
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Ocurrió un error al actualizar el estado del usuario');
      }
    };
    
    const toggleSelectAll = (event) => {
      if (event.target.checked) {
        selectedUsers.value = paginatedUsers.value.map(user => user.id);
      } else {
        selectedUsers.value = [];
      }
    };
    
    const updateSelectAll = () => {
      selectAll.value = selectedUsers.value.length === paginatedUsers.value.length;
    };
    
    const triggerFileUpload = () => {
      avatarInput.value.click();
    };
    
    const handleAvatarUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }
      
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no puede ser mayor a 2MB');
        return;
      }
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    const isPermissionGroupChecked = (permissions) => {
      return permissions.every(p => form.value.permissions.includes(p.key));
    };
    
    const togglePermissionGroup = (permissions, event) => {
      const isChecked = event.target.checked;
      const permissionKeys = permissions.map(p => p.key);
      
      if (isChecked) {
        // Add all permissions in the group that aren't already there
        permissionKeys.forEach(key => {
          if (!form.value.permissions.includes(key)) {
            form.value.permissions.push(key);
          }
        });
      } else {
        // Remove all permissions in the group
        form.value.permissions = form.value.permissions.filter(
          p => !permissionKeys.includes(p)
        );
      }
    };
    
    const getRoleName = (role) => {
      const roleObj = availableRoles.find(r => r.value === role);
      return roleObj ? roleObj.label : role;
    };
    
    const getRoleBadgeClass = (role) => {
      const classes = {
        'admin': 'bg-danger bg-opacity-10 text-danger',
        'manager': 'bg-warning bg-opacity-10 text-warning',
        'cashier': 'bg-info bg-opacity-10 text-info',
        'inventory': 'bg-primary bg-opacity-10 text-primary',
        'user': 'bg-secondary bg-opacity-10 text-secondary'
      };
      return classes[role] || 'bg-light text-dark';
    };
    
    const getStatusName = (status) => {
      const statuses = {
        'active': 'Activo',
        'inactive': 'Inactivo',
        'suspended': 'Suspendido'
      };
      return statuses[status] || status;
    };
    
    const getStatusBadgeClass = (status) => {
      const classes = {
        'active': 'bg-success bg-opacity-10 text-success',
        'inactive': 'bg-warning bg-opacity-10 text-warning',
        'suspended': 'bg-danger bg-opacity-10 text-danger'
      };
      return classes[status] || 'bg-light text-dark';
    };
    
    // Initialize dropdown
    const initDropdown = (event) => {
      const button = event.currentTarget;
      const dropdown = new Dropdown(button);
      dropdown.show();
    };

    // Hide dropdown after action
    const hideDropdown = (event) => {
      const dropdownElement = event.target.closest('.dropdown');
      if (dropdownElement) {
        const button = dropdownElement.querySelector('.dropdown-toggle');
        if (button) {
          const dropdown = Dropdown.getInstance(button);
          if (dropdown) {
            dropdown.hide();
          }
        }
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Initialize modals
      userModal.value = new Modal(document.getElementById('userModal'));
      deleteModal.value = new Modal(document.getElementById('deleteModal'));
      
      // Fetch users
      fetchUsers();
      
      // Initialize dropdowns after content is loaded
      nextTick(() => {
        const dropdownElements = document.querySelectorAll('.dropdown-toggle');
        dropdownElements.forEach(el => {
          new Dropdown(el);
        });
      });
    });
    
    // Watch for changes to filters
    watch([searchQuery, statusFilter, roleFilter], () => {
      currentPage.value = 1;
      selectAll.value = false;
      selectedUsers.value = [];
    });
    
    // Watch for changes to items per page
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    
    return {
      // Refs
      users,
      searchQuery,
      statusFilter,
      roleFilter,
      selectedUsers,
      selectAll,
      currentPage,
      itemsPerPage,
      showPassword,
      isEditing,
      isSaving,
      isDeleting,
      userToDelete,
      form,
      availableRoles,
      availablePermissions,
      stats,
      filteredUsers,
      totalPages,
      paginatedUsers,
      avatarInput,
      
      // Methods
      fetchUsers,
      showUserModal,
      saveUser,
      confirmDeleteUser,
      deleteUser,
      updateUserStatus,
      toggleSelectAll,
      updateSelectAll,
      changePage,
      resetFilters,
      triggerFileUpload,
      handleAvatarUpload,
      isPermissionGroupChecked,
      togglePermissionGroup,
      formatDate,
      formatTimeAgo,
      getRoleName,
      getRoleBadgeClass,
      getStatusName,
      getStatusBadgeClass,
      initDropdown,
      hideDropdown
    };
  }
};
</script>

<style scoped>
.users-management {
  padding: 1.5rem;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 1.25rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #6c757d;
  border-top: none;
  border-bottom: 1px solid #e9ecef;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
  border-radius: 0.25rem;
}

/* Dropdown menu */
.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.dropdown-item i {
  width: 1.25rem;
  text-align: center;
  margin-right: 0.5rem;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Pagination */
.pagination {
  margin-bottom: 0;
}

.page-link {
  border: none;
  color: #6c757d;
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem !important;
  min-width: 2.25rem;
  text-align: center;
}

.page-item.active .page-link {
  background-color: #4361ee;
  border-color: #4361ee;
}

.page-link:hover {
  background-color: #f8f9fa;
  color: #4361ee;
}

.page-item.disabled .page-link {
  color: #dee2e6;
  background-color: transparent;
}

/* Modal */
.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
}

.modal-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
}

/* Form controls */
.form-control, .form-select {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
}

.form-control:focus, .form-select:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.15);
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #6c757d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .users-management {
    padding: 1rem 0.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}

/* Animation for status change */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active {
  animation: fadeIn 0.3s ease-in-out;
}

.fade-leave-active {
  animation: fadeIn 0.3s ease-in-out reverse;
}
</style>
