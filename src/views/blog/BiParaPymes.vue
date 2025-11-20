<template>
  <article class="blog-post">
    <h1>BI para PYMES: Transformando Datos en Decisiones Estratégicas</h1>
    
    <section class="post-content">
      <p>En la era digital actual, las pequeñas y medianas empresas (PYMES) tienen acceso a más datos que nunca. Sin embargo, la verdadera ventaja competitiva no está en la cantidad de datos, sino en cómo se utilizan para tomar decisiones informadas. Aquí es donde entra en juego el Business Intelligence (BI).</p>
      
      <h2>¿Qué es el Business Intelligence?</h2>
      <p>El Business Intelligence es un conjunto de estrategias, aplicaciones y tecnologías que permiten a las organizaciones transformar datos en información valiosa para la toma de decisiones estratégicas.</p>
      
      <img src="@/assets/img/Bussiness_intelligence.png" alt="Business Intelligence para PYMES" class="blog-image">
      
      <h2>Beneficios del BI para PYMES</h2>
      <ul>
        <li>Mejora en la toma de decisiones basada en datos</li>
        <li>Identificación de oportunidades de crecimiento</li>
        <li>Optimización de procesos internos</li>
        <li>Mayor comprensión del comportamiento del cliente</li>
        <li>Ventaja competitiva en el mercado</li>
      </ul>
      
      <h2>Cómo implementar BI en tu PYME</h2>
      <ol>
        <li>Identifica tus necesidades específicas</li>
        <li>Selecciona las herramientas adecuadas</li>
        <li>Capacita a tu equipo</li>
        <li>Comienza con un proyecto piloto</li>
        <li>Evalúa y ajusta según sea necesario</li>
      </ol>
    </section>
    
    <router-link to="/" class="back-link">← Volver al inicio</router-link>
  </article>
</template>

<script>
export default {
  name: 'BiParaPymes',
  mounted() {
    document.title = 'BI para PYMES | Blog';
  }
}
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

h2 {
  color: #2c3e50;
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
}

p, li {
  line-height: 1.6;
  color: #4a4a4a;
  margin-bottom: 1rem;
}

ul, ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.blog-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #2c3e50;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .blog-post {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
}
</style>
