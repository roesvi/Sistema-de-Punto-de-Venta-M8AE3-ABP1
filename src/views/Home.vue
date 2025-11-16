<template>
  <div class="home">
    <h1>Bienvenido a Nuestro Blog de Tecnología</h1>
    <div class="featured-posts">
      <div class="post-card" v-for="post in featuredPosts" :key="post.id" @click="goToPost(post.path)">
        <h3>{{ post.title }}</h3>
        <p>{{ post.description }}</p>
        <span class="read-more">Leer más →</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      featuredPosts: [
        {
          id: 1,
          title: 'BI para PYMES',
          description: 'Descubre cómo el Business Intelligence puede transformar tu negocio.',
          path: '/blog/bi-para-pymes'
        },
        {
          id: 2,
          title: 'Estrategias de Optimización de Inventario',
          description: 'Mejora la gestión de tu inventario con estas estrategias probadas.',
          path: '/blog/estrategias-optimizacion-inventario'
        },
        {
          id: 3,
          title: 'Evolución de los POS Modernos',
          description: 'Conoce cómo han evolucionado los sistemas de punto de venta.',
          path: '/blog/evolucion-pos-modernos'
        },
        {
          id: 4,
          title: 'Guía de Implementación POS',
          description: 'Todo lo que necesitas saber para implementar un sistema POS exitosamente.',
          path: '/blog/guia-implementacion-pos'
        }
      ]
    }
  },
  methods: {
    goToPost(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem 0;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.featured-posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.post-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.post-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.read-more {
  color: #42b983;
  font-weight: 500;
  display: inline-block;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .featured-posts {
    grid-template-columns: 1fr;
  }
}
</style>
