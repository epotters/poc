import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import * as config from '../../config';
// import {welcomeUrl} from '../../config';


// Homepage commands
const fetchWelcomeMessageCommand = commandFactory(async ({get, path}) => {

  const token = get(path('user', 'token'));

  const response = await fetch(config.welcomeUrl, {
    headers: getHeaders(token)
  });

  const json = await response.json();

  return [
    replace(path('home', 'properties', 'welcomeMessage'), json.message)
  ];

});

export const welcomeMessageProcess = createProcess('welcome-message', [fetchWelcomeMessageCommand]);
