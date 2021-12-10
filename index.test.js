const happoStatic = require('.');

beforeEach(() => {
  global.window = {};
});

it('#init sets up some globals', () => {
  expect(global.window.happo).toBeFalsy();
  happoStatic.init();
  expect(global.window.happo).toBeTruthy();
  expect(typeof global.window.happo.nextExample).toEqual('function');
  expect(typeof global.window.happo.init).toEqual('function');
});

it('can iterate over registered examples', async () => {
  happoStatic.init();
  happoStatic.registerExample({
    component: 'Foo',
    variant: 'default',
    render: () => {},
  });
  happoStatic.registerExample({
    component: 'Foo',
    variant: 'bar',
    render: () => {},
  });

  expect(await window.happo.nextExample()).toEqual({
    component: 'Foo',
    variant: 'default',
  });
  expect(await window.happo.nextExample()).toEqual({
    component: 'Foo',
    variant: 'bar',
  });
  expect(await window.happo.nextExample()).toBeFalsy();
});

it('passes along properties from the example', async () => {
  happoStatic.init();
  happoStatic.registerExample({
    component: 'Foo',
    variant: 'default',
    waitForContent: 'what?',
    render: () => {},
  });
  expect(await window.happo.nextExample()).toEqual({
    component: 'Foo',
    variant: 'default',
    waitForContent: 'what?',
  });
  expect(await window.happo.nextExample()).toBeFalsy();
});

it('#registerExample validates input', () => {
  expect(() =>
    happoStatic.registerExample({ component: 'Foo', variant: 'Bar' }),
  ).toThrow(/Missing `render` property/);

  expect(() =>
    happoStatic.registerExample({ variant: 'Bar', render: () => {} }),
  ).toThrow(/Missing `component` property/);

  expect(() =>
    happoStatic.registerExample({ component: 'Bar', render: () => {} }),
  ).toThrow(/Missing `variant` property/);

  expect(() =>
    happoStatic.registerExample({
      component: 'Bar',
      variant: 'foo',
      render: true,
    }),
  ).toThrow(/Property `render` must be a function. Got "boolean"./);

  expect(() =>
    happoStatic.registerExample({
      component: 123,
      variant: 'foo',
      render: true,
    }),
  ).toThrow(/Property `component` must be a string. Got "number"./);

  expect(() =>
    happoStatic.registerExample({
      component: '123',
      variant: () => {},
      render: true,
    }),
  ).toThrow(/Property `variant` must be a string. Got "function"./);
});
