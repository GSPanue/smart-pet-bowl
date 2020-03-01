import Route from './Route';
import Auth from '@/router/Middleware/Auth';
import Home from '@/views/Home/Index';
import SignIn from '@/views/SignIn/Index';
import FourOhFour from '@/views/FourOhFour/Index';

const routes = [
  Route.set('/', Home, 'home').middleware(Auth).get(),
  Route.set('/signin', SignIn, 'signIn').middleware(Auth).get(),
  Route.set('*', FourOhFour, 'fourOhFour').get()
];

export default routes;
