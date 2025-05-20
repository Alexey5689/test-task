<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Tender from '@/types/Tender';

const route = useRoute();
const router = useRouter();
const tender = ref<Tender | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchTender(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await fetch(`https://api.test-webest.ru/element/?id=${id}`);
        const data = await response.json();
        tender.value = Array.isArray(data) ? data[0] : data;
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        error.value = 'Не удалось загрузить данные тендера.';
    } finally {
        isLoading.value = false;
    }
}

function handleBack() {
    router.go(-1);
}
onMounted(() => {
    fetchTender(route.params.tenderId as string);
});
</script>

<template>
    <div class="tender-single-container">
        <div v-if="isLoading" class="loading">Загрузка...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="tender" class="tender-single">
            <button @click="handleBack" class="button">← Назад к списку</button>

            <div class="tender-card expanded">
                <h1 class="tender-title">{{ tender.title }}</h1>

                <div class="tender-meta">
                    <span v-if="tender.id" class="meta-item">ID: {{ tender.id }}</span>
                </div>

                <div class="description-wrapper scrollable">
                    <p>{{ tender.description }}</p>
                </div>
            </div>
        </div>
        <div v-else class="no-data">Тендер не найден</div>
    </div>
</template>

<style scoped>
.tender-single-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.tender-card.expanded {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 500px;
    padding: 30px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
}

.tender-title {
    font-size: 2rem;
    color: #42b983;
    margin: 0 0 20px 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.tender-meta {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    color: #666;
    font-size: 0.9rem;
}

.meta-item {
    background: #eee;
    padding: 5px 10px;
    border-radius: 4px;
}

.description-wrapper.scrollable {
    font-size: 1.1rem;
    line-height: 1.6;
    padding: 15px;
    background: white;
    border-radius: 4px;
    border: 1px solid #eee;
    max-height: 600px;
    overflow-y: auto;
}

.description-wrapper.scrollable p {
    margin: 0;
    white-space: pre-line;
}

/* Стили для скроллбара */
.description-wrapper.scrollable::-webkit-scrollbar {
    width: 8px;
}

.description-wrapper.scrollable::-webkit-scrollbar-thumb {
    background: #42b983;
    border-radius: 4px;
}

.description-wrapper.scrollable::-webkit-scrollbar-track {
    background: #f1f1f1;
}
</style>
