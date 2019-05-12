import global from '@dojo/framework/shim/global';
import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders, objectToFormEncoded} from './utils';
import {apiUrl, authUrl, clientAuthenticationHeader, sessionKey} from '../../config';
import {PasswordPayload, RouteIdPayload, SetSessionPayload, UsernamePayload} from './interfaces';
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
  console.info('Start logging in...');

  return [replace(path('login', 'loading'), true)];
});


const loginCommand = commandFactory(async ({get, path}) => {
  console.info('Continue logging in...');


  const requestPayload: { [index: string]: string; } = {
    grant_type: 'password',
    username: get(path('login', 'username')),
    password: get(path('login', 'password'))
  };

  let requestBody: string = objectToFormEncoded(requestPayload);
  console.debug('requestBody: ' + requestBody);

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

  console.debug('Login response on the next line:');
  console.debug(json);

  if (!response.ok) {
    console.error('Error logging in');

    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];

    return [
      replace(path('user'), {}),
      replace(path('login', 'loading'), false),
      replace(path('login', 'failed'), true),
      replace(path('errors'), errors)
    ];
  }

  const username = get(path('login', 'username'));
  const userSession: Partial<UserSession> = buildUserSession(json, username);

  global.sessionStorage.setItem(sessionKey, JSON.stringify(userSession));

  console.info('Login successful');

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
  console.info('Start logging out user...');
  return [replace(path('user', 'loading'), true)];
});


const logoutCommand = commandFactory(async ({get, path}) => {

  console.info('Logging out user...');

  const token = get(path('user', 'token'));

  if (!token) {
    console.info('No user is logged in. Stopping.');
    return [];
  }

  const logoutHeaders = getHeaders(clientAuthenticationHeader);
  const logoutUrl = authUrl + 'token';
  console.debug('logoutUrl: ' + logoutUrl);

  const response = await fetch(logoutUrl, {
    method: 'delete',
    headers: logoutHeaders
  });

  const json = await response.json();

  console.debug('Logout response on the next line:');
  console.debug(json);


  if (!response.ok) {

    console.error('Error logging out user');

    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];

    return [
      replace(path('user', 'loading'), false),
      replace(path('errors'), errors)
    ];
  }

  console.debug('About to remove session');
  global.sessionStorage.removeItem(sessionKey);
  console.debug('Session removed, returning, redirecting to home page');

  console.info('User was logged out successfully');

  return [
    replace(path('user'), {}),
    replace(path('user', 'loading'), false),
    replace(path('routing', 'outlet'), 'home')
  ];
});


const refreshTokenCommand = commandFactory(async ({get, path}) => {

  console.info('Checking access token validity...');
  const refreshToken = get(path('user', 'refreshToken'));

  console.debug('Still alive');
  console.debug('Refresh token: ' + refreshToken);


  if (!refreshToken) {
    console.info('No refresh token found');
    return [];
  }

  console.debug('Survived first check');

  // Is the current access token expired
  const refreshOverlap: number = 600;
  const tokenEndTime = get(path('user', 'endTime'));
  console.debug('tokenEndTime: ' + tokenEndTime);
  console.debug('Still there?');
  console.debug('tokenEndTime: ' + tokenEndTime.getTime());

  console.debug('Gone');

  const now = new Date();
  console.debug('Now: ' + now.getTime());


  const tokenExpired: boolean = (now.getTime() > tokenEndTime.getTime() - refreshOverlap);


  console.debug('token expired?: ' + tokenExpired);



  if (tokenExpired) {
    console.info('Access token needs refreshing');
  } else {
    console.info('Access token is still valid');
    return [];
  }

  // Preparing the refresh request
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': clientAuthenticationHeader
  };

  const requestPayload: { [index: string]: string; } = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };
  let requestBody: string = objectToFormEncoded(requestPayload);
  console.debug('Refresh requestBody: ' + requestBody);


  const fullAuthUrl = authUrl + 'token';

  const response = await fetch(fullAuthUrl, {
    method: 'post',
    body: requestBody,
    headers: headers
  });
  const json = await response.json();

  console.debug('Refresh response on the next line:');
  console.debug(json);

  // Error handling
  if (!response.ok) {
    console.info('An error occurred while refreshing the access token');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];
    return [
      replace(path('user'), {}),
      replace(path('errors'), errors)
    ];
  }
  console.info('Access token refreshed successfully');

  const username = get(path('login', 'username'));
  const userSession: Partial<UserSession> = buildUserSession(json, username);

  global.sessionStorage.setItem(sessionKey, JSON.stringify(userSession));

  return [
    replace(path('user',), userSession),
    replace(path('login', 'loading'), false),
    replace(path('login', 'failed'), false),
    replace(path('errors'), undefined)
  ];
});


const startCurrentUserCommand = commandFactory(({path}) => {
  return [replace(path('user', 'loading'), true)];
});


const currentUserCommand = commandFactory(async ({get, path}) => {

  console.info('Updating the current user...');

  const token = get(path('user', 'token'));

  const currentUserUrl = apiUrl + '/users/me';
  const response = await fetch(currentUserUrl, {
    method: 'get',
    headers: getHeaders(token)
  });

  const json = await response.json();

  console.info('Current user response on the next line:');
  console.info(json);

  if (!response.ok) {
    console.error('Error refreshing the user');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];
    return [
      replace(path('user', 'loading'), false),
      replace(path('errors'), errors)
    ];
  }

  console.debug('Updating the user session');
  const currentSession: UserSession = get(path('user'));

  const userSession: UserSession = {
    ...{
      username: json.username,
      displayName: json.displayName,
      roles: json.authorities,
      mail: json.mail
    }, ...currentSession
  };

  global.sessionStorage.setItem(sessionKey, JSON.stringify(userSession));
  console.debug('User session updated successfully with user data');

  return [
    replace(path('user'), userSession),
    replace(path('user', 'loading'), false)
  ];
});


const redirectCommand = commandFactory<RouteIdPayload>(({path, payload: {routeId}}) => {
  return [
    replace(path('routing', 'outlet'), routeId)
  ];
});



function buildUserSession(tokenJson: any, username: string): Partial<UserSession> {
  const tokenType = tokenJson.token_type;
  let token = tokenJson.access_token;
  if (tokenType == 'bearer') {
    token = "Bearer " + token;
  }
  let startTime = new Date();
  let endTime = new Date(startTime.getTime() + parseInt(tokenJson.expires_in) * 1000);
  return {
    username: username,
    token: token,
    refreshToken: tokenJson.refresh_token,
    startTime: startTime,
    endTime: endTime
  };
}


export const loginProcess = createProcess('login', [startLoginCommand, loginCommand, startCurrentUserCommand, currentUserCommand, clearLoginInputs, redirectCommand]);
export const loginUsernameInputProcess = createProcess('login-username-input', [loginUsernameInputCommand]);
export const loginPasswordInputProcess = createProcess('login-password-input', [loginPasswordInputCommand]);
export const setSessionProcess = createProcess('set-session', [setSessionCommand]);
export const logoutProcess = createProcess('logout', [startLogoutCommand, logoutCommand]);
export const currentUserProcesses = createProcess('current-user', [startCurrentUserCommand, currentUserCommand]);
export const refreshTokenProcess = createProcess('refresh-token', [refreshTokenCommand, startCurrentUserCommand, currentUserCommand, redirectCommand]);
