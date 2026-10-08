<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './components/base/BaseButton.vue'
import BaseInput from './components/base/BaseInput.vue'

const name = ref('')
</script>

<template>
  <div class="container py-4">
    <div class="card card-body">
      <BaseInput
        v-model="name"
        label="Name"
        placeholder="Enter user name"
        :error="name === 'x' ? 'Test error' : ''"
      />
      <p>Ти ввела: {{ name }}</p>
      <BaseButton @click="name = ''">Очистити</BaseButton>
    </div>
  </div>
</template>
