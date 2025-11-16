<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4">Contáctanos</h1>
            <p class="lead mb-0">¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <!-- Contact Form -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4 p-md-5">
                <h2 class="mb-4">Envíanos un mensaje</h2>
                <form @submit.prevent="submitForm" class="needs-validation" novalidate>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="name" class="form-label">Nombre completo <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="name" 
                        v-model="form.name" 
                        required
                        :class="{ 'is-invalid': errors.name }"
                      >
                      <div class="invalid-feedback">
                        {{ errors.name || 'Por favor ingresa tu nombre' }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="email" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
                      <input 
                        type="email" 
                        class="form-control" 
                        id="email" 
                        v-model="form.email" 
                        required
                        :class="{ 'is-invalid': errors.email }"
                      >
                      <div class="invalid-feedback">
                        {{ errors.email || 'Por favor ingresa un correo electrónico válido' }}
                      </div>
                    </div>
                    <div class="col-12">
                      <label for="subject" class="form-label">Asunto</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="subject" 
                        v-model="form.subject"
                      >
                    </div>
                    <div class="col-12">
                      <label for="message" class="form-label">Mensaje <span class="text-danger">*</span></label>
                      <textarea 
                        class="form-control" 
                        id="message" 
                        rows="6" 
                        v-model="form.message" 
                        required
                        :class="{ 'is-invalid': errors.message }"
                      ></textarea>
                      <div class="invalid-feedback">
                        {{ errors.message || 'Por favor escribe tu mensaje' }}
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="privacy" 
                          v-model="form.privacy"
                          required
                          :class="{ 'is-invalid': errors.privacy }"
                        >
                        <label class="form-check-label small" for="privacy">
                          Acepto la <a href="#" class="text-decoration-none">Política de Privacidad</a> y el 
                          <a href="#" class="text-decoration-none">Aviso Legal</a> <span class="text-danger">*</span>
                        </label>
                        <div class="invalid-feedback">
                          {{ errors.privacy || 'Debes aceptar la política de privacidad' }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="d-grid">
                        <button 
                          type="submit" 
                          class="btn btn-primary btn-lg"
                          :disabled="isSubmitting"
                        >
                          <span v-if="!isSubmitting">Enviar mensaje</span>
                          <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span v-if="isSubmitting" class="ms-2">Enviando...</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-4 p-md-5">
                <h2 class="mb-4">Información de contacto</h2>
                <p class="text-muted mb-5">Estamos disponibles para responder a tus preguntas y ayudarte con lo que necesites.</p>
                
                <div class="d-flex mb-4">
                  <div class="icon-box me-4">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Dirección</h5>
                    <p class="mb-0 text-muted">Calle Falsa 123, Piso 4<br>Ciudad, CP 12345</p>
                  </div>
                </div>

                <div class="d-flex mb-4">
                  <div class="icon-box me-4">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Correo electrónico</h5>
                    <p class="mb-0">
                      <a href="mailto:info@example.com" class="text-decoration-none">info@example.com</a>
                    </p>
                  </div>
                </div>

                <div class="d-flex mb-4">
                  <div class="icon-box me-4">
                    <i class="bi bi-telephone"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Teléfono</h5>
                    <p class="mb-0">
                      <a href="tel:+1234567890" class="text-decoration-none">+1 (234) 567-890</a>
                    </p>
                  </div>
                </div>

                <div class="d-flex">
                  <div class="icon-box me-4">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Horario de atención</h5>
                    <p class="mb-0 text-muted">Lunes a Viernes: 9:00 - 18:00<br>Sábado: 9:00 - 14:00</p>
                  </div>
                </div>

                <hr class="my-4">
                
                <h5 class="mb-3">Síguenos</h5>
                <div class="social-links">
                  <a href="#" class="btn btn-outline-primary btn-sm rounded-circle me-2">
                    <i class="bi bi-facebook"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm rounded-circle me-2">
                    <i class="bi bi-twitter"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm rounded-circle me-2">
                    <i class="bi bi-instagram"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm rounded-circle me-2">
                    <i class="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section class="map-section">
      <div class="ratio ratio-21x9">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209521155!2d-73.9878449243591!3d40.74844053938049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
          width="600" 
          height="450" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </section>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-5">
            <div class="icon-box success-icon mb-4">
              <i class="bi bi-check-lg"></i>
            </div>
            <h4 class="mb-3">¡Mensaje enviado con éxito!</h4>
            <p class="text-muted mb-4">Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'ContactView',
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: '',
      privacy: false
    });
    
    const errors = ref({});
    const isSubmitting = ref(false);
    
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;
      
      if (!form.value.name.trim()) {
        newErrors.name = 'El nombre es obligatorio';
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.value.email) {
        newErrors.email = 'El correo electrónico es obligatorio';
        isValid = false;
      } else if (!emailRegex.test(form.value.email)) {
        newErrors.email = 'Por favor ingresa un correo electrónico válido';
        isValid = false;
      }
      
      if (!form.value.message.trim()) {
        newErrors.message = 'El mensaje es obligatorio';
        isValid = false;
      }
      
      if (!form.value.privacy) {
        newErrors.privacy = 'Debes aceptar la política de privacidad';
        isValid = false;
      }
      
      errors.value = newErrors;
      return isValid;
    };
    
    const submitForm = () => {
      if (validateForm()) {
        isSubmitting.value = true;
        
        // Simulate API call
        setTimeout(() => {
          console.log('Form submitted:', form.value);
          isSubmitting.value = false;
          
          // Show success modal
          const successModal = new Modal(document.getElementById('successModal'));
          successModal.show();
          
          // Reset form
          form.value = {
            name: '',
            email: '',
            subject: '',
            message: '',
            privacy: false
          };
          
          // Reset validation
          errors.value = {};
          
          // Remove was-validated class from form
          const forms = document.querySelectorAll('.needs-validation');
          Array.from(forms).forEach(form => {
            form.classList.remove('was-validated');
          });
        }, 1500);
      } else {
        // Add was-validated class to show validation messages
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
          form.classList.add('was-validated');
        });
      }
    };
    
    return {
      form,
      errors,
      isSubmitting,
      submitForm
    };
  },
  mounted() {
    document.title = 'Contacto | Mi Blog';
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 0 0 50% 50% / 20px;
  margin-bottom: 3rem;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 50px;
  height: 50px;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.icon-box.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  font-size: 2.5rem;
  border-radius: 50%;
}

.form-control, .form-select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
}

.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

.social-links .btn {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.3s ease;
}

.social-links .btn:hover {
  background-color: var(--primary-color);
  color: white !important;
  transform: translateY(-3px);
}

.map-section {
  background-color: #f8f9fa;
  padding: 0;
  margin-top: 5rem;
}

.map-section iframe {
  border: none;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

/* Custom form validation styles */
.was-validated .form-control:invalid,
.form-control.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.was-validated .form-control:valid,
.form-control.is-valid {
  border-color: #198754;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.was-validated .form-check-input:invalid,
.form-check-input.is-invalid {
  border-color: #dc3545;
}

.was-validated .form-check-input:valid,
.form-check-input.is-valid {
  border-color: #198754;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0;
  }
  
  .map-section iframe {
    min-height: 300px;
  }
  
  .icon-box {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style>
