import store from 'store';

class Auth {
  handle({ name }, from, next) {
    const account = store.get('account');

    if (account) {
      if (name !== 'home') {
        return next('/');
      }

      return next();
    }
    else {
      if (name !== 'signIn') {
        return next('signin');
      }

      return next();
    }
  }
}

export default Auth;
