<template>
  <div class="about-page">
    <section class="hero-section bg-primary text-white py-5">
      <div class="container text-center py-5">
        <h1 class="display-4 fw-bold mb-4">Acerca de Nosotros</h1>
        <p class="lead">Conoce más sobre nuestra misión, visión y el equipo detrás de este proyecto</p>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h2 class="mb-4">Nuestra Historia</h2>
            <p class="lead">Desde nuestro inicio en 2020, nos hemos dedicado a proporcionar soluciones tecnológicas innovadoras para pequeñas y medianas empresas.</p>
            <p>Nuestro equipo de expertos en tecnología de la información y desarrollo de software se ha unido con un objetivo común: simplificar la tecnología para que las empresas puedan enfocarse en lo que mejor saben hacer: crecer y servir a sus clientes.</p>
          </div>
          <div class="col-lg-6">
            <img src="@/assets/img/team.jpg" alt="Nuestro Equipo" class="img-fluid rounded shadow">
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2>Nuestro Equipo</h2>
          <p class="lead">Conoce a las mentes brillantes detrás de nuestro éxito</p>
        </div>
        <div class="row g-4">
          <div v-for="(member, index) in teamMembers" :key="index" class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <img :src="member.image" class="card-img-top" :alt="member.name">
              <div class="card-body text-center">
                <h5 class="card-title">{{ member.name }}</h5>
                <p class="text-muted">{{ member.role }}</p>
                <p class="card-text">{{ member.bio }}</p>
                <div class="social-links">
                  <a v-if="member.social.linkedin" :href="member.social.linkedin" target="_blank" class="text-decoration-none me-2">
                    <i class="bi bi-linkedin"></i>
                  </a>
                  <a v-if="member.social.twitter" :href="member.social.twitter" target="_blank" class="text-decoration-none me-2">
                    <i class="bi bi-twitter"></i>
                  </a>
                  <a v-if="member.social.github" :href="member.social.github" target="_blank" class="text-decoration-none">
                    <i class="bi bi-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h2 class="mb-4">Nuestros Valores</h2>
            <div class="row g-4">
              <div v-for="(value, index) in values" :key="index" class="col-md-4">
                <div class="p-4 bg-white rounded shadow-sm h-100">
                  <div class="icon-box mb-3">
                    <i :class="value.icon"></i>
                  </div>
                  <h5 class="mb-3">{{ value.title }}</h5>
                  <p class="mb-0">{{ value.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-primary text-white">
      <div class="container text-center">
        <h2 class="mb-4">¿Listo para comenzar?</h2>
        <p class="lead mb-4">Únete a las empresas que ya están transformando su negocio con nuestras soluciones</p>
        <router-link to="/contacto" class="btn btn-light btn-lg px-4">Contáctanos</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      teamMembers: [
        {
          name: 'Roberto Escobar',
          role: 'CEO & Fundador',
          bio: 'Más de 15 años de experiencia en desarrollo de software y gestión de equipos tecnológicos.',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          social: {
            linkedin: '#',
            twitter: '#',
            github: '#'
          }
        },
        {
          name: 'María García',
          role: 'Directora de Tecnología',
          bio: 'Experta en arquitectura de software y soluciones escalables para empresas en crecimiento.',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          social: {
            linkedin: '#',
            twitter: '#',
            github: '#'
          }
        },
        {
          name: 'Carlos López',
          role: 'Líder de Desarrollo',
          bio: 'Especialista en desarrollo frontend y experiencia de usuario con más de 10 años de experiencia.',
          image: 'https://randomuser.me/api/portraits/men/22.jpg',
          social: {
            linkedin: '#',
            github: '#'
          }
        }
      ],
      values: [
        {
          title: 'Innovación',
          description: 'Buscamos constantemente nuevas formas de resolver problemas y mejorar nuestras soluciones.',
          icon: 'bi bi-lightbulb'
        },
        {
          title: 'Calidad',
          description: 'Nos comprometemos a ofrecer productos y servicios de la más alta calidad.',
          icon: 'bi bi-award'
        },
        {
          title: 'Soporte',
          description: 'Nuestro equipo está siempre disponible para ayudarte con cualquier consulta o problema.',
          icon: 'bi bi-headset'
        }
      ]
    }
  },
  mounted() {
    document.title = 'Acerca de Nosotros | Mi Blog';
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 0 0 50% 50% / 20px;
  margin-bottom: 3rem;
}

.icon-box {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 50%;
  font-size: 1.8rem;
  color: var(--primary-color);
}

.social-links a {
  color: var(--dark-color);
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--primary-color);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-top {
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.bg-light {
  background-color: #f8f9fa !important;
}

.btn-light {
  background-color: white;
  color: var(--primary-color);
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-light:hover {
  background-color: #f1f3f5;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
