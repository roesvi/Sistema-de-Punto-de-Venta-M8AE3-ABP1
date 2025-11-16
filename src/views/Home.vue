<template>
  <div class="home">
    <div class="welcome-container">
      <h1>Bienvenido a Escorpión POS</h1>
      <p class="subtitle">Sistema de Punto de Venta para tu negocio</p>
      <button @click="goToPOS" class="cta-button">Ir al Punto de Venta</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToPOS() {
      this.$router.push('/pos');
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
  padding: 2rem;
}

.welcome-container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #3aa876;
}
</style>