import global from '@dojo/framework/shim/global';
import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders, objectToFormEncoded} from './utils';
import {apiUrl, clientAuthenticationHeader, sessionKey, tokenUrl} from '../../config';
import {PartialLoginRequestPayload, RouteIdPayload, SetSessionPayload} from './interfaces';
import {Session, User} from "../interfaces";


// Login commands
const loginRequestInputCommand = commandFactory<PartialLoginRequestPayload>(({get, path, payload: {loginRequest}}) => {

  const currentLoginRequest = get(path('loginRequest'));
  const updatedLoginRequest = {...currentLoginRequest, ...loginRequest};

  return [replace(path('loginRequest'), updatedLoginRequest)];
});


const clearLoginInputsCommand = commandFactory(({path}) => {
  console.debug('Clearing login form');

  return [
    replace(path('loginRequest'), {})
  ];
});


const startLoginCommand = commandFactory(({path}) => {
  console.info('Start logging in...');

  return [
    replace(path('loginRequest', 'loading'), true)
  ];
});


const loginCommand = commandFactory(async ({get, path}) => {
  console.info('Continue logging in...');

  const requestPayload: { [index: string]: string; } = {
    grant_type: 'password',
    username: get(path('loginRequest', 'username')),
    password: get(path('loginRequest', 'password'))
  };

  let requestBody: string = objectToFormEncoded(requestPayload);
  console.debug('requestBody: ' + requestBody);

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': clientAuthenticationHeader
  };

  const response = await fetch(tokenUrl, {
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
      replace(path('loginRequest', 'loading'), false),
      replace(path('loginRequest', 'failed'), true),
      replace(path('errors'), errors)
    ];
  }

  const username = get(path('loginRequest', 'username'));
  const session: Session = buildSession(json, username);

  global.sessionStorage.setItem(sessionKey, JSON.stringify(session));

  console.info('Login successful');

  return [
    replace(path('session'), session),
    replace(path('feedback', 'text'), 'Login successful'),
    replace(path('loginRequest'), undefined),
    replace(path('errors'), undefined)
  ];
});

// End of Login commands


const setSessionCommand = commandFactory<SetSessionPayload>(({path, payload: {session}}) => {
  return [replace(path('session'), session)];
});


const startLogoutCommand = commandFactory(({path}) => {
  console.info('Start logging out user...');
  return [replace(path('user', 'loading'), true)];
});


const logoutCommand = commandFactory(async ({get, path}) => {

  console.info('Logging out user...');

  const token = get(path('session', 'token'));

  if (!token) {
    console.info('No user is logged in. Stopping.');
    return [];
  }

  const logoutHeaders = getHeaders(clientAuthenticationHeader);

  const response = await fetch(tokenUrl, {
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
    replace(path('session'), {}),
    replace(path('feedback', 'text'), 'User was logged out successfully'),
    replace(path('routing', 'outlet'), 'home')
  ];
});


const refreshTokenCommand = commandFactory(async ({get, path}) => {

  console.info('Checking access token validity...');
  const refreshToken = get(path('session', 'refreshToken'));

  if (!refreshToken) {
    console.info('No refresh token found');
    return [];
  }


  // Is the current access token expired
  const refreshOverlap: number = 600;
  const tokenEndTime = get(path('session', 'endTime'));
  const now = new Date();
  const tokenExpired: boolean = (now.getTime() > tokenEndTime.getTime() - refreshOverlap);

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
  const requestBody: string = objectToFormEncoded(requestPayload);
  console.debug('Refresh requestBody: ' + requestBody);

  const response = await fetch(tokenUrl, {
    method: 'post',
    body: requestBody,
    headers: headers
  });
  const json = await response.json();

  console.debug('Refresh response on the next line:');
  console.debug(json);


  // Error handling
  // TODO Handle expired refresh token explicitly
  // {
  //   "error" : "invalid_token",
  //   "error_description" : "Invalid refresh token (expired): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicG9jLWFwaSJdLCJtYWlsIjoiZXBvdHRlcnNAeHM0YWxsLm5sIiwidXNlcl9uYW1lIjoiZXBvIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImF0aSI6ImNkYTE4NjE4LTMxYzktNDBjNy1hMGZkLTY1ODIyODU0NWE4NiIsImV4cCI6MTU1NzkxNDA5NiwiYXV0aG9yaXRpZXMiOlsiVVNFUiIsIkFDVFVBVE9SIiwiQURNSU4iXSwianRpIjoiYjQxODdkN2YtM2JiZC00MGVlLThhZjEtZTM5MjRkMThlNjZjIiwiY2xpZW50X2lkIjoicG9jIn0.OBvrKu4VN84yeRPdT5xJjKKYCPai1AvxjS-tIYiwgRM"
  // }

  if (!response.ok) {
    console.info('An error occurred while refreshing the access token');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.error_description];
    return [
      replace(path('errors'), errors)
    ];
  }
  console.info('Access token refreshed successfully');

  const username = get(path('session', 'username'));
  const session: Session = buildSession(json, username);

  global.sessionStorage.setItem(sessionKey, JSON.stringify(session));

  return [
    replace(path('session',), session),
    replace(path('feedback', 'text'), 'Access token refreshed successfully'),
    replace(path('errors'), undefined)
  ];
});


const startCurrentUserCommand = commandFactory(({path}) => {
  return [replace(path('user', 'loading'), true)];
});


const currentUserCommand = commandFactory(async ({get, path}) => {

  console.info('Updating the current user...');

  const token = get(path('session', 'token'));

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

  const currentUser: User = {
    username: json.username,
    displayName: json.displayName,
    roles: json.authorities,
    mail: json.mail,

    loading: false,
    loaded: true
  };

  console.debug('Current user refreshed');

  return [
    replace(path('user'), currentUser),
    replace(path('feedback', 'text'), 'Current user refreshed'),
    replace(path('errors'), undefined)
  ];
});


const redirectCommand = commandFactory<RouteIdPayload>(({path, payload: {routeId}}) => {
  return [
    replace(path('routing', 'outlet'), routeId)
  ];
});


function buildSession(tokenJson: any, username: string): Session {
  const tokenType = tokenJson.token_type;
  let token = tokenJson.access_token;
  if (tokenType == 'bearer') {
    token = "Bearer " + token;
  }
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + parseInt(tokenJson.expires_in) * 1000);
  return {
    username: username,
    token: token,
    refreshToken: tokenJson.refresh_token,
    startTime: startTime,
    endTime: endTime
  };
}


// Processes
export const clearLoginProcess = createProcess('clear-login', [clearLoginInputsCommand])
export const loginProcess = createProcess('login', [startLoginCommand, loginCommand, startCurrentUserCommand, currentUserCommand, clearLoginInputsCommand]);
export const loginRequestInputProcess = createProcess('login-request-input', [loginRequestInputCommand]);
export const setSessionProcess = createProcess('set-session', [setSessionCommand]);
export const logoutProcess = createProcess('logout', [startLogoutCommand, logoutCommand]);
export const refreshTokenProcess = createProcess('refresh-token', [refreshTokenCommand, redirectCommand]);

export const currentUserProcesses = createProcess('current-user', [startCurrentUserCommand, currentUserCommand]);

