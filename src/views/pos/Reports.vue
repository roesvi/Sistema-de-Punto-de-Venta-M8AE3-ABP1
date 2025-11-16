<template>
  <div class="reports-dashboard">
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Reportes</h2>
          <p class="text-muted mb-0">Análisis y estadísticas de tu negocio</p>
        </div>
        <div>
          <button class="btn btn-outline-primary me-2" @click="exportReport">
            <i class="bi bi-download me-1"></i> Exportar
          </button>
          <button class="btn btn-primary" @click="printReport">
            <i class="bi bi-printer me-1"></i> Imprimir
          </button>
        </div>
      </div>

      <!-- Date Range Picker -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label">Tipo de Reporte</label>
              <select class="form-select" v-model="reportType">
                <option value="sales">Ventas</option>
                <option value="inventory">Inventario</option>
                <option value="customers">Clientes</option>
                <option value="products">Productos</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Rango de Fechas</label>
              <select class="form-select" v-model="dateRange" @change="updateDateRange">
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="thisWeek">Esta Semana</option>
                <option value="lastWeek">Semana Pasada</option>
                <option value="thisMonth">Este Mes</option>
                <option value="lastMonth">Mes Pasado</option>
                <option value="thisYear">Este Año</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <div class="col-md-3" v-if="dateRange === 'custom'">
              <label class="form-label">Fecha Inicio</label>
              <input type="date" class="form-control" v-model="startDate">
            </div>
            <div class="col-md-3" v-if="dateRange === 'custom'">
              <label class="form-label">Fecha Fin</label>
              <div class="input-group">
                <input type="date" class="form-control" v-model="endDate">
                <button class="btn btn-outline-secondary" type="button" @click="applyDateRange">
                  <i class="bi bi-check-lg"></i>
                </button>
              </div>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" @click="refreshReport">
                <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Ventas Totales</h6>
                  <h3 class="mb-0">${{ formatNumber(summary.totalSales) }}</h3>
                  <div class="mt-2">
                    <span :class="summary.salesChange >= 0 ? 'text-success' : 'text-danger'">
                      <i :class="summary.salesChange >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      {{ Math.abs(summary.salesChange) }}% vs período anterior
                    </span>
                  </div>
                </div>
                <div class="bg-primary bg-opacity-25 p-3 rounded">
                  <i class="bi bi-currency-dollar text-primary" style="font-size: 1.5rem;"></i>
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
                  <h6 class="text-muted mb-1">Órdenes</h6>
                  <h3 class="mb-0">{{ summary.totalOrders }}</h3>
                  <div class="mt-2">
                    <span :class="summary.ordersChange >= 0 ? 'text-success' : 'text-danger'">
                      <i :class="summary.ordersChange >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      {{ Math.abs(summary.ordersChange) }}% vs período anterior
                    </span>
                  </div>
                </div>
                <div class="bg-success bg-opacity-25 p-3 rounded">
                  <i class="bi bi-cart-check text-success" style="font-size: 1.5rem;"></i>
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
                  <h6 class="text-muted mb-1">Ticket Promedio</h6>
                  <h3 class="mb-0">${{ formatNumber(summary.averageOrderValue) }}</h3>
                  <div class="mt-2">
                    <span :class="summary.aovChange >= 0 ? 'text-success' : 'text-danger'">
                      <i :class="summary.aovChange >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      {{ Math.abs(summary.aovChange) }}%
                    </span>
                  </div>
                </div>
                <div class="bg-warning bg-opacity-25 p-3 rounded">
                  <i class="bi bi-receipt text-warning" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info bg-opacity-10 border-0 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Clientes Nuevos</h6>
                  <h3 class="mb-0">{{ summary.newCustomers }}</h3>
                  <div class="mt-2">
                    <span :class="summary.customersChange >= 0 ? 'text-success' : 'text-danger'">
                      <i :class="summary.customersChange >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      {{ Math.abs(summary.customersChange) }}%
                    </span>
                  </div>
                </div>
                <div class="bg-info bg-opacity-25 p-3 rounded">
                  <i class="bi bi-people text-info" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row">
        <!-- Sales Chart -->
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Ventas por Día</h5>
              <div class="btn-group btn-group-sm" role="group">
                <button 
                  v-for="period in ['Día', 'Semana', 'Mes']" 
                  :key="period"
                  class="btn"
                  :class="chartPeriod === period.toLowerCase() ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="chartPeriod = period.toLowerCase()"
                >
                  {{ period }}
                </button>
              </div>
            </div>
            <div class="card-body">
              <div style="height: 350px;">
                <canvas ref="salesChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="col-lg-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Productos Más Vendidos</h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div 
                  v-for="(product, index) in topProducts" 
                  :key="product.id"
                  class="list-group-item list-group-item-action"
                >
                  <div class="d-flex align-items-center">
                    <div class="position-relative me-3">
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                        #{{ index + 1 }}
                      </span>
                      <div class="avatar">
                        <img 
                          :src="product.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'P')}&background=random`"
                          class="rounded"
                          style="width: 40px; height: 40px; object-fit: cover;"
                          :alt="product.name"
                        >
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between">
                        <h6 class="mb-0">{{ product.name }}</h6>
                        <span class="fw-bold">{{ product.quantity }} unid.</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">{{ product.category }}</small>
                        <small class="text-success">${{ formatNumber(product.revenue) }}</small>
                      </div>
                      <div class="progress mt-1" style="height: 4px;">
                        <div 
                          class="progress-bar bg-success" 
                          role="progressbar" 
                          :style="{ width: product.percentage + '%' }"
                          :aria-valuenow="product.percentage" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="topProducts.length === 0" class="text-center py-4 text-muted">
                  No hay datos disponibles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <!-- Sales by Category -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Ventas por Categoría</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-7">
                  <div style="height: 250px;">
                    <canvas ref="categoryChart"></canvas>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="d-flex flex-column h-100 justify-content-center">
                    <div 
                      v-for="(category, index) in salesByCategory" 
                      :key="index"
                      class="mb-2"
                    >
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <span 
                            class="bullet me-2" 
                            :style="{ backgroundColor: categoryColors[index] }"
                          ></span>
                          <span>{{ category.name }}</span>
                        </div>
                        <div class="fw-medium">
                          {{ category.percentage }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Métodos de Pago</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-7">
                  <div style="height: 250px;">
                    <canvas ref="paymentChart"></canvas>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="d-flex flex-column h-100 justify-content-center">
                    <div 
                      v-for="(method, index) in paymentMethods" 
                      :key="index"
                      class="mb-2"
                    >
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <span 
                            class="bullet me-2" 
                            :style="{ backgroundColor: paymentColors[index] }"
                          ></span>
                          <span>{{ method.name }}</span>
                        </div>
                        <div class="fw-medium">
                          {{ method.percentage }}%
                        </div>
                      </div>
                      <div class="text-muted small">
                        ${{ formatNumber(method.amount) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Tables -->
      <div class="row mt-4">
        <!-- Recent Orders -->
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Órdenes Recientes</h5>
              <router-link to="/pos/sales" class="btn btn-sm btn-outline-primary">
                Ver Todas
              </router-link>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th># Orden</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th class="text-end">Total</th>
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="recentOrders.length === 0">
                      <td colspan="6" class="text-center py-4">
                        <div class="text-muted">No hay órdenes recientes</div>
                      </td>
                    </tr>
                    <tr v-for="order in recentOrders" :key="order.id">
                      <td>#{{ order.id }}</td>
                      <td>{{ order.customer }}</td>
                      <td>{{ formatDate(order.date) }}</td>
                      <td class="text-end">${{ formatNumber(order.total) }}</td>
                      <td>
                        <span class="badge" :class="getStatusClass(order.status)">
                          {{ getStatusName(order.status) }}
                        </span>
                      </td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" @click="viewOrder(order)">
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'Reports',
  setup() {
    // Chart references
    const salesChart = ref(null);
    const categoryChart = ref(null);
    const paymentChart = ref(null);
    
    // Chart instances
    let salesChartInstance = null;
    let categoryChartInstance = null;
    let paymentChartInstance = null;
    
    // Data
    const reportType = ref('sales');
    const dateRange = ref('thisMonth');
    const chartPeriod = ref('day');
    const startDate = ref('');
    const endDate = ref('');
    
    // Sample data - in a real app, this would come from an API
    const summary = ref({
      totalSales: 0,
      salesChange: 0,
      totalOrders: 0,
      ordersChange: 0,
      averageOrderValue: 0,
      aovChange: 0,
      newCustomers: 0,
      customersChange: 0
    });
    
    const salesData = ref([]);
    const topProducts = ref([]);
    const salesByCategory = ref([]);
    const paymentMethods = ref([]);
    const recentOrders = ref([]);
    
    // Colors for charts
    const categoryColors = [
      '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#4ad66d',
      '#b5179e', '#f72585', '#7209b7', '#560bad', '#480ca8'
    ];
    
    const paymentColors = [
      '#4cc9f0', '#4895ef', '#4361ee', '#3f37c9', '#3a0ca3'
    ];
    
    // Initialize data
    const initData = () => {
      // Set default date range to current month
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      startDate.value = formatDateForInput(firstDay);
      endDate.value = formatDateForInput(lastDay);
      
      // Generate sample data
      generateSampleData();
    };
    
    // Generate sample data for demonstration
    const generateSampleData = () => {
      // Generate sales data for the last 30 days
      const sales = [];
      const today = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        sales.push({
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 20) + 5,
          customers: Math.floor(Math.random() * 15) + 3
        });
      }
      
      salesData.value = sales;
      
      // Update summary
      const currentPeriodSales = sales.slice(-7).reduce((sum, item) => sum + item.amount, 0);
      const previousPeriodSales = sales.slice(-14, -7).reduce((sum, item) => sum + item.amount, 0);
      const salesChange = previousPeriodSales > 0 
        ? Math.round(((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100) 
        : 0;
      
      const currentPeriodOrders = sales.slice(-7).reduce((sum, item) => sum + item.orders, 0);
      const previousPeriodOrders = sales.slice(-14, -7).reduce((sum, item) => sum + item.orders, 0);
      const ordersChange = previousPeriodOrders > 0 
        ? Math.round(((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100) 
        : 0;
      
      const avgOrderValue = Math.round(currentPeriodSales / (currentPeriodOrders || 1));
      const previousAOV = previousPeriodOrders > 0 ? Math.round(previousPeriodSales / previousPeriodOrders) : 0;
      const aovChange = previousAOV > 0 ? Math.round(((avgOrderValue - previousAOV) / previousAOV) * 100) : 0;
      
      const newCustomers = Math.floor(Math.random() * 20) + 5;
      const previousCustomers = Math.floor(Math.random() * 15) + 3;
      const customersChange = previousCustomers > 0 
        ? Math.round(((newCustomers - previousCustomers) / previousCustomers) * 100) 
        : 0;
      
      summary.value = {
        totalSales: currentPeriodSales,
        salesChange,
        totalOrders: currentPeriodOrders,
        ordersChange,
        averageOrderValue: avgOrderValue,
        aovChange,
        newCustomers,
        customersChange
      };
      
      // Generate top products
      const products = [
        { id: 1, name: 'Laptop HP 15-dw1000', category: 'Electrónicos', quantity: 45, revenue: 3145000 },
        { id: 2, name: 'Smartphone Samsung Galaxy S21', category: 'Celulares', quantity: 38, revenue: 2850000 },
        { id: 3, name: 'Auriculares Inalámbricos', category: 'Accesorios', quantity: 72, revenue: 2160000 },
        { id: 4, name: 'Tablet Lenovo Tab M10', category: 'Tablets', quantity: 28, revenue: 1680000 },
        { id: 5, name: 'Cargador USB-C 65W', category: 'Accesorios', quantity: 95, revenue: 1425000 }
      ];
      
      const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
      topProducts.value = products.map(p => ({
        ...p,
        percentage: Math.round((p.revenue / totalRevenue) * 100)
      }));
      
      // Generate sales by category
      const categories = [
        { name: 'Electrónicos', value: 35 },
        { name: 'Celulares', value: 25 },
        { name: 'Computación', value: 20 },
        { name: 'Accesorios', value: 15 },
        { name: 'Otros', value: 5 }
      ];
      
      salesByCategory.value = categories.map(c => ({
        ...c,
        percentage: c.value
      }));
      
      // Generate payment methods
      const payments = [
        { name: 'Tarjeta de Crédito', amount: 4500000, percentage: 45 },
        { name: 'Tarjeta de Débito', amount: 3500000, percentage: 35 },
        { name: 'Efectivo', amount: 1200000, percentage: 12 },
        { name: 'Transferencia', amount: 800000, percentage: 8 }
      ];
      
      paymentMethods.value = payments;
      
      // Generate recent orders
      recentOrders.value = [
        { id: 'ORD-1001', customer: 'Roberto Escobar', date: new Date(), total: 125000, status: 'completed' },
        { id: 'ORD-1000', customer: 'Empresa XYZ S.A.', date: new Date(Date.now() - 86400000), total: 278000, status: 'completed' },
        { id: 'ORD-999', customer: 'María González', date: new Date(Date.now() - 2 * 86400000), total: 89500, status: 'processing' },
        { id: 'ORD-998', customer: 'Carlos López', date: new Date(Date.now() - 3 * 86400000), total: 156000, status: 'completed' },
        { id: 'ORD-997', customer: 'Ana Martínez', date: new Date(Date.now() - 4 * 86400000), total: 45000, status: 'cancelled' }
      ];
      
      // Update charts after data is loaded
      nextTick(() => {
        updateCharts();
      });
    };
    
    // Update charts
    const updateCharts = () => {
      // Destroy existing charts
      if (salesChartInstance) salesChartInstance.destroy();
      if (categoryChartInstance) categoryChartInstance.destroy();
      if (paymentChartInstance) paymentChartInstance.destroy();
      
      // Create sales chart
      if (salesChart.value) {
        const ctx = salesChart.value.getContext('2d');
        salesChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: salesData.value.slice(-7).map(item => formatDate(item.date, 'short')),
            datasets: [
              {
                label: 'Ventas',
                data: salesData.value.slice(-7).map(item => item.amount),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
              },
              {
                label: 'Órdenes',
                data: salesData.value.slice(-7).map(item => item.orders * 100),
                borderColor: '#4cc9f0',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.3,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label === 'Ventas') {
                      label += ': $' + context.raw.toLocaleString('es-CL');
                    } else if (label === 'Órdenes') {
                      label += ': ' + (context.raw / 100);
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  drawOnChartArea: false
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString('es-CL');
                  }
                }
              },
              y1: {
                position: 'right',
                beginAtZero: true,
                grid: {
                  drawOnChartArea: false
                },
                ticks: {
                  callback: function(value) {
                    return value / 100;
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
      
      // Create category chart
      if (categoryChart.value) {
        const ctx = categoryChart.value.getContext('2d');
        categoryChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: salesByCategory.value.map(item => item.name),
            datasets: [{
              data: salesByCategory.value.map(item => item.percentage),
              backgroundColor: categoryColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}%`;
                  }
                }
              }
            }
          }
        });
      }
      
      // Create payment method chart
      if (paymentChart.value) {
        const ctx = paymentChart.value.getContext('2d');
        paymentChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: paymentMethods.value.map(item => item.name),
            datasets: [{
              data: paymentMethods.value.map(item => item.percentage),
              backgroundColor: paymentColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}%`;
                  }
                }
              }
            }
          }
        });
      }
    };
    
    // Format number with thousands separator
    const formatNumber = (value) => {
      return new Intl.NumberFormat('es-CL').format(value);
    };
    
    // Format date
    const formatDate = (dateString, format = 'long') => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      
      if (format === 'short') {
        return date.toLocaleDateString('es-CL', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      return date.toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    // Format date for input element
    const formatDateForInput = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };
    
    // Update date range based on selection
    const updateDateRange = () => {
      const today = new Date();
      let start = new Date();
      let end = new Date();
      
      switch (dateRange.value) {
        case 'today':
          // Start and end are already today
          break;
          
        case 'yesterday':
          start.setDate(today.getDate() - 1);
          end.setDate(today.getDate() - 1);
          break;
          
        case 'thisWeek':
          start.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
          break;
          
        case 'lastWeek':
          start.setDate(today.getDate() - today.getDay() - 7); // Start of last week
          end.setDate(today.getDate() - today.getDay() - 1); // End of last week
          break;
          
        case 'thisMonth':
          start = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month
          break;
          
        case 'lastMonth':
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
          
        case 'thisYear':
          start = new Date(today.getFullYear(), 0, 1); // Start of current year
          break;
          
        case 'custom':
          // Don't change dates, let the user pick them
          return;
      }
      
      startDate.value = formatDateForInput(start);
      endDate.value = formatDateForInput(end);
      
      // Apply the date range
      applyDateRange();
    };
    
    // Apply date range filter
    const applyDateRange = () => {
      // In a real app, this would fetch data for the selected date range
      console.log('Applying date range:', startDate.value, 'to', endDate.value);
      refreshReport();
    };
    
    // Refresh report data
    const refreshReport = () => {
      // In a real app, this would refetch data from the API
      console.log('Refreshing report...');
      generateSampleData();
    };
    
    // Export report
    const exportReport = () => {
      // In a real app, this would generate and download a PDF or Excel file
      console.log('Exporting report...');
      alert('Exportando reporte...');
    };
    
    // Print report
    const printReport = () => {
      // In a real app, this would open the print dialog with a print-optimized version
      console.log('Printing report...');
      window.print();
    };
    
    // View order details
    const viewOrder = (order) => {
      // In a real app, this would navigate to the order details page
      console.log('Viewing order:', order.id);
      alert(`Viendo detalles de la orden ${order.id}`);
    };
    
    // Get status class for badges
    const getStatusClass = (status) => {
      const classes = {
        'completed': 'bg-success bg-opacity-10 text-success',
        'processing': 'bg-warning bg-opacity-10 text-warning',
        'cancelled': 'bg-danger bg-opacity-10 text-danger',
        'pending': 'bg-secondary bg-opacity-10 text-secondary'
      };
      return classes[status] || 'bg-light text-dark';
    };
    
    // Get status name
    const getStatusName = (status) => {
      const names = {
        'completed': 'Completado',
        'processing': 'En Proceso',
        'cancelled': 'Cancelado',
        'pending': 'Pendiente'
      };
      return names[status] || status;
    };
    
    // Initialize component
    onMounted(() => {
      initData();
      
      // Update charts when window is resized
      window.addEventListener('resize', updateCharts);
      
      // Clean up event listeners
      return () => {
        window.removeEventListener('resize', updateCharts);
        
        // Clean up chart instances
        if (salesChartInstance) salesChartInstance.destroy();
        if (categoryChartInstance) categoryChartInstance.destroy();
        if (paymentChartInstance) paymentChartInstance.destroy();
      };
    });
    
    // Watch for changes to report type
    watch(reportType, (newVal) => {
      console.log('Report type changed to:', newVal);
      // In a real app, this would load different data based on the report type
    });
    
    // Watch for changes to chart period
    watch(chartPeriod, (newVal) => {
      console.log('Chart period changed to:', newVal);
      // In a real app, this would update the chart data based on the selected period
      updateCharts();
    });
    
    return {
      // Refs
      salesChart,
      categoryChart,
      paymentChart,
      
      // Data
      reportType,
      dateRange,
      chartPeriod,
      startDate,
      endDate,
      summary,
      topProducts,
      salesByCategory,
      paymentMethods,
      recentOrders,
      categoryColors,
      paymentColors,
      
      // Methods
      formatNumber,
      formatDate,
      updateDateRange,
      applyDateRange,
      refreshReport,
      exportReport,
      printReport,
      viewOrder,
      getStatusClass,
      getStatusName
    };
  }
};
</script>

<style scoped>
.reports-dashboard {
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

.bullet {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
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

/* Print styles */
@media print {
  .reports-dashboard {
    padding: 0;
  }
  
  .btn, .form-select, .input-group {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #e9ecef;
    break-inside: avoid;
  }
  
  .card-header {
    background-color: #f8f9fa !important;
  }
  
  .no-print {
    display: none !important;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reports-dashboard {
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
}
</style>
