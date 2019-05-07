import global from '@dojo/framework/shim/global';
import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import {apiUrl, authUrl, clientAuthenticationHeader, sessionKey} from '../../config';
import {PasswordPayload, SetSessionPayload, UsernamePayload} from './interfaces';
import {UserSession} from "../interfaces";


// Login commands
const loginUsernameInputCommand = commandFactory<UsernamePayload>(({path, payload: {username}}) => {
  return [replace(path('login', 'username'), username)];
});

const loginPasswordInputCommand = commandFactory<PasswordPayload>(({path, payload: {password}}) => {
  return [replace(path('login', 'password'), password)];
});

const clearLoginInputs = commandFactory(({path}) => {
  return [replace(path('login', 'username'), ''), replace(path('login', 'password'), '')];
});

const startLoginCommand = commandFactory(({path}) => {
  console.log('Start logging in');
  return [replace(path('login', 'loading'), true)];
});

const loginCommand = commandFactory(async ({get, path}) => {
  console.log('Logging in');

  const requestPayload: { [index: string]: string; } = {
    grant_type: 'password',
    username: get(path('login', 'username')),
    password: get(path('login', 'password'))
  };

  let requestBody: string = '';
  let first = true;
  for (let key in requestPayload) {
    requestBody += (first ? '' : '&') + key + '=' + requestPayload[key];
    first = false;
  }
  console.log('requestBody: ' + requestBody);

  const fullAuthUrl = authUrl + 'token';

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': clientAuthenticationHeader
  };


  const response = await fetch(fullAuthUrl, {
    method: 'post',
    body: requestBody,
    headers: headers
  });

  const json = await response.json();

  console.log('Login response on the next line:');
  console.log(json);

  if (!response.ok) {

    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];

    return [
      replace(path('login', 'loading'), false),
      replace(path('login', 'failed'), true),
      replace(path('errors'), errors),
      replace(path('user'), {})
    ];
  }

  console.log('Login successful');

  const tokenType = json.token_type;
  let token = json.access_token;
  if (tokenType == 'bearer') {
    token = "Bearer " + token;
  }

  let startTime = new Date();
  let endTime = new Date(startTime.getTime() + parseInt(json.expires_in) * 1000);

  const userSession = {
    username: get(path('login', 'username')),
    token: token,
    refreshToken: json.refresh_token,
    startTime: startTime,
    endTime: endTime
  };

  global.sessionStorage.setItem(sessionKey, JSON.stringify(userSession));

  return [
    replace(path('user',), userSession),
    replace(path('login', 'loading'), false),
    replace(path('login', 'failed'), false),
    replace(path('errors'), undefined)
  ];
});

// End of Login commands


const setSessionCommand = commandFactory<SetSessionPayload>(({path, payload: {session}}) => {
  return [replace(path('user'), session)];
});


const startLogoutCommand = commandFactory(({path}) => {
  console.log('Start logging out user');
  return [replace(path('logout', 'loading'), true)];
});


const logoutCommand = commandFactory(async ({get, path}) => {

  console.log('Logging out user');

  const token = get(path('user', 'token'));
  const logoutHeaders = getHeaders(token);
  logoutHeaders['Authorization'] = clientAuthenticationHeader;

  const logoutUrl = authUrl + 'token';

  console.log('logoutUrl: ' + logoutUrl);

  const response = await fetch(logoutUrl, {
    method: 'delete',
    headers: logoutHeaders
  });

  const json = await response.json();

  console.log('Logout response on the next line:');
  console.log(json);


  if (!response.ok) {

    console.log('Error logging out user remotely');

    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];

    return [
      replace(path('logout', 'loading'), false),
      replace(path('errors'), errors)
    ];
  }

  console.log('About to remove session');

  global.sessionStorage.removeItem(sessionKey);

  console.log('Session removed, returning, redirecting to home page');

  return [
    replace(path('user'), {}),
    replace(path('logout', 'loading'), false),
    replace(path('routing', 'outlet'), 'home')
  ];
});


const startCurrentUserCommand = commandFactory(({path}) => {
  return [replace(path('user', 'loading'), true)];
});


const currentUserCommand = commandFactory(async ({get, path}) => {

  const token = get(path('user', 'token'));

  const currentUserUrl = apiUrl + '/users/me';
  const response = await fetch(currentUserUrl, {
    method: 'get',
    headers: getHeaders(token)
  });

  const json = await response.json();

  console.log('Current user response on the next line:');
  console.log(json);

  if (!response.ok) {
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];
    return [
      replace(path('user', 'loading'), false),
      replace(path('errors'), errors)
    ];
  }

  const currentSession = get(path('user'));
  const userSession: UserSession = {
    ...{
      username: json.username,
      displayName: json.displayName,
      roles: json.authorities,
      mail: json.mail
    }, ...currentSession
  };

  global.sessionStorage.setItem(sessionKey, JSON.stringify(userSession));

  return [
    replace(path('user'), userSession),
    replace(path('logout', 'loading'), false),
    replace(path('routing', 'outlet'), 'home')
  ];
});


export const loginProcess = createProcess('login', [startLoginCommand, loginCommand, startCurrentUserCommand, currentUserCommand, clearLoginInputs]);
export const loginUsernameInputProcess = createProcess('login-username-input', [loginUsernameInputCommand]);
export const loginPasswordInputProcess = createProcess('login-password-input', [loginPasswordInputCommand]);
export const setSessionProcess = createProcess('set-session', [setSessionCommand]);
export const logoutProcess = createProcess('logout', [startLogoutCommand, logoutCommand]);
export const currentUserProcesses = createProcess('current-user', [startCurrentUserCommand, currentUserCommand]);
