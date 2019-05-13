import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory} from './utils';
import {ChangeRoutePayload, RouteIdPayload} from './interfaces';

const changeRouteCommand = commandFactory<ChangeRoutePayload>(({path, payload: {outlet, context}}) => {
  return [
    replace(path('routing', 'outlet'), outlet),
    replace(path('routing', 'params'), context.params),
    // replace(path('user', 'loaded'), false),
    replace(path('personEditor', 'loaded'), false),
    replace(path('errors'), undefined)
  ];
});

const redirectCommand = commandFactory<RouteIdPayload>(({path, payload: {routeId}}) => {
  return [
    replace(path('routing', 'outlet'), routeId)
  ];
});

// Exports
export const changeRouteProcess = createProcess('change-route', [changeRouteCommand]);
export const redirectProcess = createProcess('redirect', [redirectCommand]);

