<template>
  <div class="products-management">
    <div class="container-fluid">
      <!-- Header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <div>
          <button class="btn btn-primary me-2" @click="showAddProductModal = true">
            <i class="bi bi-plus-lg me-1"></i> Nuevo Producto
          </button>
          <button class="btn btn-outline-secondary">
            <i class="bi bi-upload me-1"></i> Importar
          </button>
        </div>
      </div>

      <!-- Filters -->
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
                  placeholder="Buscar productos..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Categoría</label>
              <select class="form-select" v-model="filters.category">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
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
                <i class="bi bi-arrow-counterclockwise me-1"></i> Restablecer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th class="text-end">Precio</th>
                  <th class="text-center">Stock</th>
                  <th class="text-center">Estado</th>
                  <th class="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="6" class="text-center py-4">
                    <div class="text-muted">
                      <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                      <p class="mt-2 mb-0">No se encontraron productos</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="product in paginatedProducts" :key="product.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="product-image me-3">
                        <img 
                          :src="product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMi41Ij48L2NpcmNsZT48cGF0aCBkPSJNMjEgMTVhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRsMTQtN3oiPjwvcGF0aD48L3N2Zz4='" 
                          :alt="product.name"
                          class="rounded"
                        >
                      </div>
                      <div>
                        <h6 class="mb-0">{{ product.name }}</h6>
                        <small class="text-muted">SKU: {{ product.sku || 'N/A' }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ getCategoryName(product.categoryId) }}</td>
                  <td class="text-end">${{ formatPrice(product.price) }}</td>
                  <td class="text-center">
                    <span :class="{'text-danger': product.stock <= product.lowStockThreshold}">
                      {{ product.stock }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span :class="getStatusClass(product)" class="badge">
                      {{ product.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="editProduct(product)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-secondary" @click="viewProduct(product)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(product)">
                        <i class="bi bi-trash"></i>
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
              Mostrando {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length) }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} de 
              {{ filteredProducts.length }} productos
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

    <!-- Add/Edit Product Modal -->
    <div class="modal fade" :class="{ 'show d-block': showAddProductModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">Nombre del Producto <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="currentProduct.name" required>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Precio <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" class="form-control" v-model.number="currentProduct.price" min="0" step="0.01" required>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Categoría <span class="text-danger">*</span></label>
                      <select class="form-select" v-model="currentProduct.categoryId" required>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" rows="3" v-model="currentProduct.description"></textarea>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Imagen del Producto</label>
                  <div class="border rounded p-3 text-center">
                    <img 
                      :src="currentProduct.image || `https://ui-avatars.com/api/?name=${currentProduct.name ? encodeURIComponent(currentProduct.name) : 'P'}&background=random`"
                      class="img-fluid mb-2" 
                      style="max-height: 150px;"
                    >
                    <input type="file" class="form-control" @change="handleImageUpload">
                  </div>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="currentProduct.active" id="activeSwitch">
                  <label class="form-check-label" for="activeSwitch">
                    {{ currentProduct.active ? 'Activo' : 'Inactivo' }}
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Cantidad en Stock</label>
                  <input type="number" class="form-control" v-model.number="currentProduct.stock" min="0">
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Stock Mínimo</label>
                  <input type="number" class="form-control" v-model.number="currentProduct.lowStockThreshold" min="1">
                  <small class="text-muted">Alerta cuando el stock esté por debajo de este número</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">SKU</label>
                  <input type="text" class="form-control" v-model="currentProduct.sku">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveProduct">
              {{ editingProduct ? 'Actualizar Producto' : 'Agregar Producto' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddProductModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Products',
  setup() {
    // Sample data - in a real app, this would come from an API
    const products = ref([
      {
        id: 1,
        name: 'Producto de Ejemplo',
        sku: 'PROD001',
        description: 'Descripción del producto de ejemplo',
        price: 9990000,
        stock: 15,
        lowStockThreshold: 5,
        categoryId: 1,
        image: '',
        active: true
      }
    ]);

    const categories = ref([
      { id: 1, name: 'Electrónicos' },
      { id: 2, name: 'Ropa' },
      { id: 3, name: 'Hogar' },
      { id: 4, name: 'Deportes' },
    ]);

    const filters = ref({
      search: '',
      category: '',
      status: ''
    });

    const showAddProductModal = ref(false);
    const editingProduct = ref(null);
    const currentProduct = ref({
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      lowStockThreshold: 5,
      categoryId: 1,
      image: '',
      active: true
    });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        // Filter by search term
        const matchesSearch = !filters.value.search || 
          product.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          (product.sku && product.sku.toLowerCase().includes(filters.value.search.toLowerCase()));
        
        // Filter by category
        const matchesCategory = !filters.value.category || 
          product.categoryId === parseInt(filters.value.category);
        
        // Filter by status
        let matchesStatus = true;
        if (filters.value.status === 'active') {
          matchesStatus = product.active === true;
        } else if (filters.value.status === 'inactive') {
          matchesStatus = product.active === false;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      });
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(cat => cat.id === categoryId);
      return category ? category.name : 'Sin categoría';
    };

    const getStatusClass = (product) => {
      return product.active ? 'bg-success' : 'bg-secondary';
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CL').format(price);
    };

    const resetFilters = () => {
      filters.value = {
        search: '',
        category: '',
        status: ''
      };
      currentPage.value = 1;
    };

    const addNewProduct = () => {
      editingProduct.value = null;
      currentProduct.value = {
        name: '',
        sku: '',
        description: '',
        price: 0,
        stock: 0,
        lowStockThreshold: 5,
        categoryId: 1,
        image: '',
        active: true
      };
      showAddProductModal.value = true;
    };

    const editProduct = (product) => {
      editingProduct.value = product.id;
      currentProduct.value = { ...product };
      showAddProductModal.value = true;
    };

    const viewProduct = (product) => {
      // In a real app, this would navigate to a product detail page
      console.log('View product:', product);
    };

    const confirmDelete = (product) => {
      if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
        products.value = products.value.filter(p => p.id !== product.id);
      }
    };

    const saveProduct = () => {
      if (!currentProduct.value.name || !currentProduct.value.price) {
        alert('Por favor complete los campos requeridos');
        return;
      }

      if (editingProduct.value) {
        // Update existing product
        const index = products.value.findIndex(p => p.id === editingProduct.value);
        if (index !== -1) {
          products.value[index] = { ...currentProduct.value };
        }
      } else {
        // Add new product
        const newId = Math.max(0, ...products.value.map(p => p.id)) + 1;
        products.value.push({
          ...currentProduct.value,
          id: newId
        });
      }
      closeModal();
    };

    const closeModal = () => {
      showAddProductModal.value = false;
      editingProduct.value = null;
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          currentProduct.value.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    return {
      // Data
      products,
      categories,
      filters,
      showAddProductModal,
      editingProduct,
      currentProduct,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredProducts,
      paginatedProducts,
      totalPages,
      
      // Methods
      getCategoryName,
      getStatusClass,
      formatPrice,
      resetFilters,
      addNewProduct,
      editProduct,
      viewProduct,
      confirmDelete,
      saveProduct,
      closeModal,
      handleImageUpload
    };
  }
};
</script>

<style scoped>
.products-management {
  padding: 1.5rem;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.product-image img {
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
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.modal {
  z-index: 1060;
}

.modal-backdrop {
  z-index: 1055;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .products-management {
    padding: 1rem 0.5rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }
}
</style>
