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
        <div v-if="isLoading" class="loading" style="color: red">Загрузка...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="tender">
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
