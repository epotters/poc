// import has from '@dojo/framework/has/has';
import global from '@dojo/framework/shim/global';
import {Registry} from '@dojo/framework/widget-core/Registry';
import {renderer} from '@dojo/framework/widget-core/vdom';
import {w} from '@dojo/framework/widget-core/d';
import {Store} from '@dojo/framework/stores/Store';
import {replace} from "@dojo/framework/stores/state/operations";
import {registerRouterInjector} from '@dojo/framework/routing/RouterInjector';

import {App} from './App';

import {PocState, Session} from './interfaces';
import config from './routes';
import {applicationDisplayName, sessionKey} from "../config";
import {changeRouteProcess} from './processes/routeProcesses';
import {currentUserProcesses, refreshTokenProcess, setSessionProcess} from './processes/loginProcesses';
import {welcomeMessageProcess} from "./processes/homeProcesses";
import {clearPersonEditorProcess, fetchPersonProcess} from './processes/personProcesses';


console.info('Starting application ' + applicationDisplayName);
document.title = applicationDisplayName;

const store = new Store<PocState>();

const registry = new Registry();

// if (!has('build-time-render')) {
let sessionFromStorage: string = global.sessionStorage.getItem(sessionKey);
// }

if (sessionFromStorage) {
  setSessionProcess(store)({session: deserializeSession(sessionFromStorage)});
  console.info('Loaded session from storage');

  refreshTokenProcess(store)({routeId: 'home'});

  currentUserProcesses(store)({routeId: 'home'});

} else {
  console.log('No session yet');
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

  console.debug('action: ' + action + ' ' + outlet.id);

  if (action === 'enter') {
    switch (outlet.id) {
      case 'home':
        welcomeMessageProcess(store)({});
        break;
      case 'currentUser':
        // const isAuthenticated = !!store.get(store.path('user', 'token'));
        break;
      case 'person':
        console.log('About to load person with id: ' + outlet.params.personId);
        fetchPersonProcess(store)({personId: parseInt(outlet.params.personId)});
        console.log('Loaded person  with id: ' + outlet.params.personId);
        break;
      case 'new-person':
        clearPersonEditorProcess(store)({});
        break;
    }
  } else {
    if (outlet.id === 'edit-person') {
      console.debug('Outlet id edit-person, clearing the person editor. Is this necessary?');
      clearPersonEditorProcess(store)({});
    }
  }
});


// Init the store
const {get, path} = store;
replace(path('loginRequest'), {username: '', password: ''});
console.debug(get(path('loginRequest')));


console.debug('Starting the renderer');
const r = renderer(() => w(App, {}));
r.mount({domNode: document.getElementById('app')!, registry});


function deserializeSession(sessionFromStorage: string): Session {
  const sessionOnlyStrings: any = JSON.parse(sessionFromStorage);

  return {
    username: sessionOnlyStrings.username,
    token: sessionOnlyStrings.token,
    refreshToken: sessionOnlyStrings.refreshToken,
    startTime: new Date(sessionOnlyStrings.startTime),
    endTime: new Date(sessionOnlyStrings.endTime)
  };

}

