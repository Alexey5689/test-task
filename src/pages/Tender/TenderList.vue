<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Tender {
    id: number;
    title: string;
    description: string;
}

const CLIENT_PAGE_SIZE = 30;
const GRID_COLUMNS = 5;

const scrollAnchor = ref<HTMLElement | null>(null);
const currentPage = ref(1);
const allTenders = ref<Tender[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchTenders(): Promise<Tender[] | null> {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await fetch(`https://api.test-webest.ru/list/?page=${currentPage.value}`);
        const data = await response.json();
        allTenders.value = data.data as Tender[];
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        error.value = 'Не удалось загрузить тендеры.';
    } finally {
        isLoading.value = false;
    }
}

const visibleTenders = computed<Tender[]>(() => {
    const start = (currentPage.value - 1) * CLIENT_PAGE_SIZE;
    const end = start + CLIENT_PAGE_SIZE;
    return allTenders.value.slice(start, end);
});

const gridRows = computed<Tender[][]>(() => {
    const rows: Tender[][] = [];
    for (let i = 0; i < visibleTenders.value.length; i += GRID_COLUMNS) {
        rows.push(visibleTenders.value.slice(i, i + GRID_COLUMNS));
    }
    return rows;
});

const totalPages = computed<number>(() => Math.ceil(allTenders.value.length / CLIENT_PAGE_SIZE));

function nextPage(): void {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
    }
}

function prevPage(): void {
    if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
    }
}

function scrollToTop(): void {
    scrollAnchor.value?.scrollIntoView({
        behavior: 'smooth',
    });
}

onMounted(() => {
    fetchTenders();
});
</script>

<template>
    <div ref="scrollAnchor"></div>

    <div v-if="isLoading" class="loading">Загрузка...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
        <h1>Список тендеров</h1>

        <div class="tender-grid">
            <div v-for="(row, rowIndex) in gridRows" :key="rowIndex" class="grid-row">
                <div
                    v-for="tender in row"
                    :key="tender.id"
                    @click="$router.push(`/tender-info/${tender.id}`)"
                    class="tender-card"
                >
                    <h3>{{ tender.title }}</h3>
                    <div class="description-wrapper">
                        {{ tender.description }}
                    </div>
                </div>
            </div>
        </div>

        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1 || isLoading">Назад</button>

            <span>Страница {{ currentPage }} из {{ totalPages }}</span>

            <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading">Вперед</button>
        </div>
    </template>
</template>

<style scoped>
.loading,
.error {
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
}

.error {
    color: #ff4444;
}

.tender-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;
}

.grid-row {
    display: grid;
    grid-template-columns: repeat(v-bind(GRID_COLUMNS), 1fr);
    gap: 15px;
}

.tender-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background: #f9f9f9;
}

.tender-card h3 {
    margin-top: 0;
    color: #42b983;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
}

button {
    padding: 8px 16px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover:not(:disabled) {
    background: #3aa876;
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
.tender-title {
    margin: 0 0 10px 0;
    color: #42b983;
    font-size: 1.1rem;
    height: 40px; /* Фиксированная высота заголовка */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Ограничиваем заголовок 2 строками */
    -webkit-box-orient: vertical;
}
.tender-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background: #f9f9f9;
    width: 250px; /* Фиксированная ширина */
    height: 300px; /* Фиксированная высота */
    display: flex;
    flex-direction: column;
    box-sizing: border-box; /* Чтобы padding не влиял на размеры */
}

.tender-card h3 {
    margin-top: 0;
    color: #42b983;
    margin-bottom: 10px;
}

.description-wrapper {
    flex: 1; /* Занимает все оставшееся пространство */
    overflow: hidden;
    position: relative;
    line-height: 1.4;
}

/* Если нужно сделать прокрутку вместо обрезки */
.description-wrapper.scrollable {
    overflow-y: auto;
    padding-right: 5px;
}

/* Стили для скроллбара (опционально) */
.description-wrapper::-webkit-scrollbar {
    width: 5px;
}

.description-wrapper::-webkit-scrollbar-thumb {
    background: #42b983;
    border-radius: 3px;
}
.description-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, rgba(249, 249, 249, 0), rgba(249, 249, 249, 0.9) 70%);
    pointer-events: none;
}
</style>
