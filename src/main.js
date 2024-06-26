import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import { Lazyload } from 'vant';
import Vant from 'vant';
//这里手动引入下样式,莫名其妙没有自动引入
import 'vant/lib/index.css'
import 'vant/lib/toast/style';
import "vant/lib/notify/style";
import "vant/lib/dialog/style";
import "vant/lib/popup/style";
createApp(App)
.use(Lazyload,{
    loading:require("./assets/image/loading.gif"),
})
.use(Vant)
.use(store)
.use(router)
.mount('#app');
