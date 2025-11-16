<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Nuestros Servicios</h1>
            <p class="lead mb-4">Soluciones tecnológicas personalizadas para impulsar tu negocio al siguiente nivel</p>
            <a href="#contacto" class="btn btn-light btn-lg me-3">Solicitar Cotización</a>
            <a href="#servicios" class="btn btn-outline-light btn-lg">Explorar Servicios</a>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
            <img src="@/assets/img/services-hero.png" alt="Servicios Tecnológicos" class="img-fluid">
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section id="servicios" class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-primary-soft text-primary mb-3">Nuestros Servicios</span>
          <h2 class="mb-4">Soluciones a tu medida</h2>
          <p class="lead text-muted">Ofrecemos una amplia gama de servicios para cubrir todas tus necesidades tecnológicas</p>
        </div>

        <div class="row g-4">
          <div v-for="(service, index) in services" :key="index" class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm service-card">
              <div class="card-body p-4">
                <div class="icon-box mb-4">
                  <i :class="service.icon"></i>
                </div>
                <h3 class="h5 mb-3">{{ service.title }}</h3>
                <p class="text-muted mb-4">{{ service.description }}</p>
                <ul class="list-unstyled mb-0">
                  <li v-for="(feature, i) in service.features" :key="i" class="mb-2">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>{{ feature }}
                  </li>
                </ul>
              </div>
              <div class="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
                <a href="#contacto" class="btn btn-outline-primary w-100">Más información</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Work -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <img src="@/assets/img/process.png" alt="Nuestro Proceso" class="img-fluid rounded shadow">
          </div>
          <div class="col-lg-6 ps-lg-5">
            <span class="badge bg-primary-soft text-primary mb-3">Nuestro Proceso</span>
            <h2 class="mb-4">¿Cómo trabajamos?</h2>
            <p class="text-muted mb-5">Seguimos un proceso probado para garantizar el éxito de cada proyecto</p>
            
            <div v-for="(step, index) in processSteps" :key="index" class="process-step mb-4">
              <div class="d-flex">
                <div class="step-number me-4">
                  <span class="rounded-circle d-flex align-items-center justify-content-center">{{ index + 1 }}</span>
                </div>
                <div>
                  <h5 class="mb-2">{{ step.title }}</h5>
                  <p class="text-muted mb-0">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-primary-soft text-primary mb-3">Testimonios</span>
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        
        <div class="row g-4">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-4">
                  <img :src="testimonial.avatar" class="rounded-circle me-3" width="60" height="60" :alt="testimonial.name">
                  <div>
                    <h5 class="mb-1">{{ testimonial.name }}</h5>
                    <p class="text-muted mb-0 small">{{ testimonial.role }}</p>
                  </div>
                </div>
                <p class="card-text">"{{ testimonial.quote }}"</p>
                <div class="text-warning">
                  <i v-for="i in 5" :key="i" class="bi bi-star-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contacto" class="py-5 bg-primary text-white">
      <div class="container text-center py-5">
        <h2 class="mb-4">¿Listo para comenzar?</h2>
        <p class="lead mb-5">Contáctanos hoy mismo para una consulta gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos</p>
        <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <router-link to="/contacto" class="btn btn-light btn-lg px-4">Contáctanos</router-link>
          <a href="tel:+1234567890" class="btn btn-outline-light btn-lg px-4">
            <i class="bi bi-telephone-fill me-2"></i>Llamar ahora
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ServicesView',
  data() {
    return {
      services: [
        {
          title: 'Sistemas POS',
          description: 'Sistemas de punto de venta completos para gestionar tu negocio de manera eficiente.',
          icon: 'bi bi-cash-stack',
          features: [
            'Gestión de inventario en tiempo real',
            'Reportes detallados',
            'Integración con múltiples métodos de pago',
            'Soporte 24/7'
          ]
        },
        {
          title: 'Business Intelligence',
          description: 'Toma decisiones basadas en datos con nuestras soluciones de inteligencia de negocios.',
          icon: 'bi bi-graph-up',
          features: [
            'Dashboards interactivos',
            'Análisis predictivo',
            'Reportes personalizados',
            'Integración con múltiples fuentes de datos'
          ]
        },
        {
          title: 'Desarrollo Web',
          description: 'Diseño y desarrollo de sitios web modernos y responsivos para tu negocio.',
          icon: 'bi bi-globe',
          features: [
            'Diseño responsive',
            'Optimización SEO',
            'Tiendas en línea',
            'Mantenimiento continuo'
          ]
        },
        {
          title: 'Aplicaciones Móviles',
          description: 'Aplicaciones móviles nativas e híbridas para iOS y Android.',
          icon: 'bi bi-phone',
          features: [
            'Desarrollo nativo e híbrido',
            'Integración con APIs',
            'Pruebas exhaustivas',
            'Publicación en tiendas'
          ]
        },
        {
          title: 'Consultoría TI',
          description: 'Asesoramiento experto para optimizar tu infraestructura tecnológica.',
          icon: 'bi bi-pc-display',
          features: [
            'Auditoría de sistemas',
            'Estrategia digital',
            'Migración a la nube',
            'Seguridad informática'
          ]
        },
        {
          title: 'Marketing Digital',
          description: 'Estrategias de marketing digital para aumentar tu presencia en línea.',
          icon: 'bi bi-megaphone',
          features: [
            'SEO y SEM',
            'Redes sociales',
            'Email marketing',
            'Análisis de resultados'
          ]
        }
      ],
      processSteps: [
        {
          title: 'Consulta Inicial',
          description: 'Analizamos tus necesidades y objetivos para entender cómo podemos ayudarte.'
        },
        {
          title: 'Propuesta Personalizada',
          description: 'Creamos un plan de acción detallado con soluciones a tu medida.'
        },
        {
          title: 'Desarrollo',
          description: 'Nuestro equipo trabaja en la implementación de las soluciones acordadas.'
        },
        {
          title: 'Pruebas y Ajustes',
          description: 'Realizamos pruebas exhaustivas y ajustamos según sea necesario.'
        },
        {
          title: 'Lanzamiento y Soporte',
          description: 'Implementamos la solución y ofrecemos soporte continuo.'
        }
      ],
      testimonials: [
        {
          name: 'Ana Martínez',
          role: 'Dueña de Tienda de Ropa',
          quote: 'El sistema POS ha revolucionado cómo manejamos nuestro inventario. ¡Increíble!',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        },
        {
          name: 'Roberto Sánchez',
          role: 'Gerente de Restaurante',
          quote: 'La mejor inversión que hemos hecho. El soporte es excepcional.',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
          name: 'Laura Gómez',
          role: 'CEO, Tienda en Línea',
          quote: 'Su equipo de desarrollo web superó todas nuestras expectativas.',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        }
      ]
    }
  },
  mounted() {
    document.title = 'Nuestros Servicios | Mi Blog';
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 0 0 50% 50% / 20px;
  margin-bottom: 3rem;
}

.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.icon-box {
  width: 60px;
  height: 60px;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--primary-color);
}

.process-step .step-number {
  position: relative;
  min-width: 40px;
}

.process-step .step-number span {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.process-step:not(:last-child) .step-number::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background: #e9ecef;
  transform: translateX(-50%);
}

.bg-primary-soft {
  background-color: rgba(67, 97, 238, 0.1) !important;
  color: var(--primary-color) !important;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.bi-star-fill {
  margin-right: 2px;
}

.btn-outline-light:hover {
  color: var(--primary-color) !important;
}

@media (max-width: 768px) {
  .hero-section {
    text-align: center;
    padding: 4rem 0;
  }
  
  .hero-section img {
    margin-top: 2rem;
    max-width: 80%;
  }
  
  .process-step {
    margin-bottom: 2rem;
  }
}
</style>
