<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
}>();

defineEmits<{
    (e: 'prev'): void;
    (e: 'next'): void;
}>();
</script>
<template>
    <div class="pagination">
        <button class="button" @click="$emit('prev')" :disabled="currentPage === 1">Назад</button>

        <span>Страница {{ currentPage }} из {{ totalPages }}</span>

        <button class="button" @click="$emit('next')" :disabled="currentPage >= totalPages">Вперед</button>
    </div>
</template>
