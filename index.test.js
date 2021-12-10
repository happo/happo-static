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
