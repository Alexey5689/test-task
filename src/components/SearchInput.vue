<script setup lang="ts">
import { ref } from 'vue';
const searchText = ref('');
defineEmits<{
    (e: 'search', value: string): void;
}>();
</script>
<template>
    <input
        type="text"
        class="search-input"
        v-model="searchText"
        @input="$emit('search', searchText)"
        placeholder="Поиск..."
    />
</template>
