<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.params);
const allTenders = ref<Tender[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
async function fetchTenders(id): Promise<Tender[] | null> {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await fetch(`https://api.test-webest.ru/element/?id=${id}`);
        const data = await response.json();
        allTenders.value = data.data as Tender[];
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        error.value = 'Не удалось загрузить тендеры.';
    } finally {
        isLoading.value = false;
    }
}
onMounted(() => {
    fetchTenders(route.params.tenderId);
});
</script>

<template>
    <div>TenderInfo</div>
</template>
