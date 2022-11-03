<template>
  <input
    ref="inp"
    v-model="cmp"
    class="px-3 py-1 bg-dark-300 border-none shadow-xl rounded text-light-500 text-lg"
  />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  const props = defineProps({
    modelValue: {
      required: true,
      type: String,
    },
  })
  const emit = defineEmits(['update:modelValue'])
  const inp = ref<HTMLElement | null>(null)
  const cmp = computed({
    get() {
      return props.modelValue
    },
    set(val: any) {
      emit('update:modelValue', val)
    },
  })
</script>
