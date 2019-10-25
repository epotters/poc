
// Application
export const applicationDisplayName = 'Proof of Concept!';
export const sessionKey = 'poc-session';


// General
export const locale = 'nl-NL';
export const timezone = 'Europe/Amsterdam';
export const dateFormatOptions = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };


// Security
export const tokenUrl = 'http://localhost:8003/oauth/token';
export const clientId = 'poc';
export const clientAuthenticationHeader = 'Basic cG9jOjk4NzY1NDMyMTA=';


// API
const baseUrl = 'http://localhost:8002/poc';
export const apiUrl = baseUrl + '/api';
export const welcomeUrl = baseUrl + '/api/welcome/';
export const peopleUrl = baseUrl + '/api/people/';
export const organizationsUrl = baseUrl + '/api/organizations/';
