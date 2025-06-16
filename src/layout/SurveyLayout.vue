<template>
  <div class="survey-layout-container">
    <!-- Survey Header Section -->
    <div class="survey-header">
      <slot name="header"></slot>
    </div>

    <!-- Survey Navigation -->
    <div class="survey-navigation">
      <slot name="navigation"></slot>
    </div>

    <!-- Survey Question Section -->
    <div class="survey-question-section">
      <slot name="question"></slot>
    </div>

    <!-- Survey Content - Main Layout Area -->
    <div class="survey-content-area">
      <!-- Left Panel: Question Details + Professors List -->
      <div class="survey-left-panel">
        <!-- Question Details -->
        <div class="question-details-section">
          <slot name="question-details"></slot>
        </div>
        
        <!-- Professors List -->
        <div class="professors-section">
          <slot name="professors-list"></slot>
        </div>
      </div>

      <!-- Right Panel: Rating Containers -->
      <div class="survey-right-panel">
        <div class="rating-containers-section">
          <slot name="rating-containers"></slot>
        </div>
      </div>
    </div>

    <!-- Survey Footer -->
    <div class="survey-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
// No props needed - this is a pure layout component using slots
</script>

<style scoped>
/* ==========================================================================
   SURVEY LAYOUT COMPONENT
   Optimized layout for survey interfaces with horizontal space utilization
   ========================================================================== */

.survey-layout-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  gap: 1.5rem;
}

/* Survey Header */
.survey-header {
  width: 100%;
}

/* Survey Navigation */
.survey-navigation {
  width: 100%;
}

/* Survey Question Section */
.survey-question-section {
  width: 100%;
}

/* Survey Content Area - Main Layout */
.survey-content-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  width: 100%;
}

/* Left Panel */
.survey-left-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  order: 1;
}

.question-details-section {
  width: 100%;
}

.professors-section {
  width: 100%;
}

/* Right Panel */
.survey-right-panel {
  flex: 1;
  order: 2;
}

.rating-containers-section {
  width: 100%;
}

/* Survey Footer */
.survey-footer {
  width: 100%;
  margin-top: 2rem;
}

/* Tablet Layout (768px and up) */
@media (min-width: 768px) {
  .survey-content-area {
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }

  .survey-left-panel {
    flex: 0 0 350px;
    order: 1;
    gap: 1rem;
  }

  .survey-right-panel {
    flex: 1;
    order: 2;
  }

  .question-details-section {
    margin-bottom: 0;
  }
}

/* Desktop Layout (1024px and up) */
@media (min-width: 1024px) {
  .survey-layout-container {
    gap: 2rem;
  }

  .survey-content-area {
    gap: 3rem;
  }

  .survey-left-panel {
    flex: 0 0 400px;
    gap: 1.5rem;
  }
}

/* Large Desktop Layout (1280px and up) */
@media (min-width: 1280px) {
  .survey-content-area {
    gap: 4rem;
  }

  .survey-left-panel {
    flex: 0 0 450px;
    gap: 2rem;
  }
}

/* Ultra-wide Layout (1600px and up) */
@media (min-width: 1600px) {
  .survey-layout-container {
    max-width: 1600px;
    margin: 0 auto;
  }

  .survey-content-area {
    gap: 5rem;
  }

  .survey-left-panel {
    flex: 0 0 500px;
  }
}
</style>
