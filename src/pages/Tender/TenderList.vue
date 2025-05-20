<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Paginator from '@/components/Paginator.vue';
import TenderGrid from '@/components/TenderGrid.vue';
import Tender from '@/types/Tender';
import TendersResponse from '@/types/TendersResponse';
import SearchInput from '@/components/SearchInput.vue';

const router = useRouter();

const scrollAnchor = ref<HTMLElement | null>(null);
const currentPage = ref<number>(1);
const serverPage = ref<number>(1);
const allTenders = ref<TendersResponse<Tender>>({ data: [] });
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchText = ref<string>('');
const pageCount = ref<number>(0);
const SERVER_POSTS_PER_PAGE: number = 100;
const CLIENT_POSTS_PER_PAGE: number = 30;
const GRID_COLUMNS: number = 5;

const totalClientPages = computed(() => {
    return Math.ceil(searchedTenders.value.length / CLIENT_POSTS_PER_PAGE);
});

const maxPossiblePages = computed(() => {
    if (!pageCount.value) return 1;
    return Math.ceil((pageCount.value * SERVER_POSTS_PER_PAGE) / CLIENT_POSTS_PER_PAGE);
});

const visibleTenders = computed<Tender[]>(() => {
    const start = (currentPage.value - 1) * CLIENT_POSTS_PER_PAGE;
    const end = start + CLIENT_POSTS_PER_PAGE;
    return searchedTenders.value.slice(start, end);
});
const searchedTenders = computed<Tender[]>(() => {
    return allTenders.value.data.filter((tender) =>
        tender.title.toLowerCase().includes(searchText.value.toLowerCase()),
    );
});

async function fetchTenders(pageNumber: number): Promise<Tender[] | null> {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await fetch(`https://api.test-webest.ru/list/?page=${pageNumber}`);
        const data = await response.json();
        pageCount.value = data.page_count;
        const newTenders = data.data as Tender[];
        const uniqueTenders = [
            ...new Map([...allTenders.value.data, ...newTenders].map((tender) => [tender.id, tender])).values(),
        ];
        allTenders.value.data = uniqueTenders;
        return allTenders.value.data;
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        error.value = 'Не удалось загрузить тендеры.';
        throw err;
    } finally {
        isLoading.value = false;
    }
}
async function nextPage() {
    if (currentPage.value >= maxPossiblePages.value) return;
    currentPage.value++;
    scrollToTop();
    const remainingPages = totalClientPages.value - currentPage.value;
    if (remainingPages <= 1 && serverPage.value < pageCount.value) {
        serverPage.value++;
        await fetchTenders(serverPage.value);
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
    fetchTenders(serverPage.value);
});
const handleTenderClick = (id) => {
    router.push(`/tender-info/${id}`);
};
const handleSearch = (text: string) => {
    searchText.value = text;
};
</script>

<template>
    <div ref="scrollAnchor"></div>
    <SearchInput @search="handleSearch" />
    <TenderGrid :tenders="visibleTenders" :columns="GRID_COLUMNS" @tender-click="handleTenderClick" />
    <Paginator :current-page="currentPage" :total-pages="maxPossiblePages" @prev="prevPage" @next="nextPage" />
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="isLoading" class="loading">Загрузка...</div>
</template>
