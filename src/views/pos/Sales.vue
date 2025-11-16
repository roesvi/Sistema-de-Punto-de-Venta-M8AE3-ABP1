<template>
  <div class="sales-management">
    <div class="container-fluid">
      <!-- Header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Ventas</h2>
          <p class="text-muted mb-0">Historial y gestión de ventas</p>
        </div>
        <div>
          <button class="btn btn-primary" @click="$router.push('/pos')">
            <i class="bi bi-plus-lg me-1"></i> Nueva Venta
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar ventas..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="filters.status">
                <option value="">Todos</option>
                <option value="completed">Completadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Rango de fechas</label>
              <div class="input-group">
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filters.startDate"
                >
                <span class="input-group-text">a</span>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filters.endDate"
                >
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Método de pago</label>
              <select class="form-select" v-model="filters.paymentMethod">
                <option value="">Todos</option>
                <option value="cash">Efectivo</option>
                <option value="credit_card">Tarjeta de Crédito</option>
                <option value="debit_card">Tarjeta de Débito</option>
                <option value="transfer">Transferencia</option>
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

      <!-- Sales Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary bg-opacity-10 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Ventas Hoy</h6>
                  <h3 class="mb-0">${{ formatNumber(dailySales) }}</h3>
                  <small class="text-success">
                    <i class="bi bi-arrow-up"></i> 12% vs ayer
                  </small>
                </div>
                <div class="bg-primary bg-opacity-25 p-3 rounded">
                  <i class="bi bi-cart-check text-primary" style="font-size: 1.5rem;"></i>
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
                  <h6 class="text-muted mb-1">Ventas del Mes</h6>
                  <h3 class="mb-0">${{ formatNumber(monthlySales) }}</h3>
                  <small class="text-success">
                    <i class="bi bi-arrow-up"></i> 8% vs mes anterior
                  </small>
                </div>
                <div class="bg-success bg-opacity-25 p-3 rounded">
                  <i class="bi bi-graph-up text-success" style="font-size: 1.5rem;"></i>
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
                  <h6 class="text-muted mb-1">Ventas Pendientes</h6>
                  <h3 class="mb-0">{{ pendingSalesCount }}</h3>
                  <small class="text-warning">
                    <i class="bi bi-exclamation-triangle"></i> Necesitan atención
                  </small>
                </div>
                <div class="bg-warning bg-opacity-25 p-3 rounded">
                  <i class="bi bi-clock-history text-warning" style="font-size: 1.5rem;"></i>
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
                  <h6 class="text-muted mb-1">Ticket Promedio</h6>
                  <h3 class="mb-0">${{ formatNumber(averageTicket) }}</h3>
                  <small class="text-success">
                    <i class="bi bi-arrow-up"></i> 5% vs mes anterior
                  </small>
                </div>
                <div class="bg-info bg-opacity-25 p-3 rounded">
                  <i class="bi bi-receipt text-info" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID Venta</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th class="text-end">Total</th>
                  <th>Método de Pago</th>
                  <th>Estado</th>
                  <th class="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredSales.length === 0">
                  <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                      <i class="bi bi-receipt" style="font-size: 2rem;"></i>
                      <p class="mt-2 mb-0">No se encontraron ventas</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="sale in paginatedSales" :key="sale.id">
                  <td>#{{ sale.id }}</td>
                  <td>
                    <div v-if="sale.customer">
                      <div class="fw-medium">{{ sale.customer.name }}</div>
                      <small class="text-muted">{{ sale.customer.email || 'Sin correo' }}</small>
                    </div>
                    <span v-else class="text-muted">Cliente no registrado</span>
                  </td>
                  <td>
                    <div>{{ formatDate(sale.date) }}</div>
                    <small class="text-muted">{{ formatTime(sale.date) }}</small>
                  </td>
                  <td class="text-end fw-medium">${{ formatNumber(sale.total) }}</td>
                  <td>
                    <span class="badge" :class="getPaymentMethodClass(sale.paymentMethod)">
                      {{ getPaymentMethodName(sale.paymentMethod) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(sale.status)">
                      {{ getStatusName(sale.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewSale(sale)" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-secondary" 
                        @click="printReceipt(sale)"
                        title="Imprimir recibo"
                      >
                        <i class="bi bi-printer"></i>
                      </button>
                      <button 
                        v-if="sale.status === 'pending'"
                        class="btn btn-outline-success" 
                        @click="completeSale(sale)"
                        title="Marcar como completada"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button 
                        v-if="sale.status !== 'cancelled'"
                        class="btn btn-outline-danger" 
                        @click="confirmCancel(sale)"
                        title="Cancelar venta"
                      >
                        <i class="bi bi-x-lg"></i>
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
              Mostrando {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredSales.length) }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredSales.length) }} de 
              {{ filteredSales.length }} ventas
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

    <!-- Sale Details Modal -->
    <div class="modal fade" :class="{ 'show d-block': showSaleDetails }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Venta #{{ currentSale?.id }}</h5>
            <button type="button" class="btn-close" @click="showSaleDetails = false"></button>
          </div>
          <div class="modal-body" v-if="currentSale">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6 class="text-muted">Información de la Venta</h6>
                <p class="mb-1"><strong>Fecha:</strong> {{ formatDateTime(currentSale.date) }}</p>
                <p class="mb-1"><strong>Vendedor:</strong> {{ currentSale.seller || 'No especificado' }}</p>
                <p class="mb-1">
                  <strong>Estado:</strong> 
                  <span class="badge" :class="getStatusClass(currentSale.status)">
                    {{ getStatusName(currentSale.status) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Información del Cliente</h6>
                <p class="mb-1" v-if="currentSale.customer">
                  <strong>Cliente:</strong> {{ currentSale.customer.name }}
                </p>
                <p class="mb-1" v-if="currentSale.customer?.email">
                  <strong>Email:</strong> {{ currentSale.customer.email }}
                </p>
                <p class="mb-1" v-if="currentSale.customer?.phone">
                  <strong>Teléfono:</strong> {{ currentSale.customer.phone }}
                </p>
                <p class="mb-0" v-else>
                  <strong>Cliente no registrado</strong>
                </p>
              </div>
            </div>

            <div class="table-responsive mb-4">
              <table class="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-end">Precio Unitario</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in currentSale.items" :key="index">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="product-image me-2">
                          <img 
                            :src="item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'P')}&background=random`"
                            :alt="item.name"
                            class="rounded"
                            style="width: 40px; height: 40px; object-fit: cover;"
                          >
                        </div>
                        <div>
                          <div class="fw-medium">{{ item.name }}</div>
                          <small class="text-muted">{{ item.sku || 'N/A' }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">${{ formatNumber(item.price) }}</td>
                    <td class="text-end fw-medium">${{ formatNumber(item.quantity * item.price) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                    <td class="text-end">${{ formatNumber(currentSale.subtotal) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end"><strong>Descuento:</strong></td>
                    <td class="text-end">${{ formatNumber(currentSale.discount || 0) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end"><strong>IVA (19%):</strong></td>
                    <td class="text-end">${{ formatNumber(currentSale.tax) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end"><strong>Total:</strong></td>
                    <td class="text-end fw-bold">${{ formatNumber(currentSale.total) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted">Método de Pago</h6>
                <p class="mb-1">
                  <strong>Tipo:</strong> 
                  <span class="badge" :class="getPaymentMethodClass(currentSale.paymentMethod)">
                    {{ getPaymentMethodName(currentSale.paymentMethod) }}
                  </span>
                </p>
                <p class="mb-1" v-if="currentSale.paymentDetails?.transactionId">
                  <strong>ID Transacción:</strong> {{ currentSale.paymentDetails.transactionId }}
                </p>
                <p class="mb-1" v-if="currentSale.paymentMethod === 'credit_card' || currentSale.paymentMethod === 'debit_card'">
                  <strong>Tarjeta:</strong> **** **** **** {{ currentSale.paymentDetails?.last4 || '****' }}
                </p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Notas</h6>
                <p v-if="currentSale.notes">{{ currentSale.notes }}</p>
                <p v-else class="text-muted">Sin notas adicionales</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="printReceipt(currentSale)">
              <i class="bi bi-printer me-1"></i> Imprimir Recibo
            </button>
            <button type="button" class="btn btn-primary" @click="showSaleDetails = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSaleDetails" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Sales',
  setup() {
    // Sample data - in a real app, this would come from an API
    const sales = ref([
      {
        id: '1001',
        date: new Date('2023-11-10T14:30:00'),
        customer: {
          id: 1,
          name: 'Roberto Escobar',
          email: 'rober@example.com',
          phone: '+56 9 1234 5678'
        },
        seller: 'María González',
        items: [
          { id: 1, name: 'Laptop HP 15-dw1000', sku: 'LP-HP-001', price: 699990, quantity: 1, image: 'https://ui-avatars.com/api/?name=Laptop+HP&background=random' },
          { id: 2, name: 'Mouse Inalámbrico', sku: 'MS-WL-001', price: 14990, quantity: 2, image: 'https://ui-avatars.com/api/?name=Mouse&background=random' }
        ],
        subtotal: 729970,
        discount: 20000,
        tax: 134894,
        total: 844864,
        paymentMethod: 'credit_card',
        paymentDetails: {
          transactionId: 'TXN-789456',
          last4: '4242'
        },
        status: 'completed',
        notes: 'Cliente solicita factura'
      },
      // Add more sample sales as needed
    ]);

    const filters = ref({
      search: '',
      status: '',
      startDate: '',
      endDate: '',
      paymentMethod: ''
    });

    const showSaleDetails = ref(false);
    const currentSale = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Computed properties
    const filteredSales = computed(() => {
      return sales.value.filter(sale => {
        // Filter by search term
        const matchesSearch = !filters.value.search || 
          sale.id.includes(filters.value.search) ||
          (sale.customer?.name && sale.customer.name.toLowerCase().includes(filters.value.search.toLowerCase()));
        
        // Filter by status
        const matchesStatus = !filters.value.status || sale.status === filters.value.status;
        
        // Filter by date range
        let matchesDate = true;
        if (filters.value.startDate) {
          const startDate = new Date(filters.value.startDate);
          startDate.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && new Date(sale.date) >= startDate;
        }
        if (filters.value.endDate) {
          const endDate = new Date(filters.value.endDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && new Date(sale.date) <= endDate;
        }
        
        // Filter by payment method
        const matchesPaymentMethod = !filters.value.paymentMethod || 
          sale.paymentMethod === filters.value.paymentMethod;

        return matchesSearch && matchesStatus && matchesDate && matchesPaymentMethod;
      }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    });

    const paginatedSales = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredSales.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredSales.value.length / itemsPerPage.value);
    });

    const dailySales = computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return sales.value
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= today && sale.status === 'completed';
        })
        .reduce((sum, sale) => sum + sale.total, 0);
    });

    const monthlySales = computed(() => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      return sales.value
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= firstDay && sale.status === 'completed';
        })
        .reduce((sum, sale) => sum + sale.total, 0);
    });

    const pendingSalesCount = computed(() => {
      return sales.value.filter(sale => sale.status === 'pending').length;
    });

    const averageTicket = computed(() => {
      const completedSales = sales.value.filter(sale => sale.status === 'completed');
      if (completedSales.length === 0) return 0;
      
      const total = completedSales.reduce((sum, sale) => sum + sale.total, 0);
      return Math.round(total / completedSales.length);
    });

    // Methods
    const formatNumber = (value) => {
      return new Intl.NumberFormat('es-CL').format(value);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-CL');
    };

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateTime = (date) => {
      return `${formatDate(date)} ${formatTime(date)}`;
    };

    const getStatusName = (status) => {
      const statusMap = {
        'completed': 'Completada',
        'pending': 'Pendiente',
        'cancelled': 'Cancelada'
      };
      return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
      const classMap = {
        'completed': 'bg-success bg-opacity-10 text-success',
        'pending': 'bg-warning bg-opacity-10 text-warning',
        'cancelled': 'bg-danger bg-opacity-10 text-danger'
      };
      return classMap[status] || 'bg-secondary bg-opacity-10';
    };

    const getPaymentMethodName = (method) => {
      const methodMap = {
        'cash': 'Efectivo',
        'credit_card': 'Tarjeta de Crédito',
        'debit_card': 'Tarjeta de Débito',
        'transfer': 'Transferencia'
      };
      return methodMap[method] || method;
    };

    const getPaymentMethodClass = (method) => {
      const classMap = {
        'cash': 'bg-success bg-opacity-10 text-success',
        'credit_card': 'bg-primary bg-opacity-10 text-primary',
        'debit_card': 'bg-info bg-opacity-10 text-info',
        'transfer': 'bg-secondary bg-opacity-10 text-secondary'
      };
      return classMap[method] || 'bg-light text-dark';
    };

    const resetFilters = () => {
      filters.value = {
        search: '',
        status: '',
        startDate: '',
        endDate: '',
        paymentMethod: ''
      };
      currentPage.value = 1;
    };

    const viewSale = (sale) => {
      currentSale.value = JSON.parse(JSON.stringify(sale));
      showSaleDetails.value = true;
    };

    const printReceipt = (sale) => {
      // In a real app, this would open a print dialog with a formatted receipt
      console.log('Printing receipt for sale:', sale.id);
      alert(`Imprimiendo recibo para la venta #${sale.id}`);
    };

    const completeSale = (sale) => {
      if (confirm(`¿Marcar la venta #${sale.id} como completada?`)) {
        const index = sales.value.findIndex(s => s.id === sale.id);
        if (index !== -1) {
          sales.value[index].status = 'completed';
        }
      }
    };

    const confirmCancel = (sale) => {
      if (confirm(`¿Estás seguro de cancelar la venta #${sale.id}? Esta acción no se puede deshacer.`)) {
        const index = sales.value.findIndex(s => s.id === sale.id);
        if (index !== -1) {
          sales.value[index].status = 'cancelled';
        }
      }
    };

    // Initialize with today's date as default end date
    onMounted(() => {
      const today = new Date();
      filters.value.endDate = today.toISOString().split('T')[0];
      
      // Set start date to first day of current month
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      filters.value.startDate = firstDay.toISOString().split('T')[0];
    });

    return {
      // Data
      sales,
      filters,
      showSaleDetails,
      currentSale,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredSales,
      paginatedSales,
      totalPages,
      dailySales,
      monthlySales,
      pendingSalesCount,
      averageTicket,
      
      // Methods
      formatNumber,
      formatDate,
      formatTime,
      formatDateTime,
      getStatusName,
      getStatusClass,
      getPaymentMethodName,
      getPaymentMethodClass,
      resetFilters,
      viewSale,
      printReceipt,
      completeSale,
      confirmCancel
    };
  }
};
</script>

<style scoped>
.sales-management {
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
  border-radius: 0.25rem;
}

.modal {
  z-index: 1060;
}

.modal-backdrop {
  z-index: 1055;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sales-management {
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
}
</style>
