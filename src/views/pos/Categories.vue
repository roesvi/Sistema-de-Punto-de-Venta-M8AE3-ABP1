<template>
  <div class="categories-management">
    <div class="container-fluid">
      <!-- Header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">Categorías</h2>
          <p class="text-muted mb-0">Administra las categorías de productos</p>
        </div>
        <button class="btn btn-primary" @click="showAddCategoryModal = true">
          <i class="bi bi-plus-lg me-1"></i> Nueva Categoría
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <!-- Add New Category Card -->
        <div class="col">
          <div class="card h-100 border-dashed" @click="showAddCategoryModal = true" style="cursor: pointer;">
            <div class="card-body d-flex flex-column align-items-center justify-content-center text-center p-5">
              <div class="bg-light rounded-circle p-3 mb-3">
                <i class="bi bi-plus-lg text-primary" style="font-size: 1.5rem;"></i>
              </div>
              <h5 class="mb-0">Agregar Categoría</h5>
            </div>
          </div>
        </div>

        <!-- Category Cards -->
        <div class="col" v-for="category in filteredCategories" :key="category.id">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center">
                  <div class="category-icon me-3" :style="{ backgroundColor: category.color + '20', color: category.color }">
                    <i :class="category.icon || 'bi-tag'"></i>
                  </div>
                  <div>
                    <h5 class="mb-0">{{ category.name }}</h5>
                    <small class="text-muted">{{ getProductCount(category.id) }} productos</small>
                  </div>
                </div>
                <div class="dropdown">
                  <button class="btn btn-link text-muted p-0" type="button" @click.stop="toggleDropdown(category.id)">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu" :class="{ show: activeDropdown === category.id }">
                    <li><a class="dropdown-item" href="#" @click.stop="editCategory(category)"><i class="bi bi-pencil me-2"></i>Editar</a></li>
                    <li><a class="dropdown-item" href="#" @click.stop="confirmDelete(category)"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                  </ul>
                </div>
              </div>
              <div class="progress mb-2" style="height: 4px;">
                <div class="progress-bar" :style="{ width: getCategoryUsage(category.id) + '%', backgroundColor: category.color }"></div>
              </div>
              <div class="d-flex justify-content-between small text-muted">
                <span>{{ getActiveProducts(category.id) }} activos</span>
                <span>{{ getInactiveProducts(category.id) }} inactivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div class="modal fade" :class="{ 'show d-block': showAddCategoryModal }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre de la categoría <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="currentCategory.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" rows="2" v-model="currentCategory.description"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div 
                      v-for="color in colorOptions" 
                      :key="color"
                      class="color-option" 
                      :style="{ backgroundColor: color }"
                      :class="{ 'selected': currentCategory.color === color }"
                      @click="currentCategory.color = color"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Ícono</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div 
                      v-for="icon in iconOptions" 
                      :key="icon"
                      class="icon-option"
                      :class="{ 'selected': currentCategory.icon === icon }"
                      @click="currentCategory.icon = icon"
                    >
                      <i :class="icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveCategory">
              {{ editingCategory ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddCategoryModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Categories',
  setup() {
    // Sample data - in a real app, this would come from an API
    const categories = ref([
      { 
        id: 1, 
        name: 'Electrónicos', 
        description: 'Dispositivos electrónicos y accesorios',
        color: '#4361ee',
        icon: 'bi-laptop',
        createdAt: new Date()
      },
      { 
        id: 2, 
        name: 'Ropa', 
        description: 'Ropa y accesorios de moda',
        color: '#f72585',
        icon: 'bi-tshirt',
        createdAt: new Date()
      },
      { 
        id: 3, 
        name: 'Hogar', 
        description: 'Artículos para el hogar',
        color: '#4cc9f0',
        icon: 'bi-house',
        createdAt: new Date()
      },
      { 
        id: 4, 
        name: 'Deportes', 
        description: 'Artículos deportivos',
        color: '#4ad66d',
        icon: 'bi-bicycle',
        createdAt: new Date()
      },
    ]);

    // Sample products data to calculate category usage
    const products = ref([
      { id: 1, name: 'Laptop', categoryId: 1, active: true },
      { id: 2, name: 'Smartphone', categoryId: 1, active: true },
      { id: 3, name: 'Camiseta', categoryId: 2, active: true },
      { id: 4, name: 'Pantalón', categoryId: 2, active: false },
      { id: 5, name: 'Sofá', categoryId: 3, active: true },
      { id: 6, name: 'Mesa', categoryId: 3, active: true },
      { id: 7, name: 'Balón de fútbol', categoryId: 4, active: true },
    ]);

    const showAddCategoryModal = ref(false);
    const editingCategory = ref(null);
    const activeDropdown = ref(null);
    const searchQuery = ref('');

    const colorOptions = [
      '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#4ad66d',
      '#b5179e', '#f72585', '#7209b7', '#560bad', '#480ca8'
    ];

    const iconOptions = [
      'bi-tag', 'bi-laptop', 'bi-phone', 'bi-headphones', 'bi-tshirt',
      'bi-basket', 'bi-house', 'bi-bicycle', 'bi-book', 'bi-cup-straw'
    ];

    const currentCategory = ref({
      name: '',
      description: '',
      color: '#4361ee',
      icon: 'bi-tag'
    });

    const filteredCategories = computed(() => {
      if (!searchQuery.value) return categories.value;
      const query = searchQuery.value.toLowerCase();
      return categories.value.filter(category =>
        category.name.toLowerCase().includes(query) ||
        (category.description && category.description.toLowerCase().includes(query))
      );
    });

    const getProductCount = (categoryId) => {
      return products.value.filter(p => p.categoryId === categoryId).length;
    };

    const getActiveProducts = (categoryId) => {
      return products.value.filter(p => p.categoryId === categoryId && p.active).length;
    };

    const getInactiveProducts = (categoryId) => {
      return products.value.filter(p => p.categoryId === categoryId && !p.active).length;
    };

    const getCategoryUsage = (categoryId) => {
      const totalProducts = products.value.length;
      if (totalProducts === 0) return 0;
      return Math.round((getProductCount(categoryId) / totalProducts) * 100);
    };

    const toggleDropdown = (categoryId) => {
      activeDropdown.value = activeDropdown.value === categoryId ? null : categoryId;
    };

    const closeModal = () => {
      showAddCategoryModal.value = false;
      editingCategory.value = null;
      currentCategory.value = {
        name: '',
        description: '',
        color: '#4361ee',
        icon: 'bi-tag'
      };
    };

    const addNewCategory = () => {
      editingCategory.value = null;
      currentCategory.value = {
        name: '',
        description: '',
        color: '#4361ee',
        icon: 'bi-tag'
      };
      showAddCategoryModal.value = true;
    };

    const editCategory = (category) => {
      editingCategory.value = category.id;
      currentCategory.value = { ...category };
      showAddCategoryModal.value = true;
    };

    const saveCategory = () => {
      if (!currentCategory.value.name) {
        alert('Por favor ingrese un nombre para la categoría');
        return;
      }

      if (editingCategory.value) {
        // Update existing category
        const index = categories.value.findIndex(c => c.id === editingCategory.value);
        if (index !== -1) {
          categories.value[index] = { ...currentCategory.value };
        }
      } else {
        // Add new category
        const newId = Math.max(0, ...categories.value.map(c => c.id)) + 1;
        categories.value.push({
          ...currentCategory.value,
          id: newId,
          createdAt: new Date()
        });
      }
      closeModal();
    };

    const confirmDelete = (category) => {
      if (getProductCount(category.id) > 0) {
        alert('No se puede eliminar una categoría que tiene productos asociados');
        return;
      }

      if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
        categories.value = categories.value.filter(c => c.id !== category.id);
      }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        activeDropdown.value = null;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });

    return {
      // Data
      categories,
      showAddCategoryModal,
      editingCategory,
      currentCategory,
      searchQuery,
      colorOptions,
      iconOptions,
      activeDropdown,
      
      // Computed
      filteredCategories,
      
      // Methods
      getProductCount,
      getActiveProducts,
      getInactiveProducts,
      getCategoryUsage,
      toggleDropdown,
      addNewCategory,
      editCategory,
      saveCategory,
      confirmDelete,
      closeModal
    };
  }
};
</script>

<style scoped>
.categories-management {
  padding: 1.5rem;
}

.border-dashed {
  border: 2px dashed #dee2e6;
  transition: all 0.2s;
}

.border-dashed:hover {
  border-color: #4361ee;
  background-color: #f8f9ff;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #000;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4361ee;
}

.icon-option {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-option:hover {
  background-color: #e9ecef;
}

.icon-option.selected {
  background-color: #4361ee;
  color: white;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  display: none;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}

.dropdown-item:hover {
  color: #1e2125;
  background-color: #e9ecef;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .categories-management {
    padding: 1rem 0.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style>
