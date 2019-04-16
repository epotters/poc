import has from '@dojo/framework/has/has';
import global from '@dojo/framework/shim/global';
import {Registry} from '@dojo/framework/widget-core/Registry';
import {renderer} from '@dojo/framework/widget-core/vdom';
import {w} from '@dojo/framework/widget-core/d';
import {Store} from '@dojo/framework/stores/Store';
import {registerRouterInjector} from '@dojo/framework/routing/RouterInjector';
import {clearPersonEditorProcess, getPersonProcess} from './processes/personProcesses';

import {App} from './App';

import {setSessionProcess} from './processes/loginProcesses';
import {State} from './interfaces';
import config from './routes';
import {changeRouteProcess} from './processes/routeProcesses';

const store = new Store<State>();
const registry = new Registry();

let session;
if (!has('build-time-render')) {
  session = global.sessionStorage.getItem('poc-session');
}
if (session) {
  setSessionProcess(store)({session: JSON.parse(session)});
}

registry.defineInjector('state', () => () => store);

const router = registerRouterInjector(config, registry);

router.on('nav', ({outlet, context}: any) => {
  changeRouteProcess(store)({outlet, context});
});

function onRouteChange() {
  const outlet = store.get(store.path('routing', 'outlet'));
  const params = store.get(store.path('routing', 'params'));
  if (outlet) {
    const link = router.link(outlet, params);
    if (link !== undefined) {
      router.setPath(link);
    }
  }
}

store.onChange(store.path('routing', 'outlet'), onRouteChange);
store.onChange(store.path('routing', 'params'), onRouteChange);

router.on('outlet', ({outlet, action}) => {
  if (action === 'enter') {
    switch (outlet.id) {
      case 'home':
        //   const isAuthenticated = !!store.get(store.path('user', 'token'));
        break;
      case 'personEditor':
        getPersonProcess(store)({personId: parseInt(outlet.params.personId)});
        break;

        // case 'user':
        // if (outlet.isExact()) {
        //   getProfileProcess(store)({ username: outlet.params.username });
        // }
        // break;
        // case 'settings':
        //   getUserSettingsProcess(store)({});
        //   break;
        //
    }
  } else {
    if (outlet.id === 'edit-post') {
      clearPersonEditorProcess(store)({});
    }
  }
});

const r = renderer(() => w(App, {}));
r.mount({domNode: document.getElementById('app')!, registry});

