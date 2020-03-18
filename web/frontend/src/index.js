import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import App from '@/App';
import store from '@/store';
import routes from '@/router';
import {
  Row,
  Col,
  Card,
  Form,
  FormItem,
  Input,
  Button,
  Dialog,
  Table,
  TableColumn
} from 'element-ui';

Vue.use(VueRouter);
Vue.use(VueAxios, Axios);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);

export default new Vue({
  store,
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
