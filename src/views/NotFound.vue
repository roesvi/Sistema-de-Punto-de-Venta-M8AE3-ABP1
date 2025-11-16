<template>
  <div class="not-found-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <div class="error-code display-1 fw-bold text-primary mb-3">404</div>
          <h1 class="mb-4">¡Página no encontrada!</h1>
          <p class="lead text-muted mb-5">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
          <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <router-link to="/" class="btn btn-primary btn-lg px-4">
              <i class="bi bi-house-door me-2"></i>Ir al Inicio
            </router-link>
            <a href="#" @click="$router.go(-1)" class="btn btn-outline-primary btn-lg px-4">
              <i class="bi bi-arrow-left me-2"></i>Volver atrás
            </a>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-12 text-center">
          <img src="@/assets/img/404.svg" alt="Página no encontrada" class="img-fluid" style="max-height: 300px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    document.title = 'Página no encontrada | Mi Blog';
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: 4rem 0;
}

.error-code {
  font-size: 8rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent; /* Fallback for non-WebKit browsers */
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  padding: 0.75rem 2rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
