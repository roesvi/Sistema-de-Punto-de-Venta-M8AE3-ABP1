<template>
  <div class="pos-container">
    <div class="row g-3">
      <!-- Products Grid -->
      <div class="col-lg-8">
        <div class="card h-100">
          <div class="card-header bg-white border-bottom-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Productos</h5>
              <div class="d-flex">
                <div class="input-group input-group-sm me-2" style="max-width: 300px;">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-search"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control border-start-0" 
                    placeholder="Buscar productos..."
                    v-model="searchQuery"
                    @input="filterProducts"
                  >
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="showCategories = !showCategories">
                  <i class="bi bi-funnel"></i> Categorías
                </button>
              </div>
            </div>
            
            <!-- Categories Filter -->
            <div v-if="showCategories" class="mt-3">
              <div class="d-flex flex-wrap gap-2">
                <button 
                  v-for="category in categories" 
                  :key="category.id"
                  class="btn btn-sm"
                  :class="{ 'btn-primary': selectedCategory === category.id, 'btn-outline-secondary': selectedCategory !== category.id }"
                  @click="selectCategory(category.id)"
                >
                  {{ category.name }}
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="clearCategoryFilter"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body p-0">
            <div v-if="filteredProducts.length === 0" class="text-center py-5">
              <div class="text-muted">
                <i class="bi bi-search" style="font-size: 3rem;"></i>
                <p class="mt-3">No se encontraron productos</p>
              </div>
            </div>
            
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 p-2" v-else>
              <div class="col" v-for="product in filteredProducts" :key="product.id">
                <div 
                  class="product-card card h-100 border-0 shadow-sm"
                  @click="addToCart(product)"
                >
                  <div class="position-relative">
                    <img 
                      :src="product.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'P')}&background=random`"
                      class="card-img-top" 
                      :alt="product.name"
                      style="height: 120px; object-fit: cover;"
                    >
                    <div class="position-absolute top-0 end-0 m-2">
                      <span class="badge bg-success">${{ formatPrice(product.price) }}</span>
                    </div>
                    <div v-if="product.stock <= 5" class="position-absolute bottom-0 start-0 w-100 bg-warning text-dark text-center p-1" style="font-size: 0.7rem;">
                      {{ product.stock }} en stock
                    </div>
                  </div>
                  <div class="card-body p-2">
                    <h6 class="card-title mb-1 text-truncate" :title="product.name">{{ product.name }}</h6>
                    <p class="card-text small text-muted mb-0">{{ product.category?.name || 'Sin categoría' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-3 mb-3">
              <ul class="pagination pagination-sm">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="changePage(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li 
                  v-for="page in totalPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="changePage(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-header bg-white border-bottom-0">
            <h5 class="mb-0">Orden Actual</h5>
          </div>
          
          <div class="card-body p-0 d-flex flex-column" style="height: 75vh; max-height: 80vh;">
            <!-- Customer Selection -->
            <div class="p-3 border-bottom">
              <div class="input-group input-group-sm mb-2">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-person"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Cliente"
                  v-model="customerSearch"
                  @focus="showCustomerDropdown = true"
                >
                <button class="btn btn-outline-secondary" type="button" @click="addNewCustomer">
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
              
              <!-- Customer Dropdown -->
              <div v-if="showCustomerDropdown" class="position-relative">
                <div class="dropdown-menu d-block position-static mt-1 w-100" style="z-index: 1060;">
                  <div class="p-2">
                    <div 
                      v-for="customer in filteredCustomers" 
                      :key="customer.id" 
                      class="dropdown-item cursor-pointer"
                      @click="selectCustomer(customer)"
                    >
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <div class="fw-semibold">{{ customer.name }}</div>
                          <small class="text-muted">{{ customer.email || 'Sin correo' }}</small>
                        </div>
                        <small class="text-muted">{{ customer.phone || 'Sin teléfono' }}</small>
                      </div>
                    </div>
                    <div v-if="filteredCustomers.length === 0" class="text-center py-2 text-muted">
                      <small>No se encontraron clientes</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Items -->
            <div class="flex-grow-1 overflow-auto p-3" style="max-height: 300px;">
              <div v-if="cart.length === 0" class="text-center py-5">
                <div class="text-muted">
                  <i class="bi bi-cart-x" style="font-size: 2rem;"></i>
                  <p class="mt-2 mb-0">El carrito está vacío</p>
                  <small>Agrega productos para comenzar</small>
                </div>
              </div>
              
              <div v-else>
                <div v-for="item in cart" :key="item.id" class="mb-2">
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 class="mb-0">{{ item.name }}</h6>
                          <small class="text-muted">${{ formatPrice(item.price) }} c/u</small>
                        </div>
                        <div class="text-end">
                          <div class="d-flex align-items-center">
                            <button 
                              class="btn btn-sm btn-outline-secondary py-0 px-2"
                              @click.stop="updateQuantity(item.id, item.quantity - 1)"
                              :disabled="item.quantity <= 1"
                            >
                              <i class="bi bi-dash"></i>
                            </button>
                            <input 
                              type="number" 
                              class="form-control form-control-sm text-center mx-1" 
                              style="width: 50px;" 
                              v-model.number="item.quantity"
                              min="1"
                              @change="updateQuantity(item.id, item.quantity)"
                            >
                            <button 
                              class="btn btn-sm btn-outline-secondary py-0 px-2"
                              @click.stop="updateQuantity(item.id, item.quantity + 1)"
                            >
                              <i class="bi bi-plus"></i>
                            </button>
                            <button 
                              class="btn btn-sm btn-outline-danger ms-2"
                              @click.stop="removeFromCart(item.id)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                          <div class="mt-1 text-end fw-bold">
                            ${{ formatPrice(item.price * item.quantity) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="border-top p-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${{ formatPrice(subtotal) }}</span>
              </div>
              <div class="input-group input-group-sm mb-2">
                <span class="input-group-text">Descuento</span>
                <input 
                  type="number" 
                  class="form-control text-end" 
                  v-model.number="discount"
                  min="0"
                  :max="subtotal"
                  step="0.01"
                >
                <span class="input-group-text">$</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>IVA (19%):</span>
                <span>${{ formatPrice(tax) }}</span>
              </div>
              <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total:</span>
                <span>${{ formatPrice(total) }}</span>
              </div>
              
              <!-- Payment Buttons -->
              <div class="row g-2 mb-2">
                <div class="col-6">
                  <button 
                    class="btn btn-success w-100"
                    :disabled="cart.length === 0"
                    @click="processPayment('cash')"
                  >
                    <i class="bi bi-cash-coin me-2"></i> Efectivo
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    class="btn btn-primary w-100"
                    :disabled="cart.length === 0"
                    @click="processPayment('card')"
                  >
                    <i class="bi bi-credit-card me-2"></i> Tarjeta
                  </button>
                </div>
              </div>
              <div class="d-grid">
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  :disabled="cart.length === 0"
                  @click="clearCart"
                >
                  <i class="bi bi-x-circle me-1"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Pago con {{ paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="paymentMethod === 'cash'">
              <div class="mb-3">
                <label class="form-label">Total a pagar</label>
                <input type="text" class="form-control form-control-lg text-end fw-bold" :value="'$' + formatPrice(total)" disabled>
              </div>
              <div class="mb-3">
                <label class="form-label">Recibido</label>
                <input 
                  type="number" 
                  class="form-control form-control-lg text-end" 
                  v-model.number="amountReceived"
                  @input="calculateChange"
                  step="0.01"
                  min="0"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Cambio</label>
                <input 
                  type="text" 
                  class="form-control form-control-lg text-end fw-bold" 
                  :class="{ 'text-success': change >= 0, 'text-danger': change < 0 }"
                  :value="change >= 0 ? '$' + formatPrice(change) : 'Faltan $' + formatPrice(Math.abs(change))"
                  disabled
                >
              </div>
            </div>
            
            <div v-else>
              <div class="mb-3">
                <label class="form-label">Número de tarjeta</label>
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="1234 5678 9012 3456">
                  <span class="input-group-text">
                    <i class="bi bi-credit-card"></i>
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vencimiento</label>
                  <input type="text" class="form-control" placeholder="MM/AA">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">CVV</label>
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="123">
                    <span class="input-group-text">
                      <i class="bi bi-shield-lock"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Titular de la tarjeta</label>
                <input type="text" class="form-control" placeholder="Nombre como aparece en la tarjeta">
              </div>
              <div class="alert alert-info mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Se realizará un cargo por ${{ formatPrice(total) }} a su tarjeta.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary"
              :disabled="paymentMethod === 'cash' && change < 0"
              @click="completeSale"
            >
              <i class="bi bi-check2-circle me-1"></i> Confirmar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores';
import { Modal } from 'bootstrap';

export default {
  name: 'PointOfSale',
  setup() {
    const router = useRouter();
    const appStore = useAppStore();
    
    // State
    const searchQuery = ref('');
    const showCategories = ref(false);
    const selectedCategory = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 12;
    
    // Customer state
    const customerSearch = ref('');
    const selectedCustomer = ref(null);
    const showCustomerDropdown = ref(false);
    
    // Payment state
    const paymentMethod = ref('cash');
    const discount = ref(0);
    const amountReceived = ref(0);
    const change = ref(0);
    let paymentModal = null;
    
    // Sample data - In a real app, this would come from an API
    const products = ref([
      { id: 1, name: 'Laptop HP 15-dw1001la', price: 1299990, stock: 15, category: { id: 1, name: 'Tecnología' } },
      { id: 2, name: 'Mouse Inalámbrico Logitech', price: 29990, stock: 42, category: { id: 1, name: 'Tecnología' } },
      { id: 3, name: 'Teclado Mecánico RGB', price: 89990, stock: 23, category: { id: 1, name: 'Tecnología' } },
      { id: 4, name: 'Monitor 24\" Full HD', price: 199990, stock: 8, category: { id: 1, name: 'Tecnología' } },
      { id: 5, name: 'Impresora Multifuncional', price: 149990, stock: 12, category: { id: 1, name: 'Tecnología' } },
      { id: 6, name: 'Audífonos Bluetooth', price: 59990, stock: 30, category: { id: 2, name: 'Audio' } },
      { id: 7, name: 'Parlante Portátil', price: 79990, stock: 18, category: { id: 2, name: 'Audio' } },
      { id: 8, name: 'Disco Duro Externo 1TB', price: 69990, stock: 5, category: { id: 1, name: 'Tecnología' } },
      { id: 9, name: 'Webcam HD', price: 49990, stock: 25, category: { id: 1, name: 'Tecnología' } },
      { id: 10, name: 'Mouse Pad Grande', price: 12990, stock: 50, category: { id: 1, name: 'Tecnología' } },
      { id: 11, name: 'Silla Gamer', price: 249990, stock: 7, category: { id: 3, name: 'Muebles' } },
      { id: 12, name: 'Escritorio para Computadora', price: 179990, stock: 4, category: { id: 3, name: 'Muebles' } },
    ]);
    
    const categories = ref([
      { id: 1, name: 'Tecnología' },
      { id: 2, name: 'Audio' },
      { id: 3, name: 'Muebles' },
      { id: 4, name: 'Oficina' },
      { id: 5, name: 'Accesorios' },
    ]);
    
    const customers = ref([
      { id: 1, name: 'Cliente General', email: '', phone: '' },
      { id: 2, name: 'Roberto Escobar', email: 'rober@example.com', phone: '+56 9 1234 5678' },
      { id: 3, name: 'María González', email: 'maria@example.com', phone: '+56 9 8765 4321' },
      { id: 4, name: 'Empresa XYZ S.A.', email: 'contacto@empresa.cl', phone: '+56 2 2345 6789' },
    ]);
    
    // Computed properties
    const filteredProducts = computed(() => {
      let result = [...products.value];
      
      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          (p.category?.name || '').toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (selectedCategory.value) {
        result = result.filter(p => p.category?.id === selectedCategory.value);
      }
      
      return result;
    });
    
    const filteredCustomers = computed(() => {
      if (!customerSearch.value) {
        return customers.value.slice(0, 5);
      }
      
      const query = customerSearch.value.toLowerCase();
      return customers.value.filter(c => 
        c.name.toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query) ||
        (c.phone || '').includes(query)
      ).slice(0, 5);
    });
    
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredProducts.value.slice(start, end);
    });
    
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage);
    });
    
    const cart = computed(() => appStore.cart);
    
    const subtotal = computed(() => {
      return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0) - discount.value;
    });
    
    const taxRate = 0.19; // 19%
    const tax = computed(() => {
      return subtotal.value * taxRate;
    });
    
    const total = computed(() => {
      return subtotal.value + tax.value;
    });
    
    // Methods
    const filterProducts = () => {
      currentPage.value = 1; // Reset to first page when filtering
    };
    
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
      currentPage.value = 1;
      showCategories.value = false;
    };
    
    const clearCategoryFilter = () => {
      selectedCategory.value = null;
      currentPage.value = 1;
    };
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };
    
    const selectCustomer = (customer) => {
      selectedCustomer.value = customer;
      customerSearch.value = customer.name;
      showCustomerDropdown.value = false;
    };
    
    const addNewCustomer = () => {
      // In a real app, this would open a modal to add a new customer
      const newCustomer = {
        id: customers.value.length + 1,
        name: customerSearch.value,
        email: '',
        phone: ''
      };
      
      customers.value.unshift(newCustomer);
      selectCustomer(newCustomer);
      
      // Show success message
      appStore.addNotification({
        type: 'success',
        message: 'Cliente agregado correctamente',
        read: false
      });
    };
    
    const addToCart = (product) => {
      appStore.addToCart(product);
    };
    
    const updateQuantity = (productId, quantity) => {
      if (quantity < 1) quantity = 1;
      
      // Find the product to check stock
      const product = products.value.find(p => p.id === productId);
      if (product && quantity > product.stock) {
        quantity = product.stock;
        
        appStore.addNotification({
          type: 'warning',
          message: `Solo hay ${product.stock} unidades disponibles`,
          read: false
        });
      }
      
      appStore.updateQuantity(productId, quantity);
    };
    
    const removeFromCart = (productId) => {
      appStore.removeFromCart(productId);
    };
    
    const clearCart = () => {
      if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        appStore.clearCart();
        discount.value = 0;
      }
    };
    
    const processPayment = (method) => {
      paymentMethod.value = method;
      amountReceived.value = 0;
      change.value = 0;
      
      if (!paymentModal) {
        paymentModal = new Modal(document.getElementById('paymentModal'));
      }
      
      paymentModal.show();
    };
    
    const calculateChange = () => {
      change.value = parseFloat(amountReceived.value) - total.value;
      if (isNaN(change.value)) {
        change.value = 0;
      }
    };
    
    const completeSale = () => {
      // In a real app, this would process the payment and save the sale
      const sale = {
        id: Date.now(),
        date: new Date(),
        customer: selectedCustomer.value,
        items: [...cart.value],
        subtotal: subtotal.value,
        tax: tax.value,
        discount: discount.value,
        total: total.value,
        paymentMethod: paymentMethod.value,
        amountReceived: amountReceived.value,
        change: change.value
      };
      
      console.log('Sale completed:', sale);
      
      // Show success message
      appStore.addNotification({
        type: 'success',
        message: `Venta completada por $${formatPrice(total.value)}`,
        read: false
      });
      
      // Reset and close
      paymentModal.hide();
      appStore.clearCart();
      discount.value = 0;
      selectedCustomer.value = null;
      customerSearch.value = '';
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize any required components or data
    });
    
    return {
      // State
      searchQuery,
      showCategories,
      selectedCategory,
      currentPage,
      itemsPerPage,
      customerSearch,
      selectedCustomer,
      showCustomerDropdown,
      discount,
      amountReceived,
      change,
      paymentMethod,
      
      // Computed
      filteredProducts: paginatedProducts,
      totalPages,
      cart,
      subtotal,
      tax,
      total,
      categories,
      filteredCustomers,
      
      // Methods
      filterProducts,
      selectCategory,
      clearCategoryFilter,
      changePage,
      formatPrice,
      selectCustomer,
      addNewCustomer,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      processPayment,
      calculateChange,
      completeSale
    };
  }
};
</script>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .pos-container {
    padding-bottom: 70px;
  }
  
  .card-body {
    max-height: none !important;
  }
}

/* Animation for add to cart */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}

.bounce {
  animation: bounce 1s ease;
}
</style>
