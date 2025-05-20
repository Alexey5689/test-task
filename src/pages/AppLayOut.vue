<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = computed(() => route.meta.title || 'Мое приложение');
</script>

<template>
    <header class="header container">
        <h1>{{ title }}</h1>
    </header>

    <div class="container">
        <router-view v-slot="{ Component }">
            <transition name="slide-fade">
                <div :key="$route.fullPath">
                    <component :is="Component" />
                </div>
            </transition>
        </router-view>
    </div>
</template>

<style scoped>
.header {
    margin-bottom: 2rem;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
