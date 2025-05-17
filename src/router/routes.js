import AppLayout from '@/pages/AppLayout.vue';
import TenderList from '@/pages/Tender/TenderList.vue';
import TenderInfo from '@/pages/Tender/TenderInfo.vue';

export const routes = [
    {
        path: '/',
        component: AppLayout,
        redirect: '/tender-list',
        children: [
            {
                path: 'tender-list',
                name: 'TenderList',
                component: TenderList,
            },
            {
                path: 'tender-info/:tenderId',
                name: 'TenderInfo',
                component: TenderInfo,
            },
        ],
    },
];
