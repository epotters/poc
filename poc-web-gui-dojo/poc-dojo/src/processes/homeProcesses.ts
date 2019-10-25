import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import * as config from '../../config';


const fetchWelcomeMessageCommand = commandFactory(async ({get, path}) => {

  const token = get(path('session', 'token'));

  const response = await fetch(config.welcomeUrl, {
    headers: getHeaders(token)
  });

  const json = await response.json();

  console.debug(json);

  return [
    replace(path('home', 'welcomeMessage'), json.message)
  ];

});

export const welcomeMessageProcess = createProcess('welcome-message', [fetchWelcomeMessageCommand]);
