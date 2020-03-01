class Route {
  constructor(path, component, name) {
    this.path = path;
    this.component = component;
    this.name = name;
  }

  static set(path, component, name) {
    return new this(path, component, name);
  }

  middleware(Middleware) {
    this.Middleware = new Middleware();

    return this;
  }

  get() {
    const { path, component, name } = this;

    return {
      path,
      component,
      name,
      beforeEnter: (to, from, next) => {
        if (!this.Middleware) {
          return next();
        }

        return this.Middleware.handle(to, from, next);
      }
    };
  }
}

export default Route;
