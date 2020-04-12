import Route from '../Route';

describe('Route', () => {
  it('should have a path, component, and name', () => {
    const component = () => {};
    const route = new Route('/', component, 'home');

    expect(route.path).toEqual('/');
    expect(route.component).toEqual(component);
    expect(route.name).toEqual('home');
  });

  it('should get the path, component, and name', () => {
    const component = () => {};
    const args = ['/', component, 'home'];
    const route = new Route(...args);

    const result = route.get();

    expect(result.path).toEqual(args[0]);
    expect(result.component).toEqual(args[1]);
    expect(result.name).toEqual(args[2]);
  });
});
