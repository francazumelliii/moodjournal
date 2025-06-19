import { createApp } from 'vue'
import App from './App.vue'
import Router from '@/router/index.js'

import Vue3ColorPicker from 'vue3-colorpicker'
import { Multiselect } from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import 'vue3-colorpicker/style.css'
import FullCalendar from 'vue-fullcalendar'


const app = createApp(App)

app.use(Router)
app.use(Vue3ColorPicker)

app.component('Multiselect', Multiselect)
app.component('FullCalendar', FullCalendar)

app.mount('#app')
