// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

// Cấu hình CSS cho giao diện ứng dụng
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import '@/assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n';
import mitt from 'mitt';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import enMessages from 'devextreme/localization/messages/en.json'
import viMessages from 'devextreme/localization/messages/vi.json'

import {locale, loadMessages} from 'devextreme/localization'

loadMessages(enMessages)
loadMessages(viMessages)

const emitter = mitt();
const app = createApp(App)

app.config.globalProperties.emitter = emitter;


app.use(router)
app.use(i18n)
app.use(ToastPlugin);

app.mount('#app')
