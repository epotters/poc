import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory} from './utils';
import {ChangeRoutePayload, RouteIdPayload} from './interfaces';

const changeRouteCommand = commandFactory<ChangeRoutePayload>(({path, payload: {outlet, context}}) => {
  return [
    replace(path('routing', 'outlet'), outlet),
    replace(path('routing', 'params'), context.params),

    // Clear the conversation
    replace(path('feedback'), undefined),
    replace(path('confirmationRequest'), undefined),
    replace(path('errors'), undefined)
  ];
});



const redirectCommand = commandFactory<RouteIdPayload>(({path, payload: {routeId}}) => {

  console.debug('Redirecting to ' + routeId);
  return [
    replace(path('routing', 'outlet'), routeId)
  ];
});

// Exports
export const changeRouteProcess = createProcess('change-route', [changeRouteCommand]);
export const redirectProcess = createProcess('redirect', [redirectCommand]);

