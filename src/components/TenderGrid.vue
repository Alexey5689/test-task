<script setup lang="ts">
import { computed } from 'vue';
import Tender from '@/types/Tender';
const props = defineProps<{
    tenders: Tender[];
    columns?: number;
}>();

const GRID_COLUMNS = props.columns || 5;

const emit = defineEmits<{
    (e: 'tenderClick', id: number): void;
}>();

function handleTenderClick(id: number) {
    emit('tenderClick', id);
}

const gridRows = computed(() => {
    const rows: Tender[][] = [];
    for (let i = 0; i < props.tenders.length; i += GRID_COLUMNS) {
        rows.push(props.tenders.slice(i, i + GRID_COLUMNS));
    }
    return rows;
});
</script>
<template>
    <div class="tender-grid">
        <TransitionGroup name="list">
            <div v-for="(row, rowIndex) in gridRows" :key="rowIndex" class="grid-row">
                <TransitionGroup name="list">
                    <div
                        v-for="tender in row"
                        :key="tender.id"
                        @click="handleTenderClick(tender.id)"
                        class="tender-card"
                    >
                        <h3>{{ tender.title }}</h3>
                        <div class="description-wrapper">
                            {{ tender.description }}
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped></style>
