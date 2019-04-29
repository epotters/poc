import global from '@dojo/framework/shim/global';
import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import {authUrl} from '../../config';
import {EmailPayload, PasswordPayload, SetSessionPayload, UsernamePayload} from './interfaces';


// Login commands
const loginEmailInputCommand = commandFactory<EmailPayload>(({path, payload: {email}}) => {
  return [replace(path('login', 'email'), email)];
});

const loginPasswordInputCommand = commandFactory<PasswordPayload>(({path, payload: {password}}) => {
  return [replace(path('login', 'password'), password)];
});

const clearLoginInputs = commandFactory(({path}) => {
  return [replace(path('login', 'password'), ''), replace(path('login', 'email'), '')];
});

const startLoginCommand = commandFactory(({path}) => {
  return [replace(path('login', 'loading'), true)];
});

const loginCommand = commandFactory(async ({get, path}) => {
  const requestPayload = {
    user: get(path('login'))
  };

  const response = await fetch(`${authUrl}/authorize`, {
    method: 'post',
    body: JSON.stringify(requestPayload),
    headers: getHeaders()
  });

  const json = await response.json();
  if (!response.ok) {
    return [
      replace(path('login', 'failed'), true),
      replace(path('login', 'loading'), false),
      replace(path('errors'), json.errors),
      replace(path('user'), {})
    ];
  }

  global.sessionStorage.setItem('poc-session', JSON.stringify(json.user));

  return [
    replace(path('routing', 'outlet'), 'home'),
    replace(path('login', 'loading'), false),
    replace(path('errors'), undefined),
    replace(path('user'), json.user)
  ];
});

// End of Login commands


const setSessionCommand = commandFactory<SetSessionPayload>(({path, payload: {session}}) => {
  return [replace(path('user'), session)];
});





// Register commands

const registerUsernameInputCommand = commandFactory<UsernamePayload>(({path, payload: {username}}) => {
  return [replace(path('register', 'username'), username)];
});

const registerEmailInputCommand = commandFactory<EmailPayload>(({path, payload: {email}}) => {
  return [replace(path('register', 'email'), email)];
});

const registerPasswordInputCommand = commandFactory<PasswordPayload>(({path, payload: {password}}) => {
  return [replace(path('register', 'password'), password)];
});


const startRegisterCommand = commandFactory(({path}) => {
  return [replace(path('register', 'loading'), true)];
});

const clearRegisterInputs = commandFactory(({path}) => {
  return [
    replace(path('register', 'password'), ''),
    replace(path('register', 'email'), ''),
    replace(path('register', 'username'), '')
  ];
});


const registerCommand = commandFactory(async ({get, path}) => {
  const requestPayload = {
    user: get(path('register'))
  };

  const response = await fetch(`${authUrl}/users`, {
    method: 'post',
    body: JSON.stringify(requestPayload),
    headers: getHeaders()
  });
  const json = await response.json();
  if (!response.ok) {
    return [
      replace(path('register', 'failed'), true),
      replace(path('register', 'loading'), false),
      replace(path('errors'), json.errors),
      replace(path('user'), {})
    ];
  }

  global.sessionStorage.setItem('poc-session', JSON.stringify(json.user));

  return [
    replace(path('routing', 'outlet'), 'home'),
    replace(path('register', 'loading'), false),
    replace(path('errors'), undefined),
    replace(path('user'), json.user)
  ];
});

// End Register commands

const logoutCommand = commandFactory(({path}) => {
  global.sessionStorage.removeItem('poc-session');
  return [replace(path('user'), {}), replace(path('routing', 'outlet'), 'home')];
});



export const loginProcess = createProcess('login', [startLoginCommand, loginCommand, clearLoginInputs]);
export const loginEmailInputProcess = createProcess('login-email-input', [loginEmailInputCommand]);
export const loginPasswordInputProcess = createProcess('login-password-input', [loginPasswordInputCommand]);

export const registerProcess = createProcess('register', [startRegisterCommand, registerCommand, clearRegisterInputs]);
export const registerEmailInputProcess = createProcess('register-email-input', [registerEmailInputCommand]);
export const registerPasswordInputProcess = createProcess('register-password-input', [registerPasswordInputCommand]);
export const registerUsernameInputProcess = createProcess('register-username-input', [registerUsernameInputCommand]);

export const setSessionProcess = createProcess('set-session', [setSessionCommand]);
export const logoutProcess = createProcess('logout', [logoutCommand]);