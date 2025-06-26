// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Calendar from "@/components/layout/Calendar.vue";
import DashBoard from "@/components/layout/Dashboard.vue";
import Login from "@/components/layout/Login.vue";
import Signup from "@/components/layout/Signup.vue";
import JournalDetails from "@/components/layout/JournalDetails.vue";
import List from "@/components/layout/List.vue";
import Profile from "@/components/layout/Profile.vue";
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/home',
        name: 'Home',
        component: DashBoard,
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/journal/:id',
        name: 'EventDetail',
        component: JournalDetails,
        props: true
    }
    ,
    {
        path: '/list',
        name: 'List',
        component: List,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
