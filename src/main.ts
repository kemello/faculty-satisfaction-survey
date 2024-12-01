import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import '@/assets/styles.scss';
import '@/assets/tailwind.css';


const app = createApp(App);

app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
        }
    }
});
app.mount('#app');

