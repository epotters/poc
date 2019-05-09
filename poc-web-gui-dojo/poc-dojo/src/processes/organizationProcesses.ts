import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {buildQueryString, commandFactory, getHeaders} from './utils';
import {organizationsUrl} from '../../config';
import {PageSortFilterPayload, PartialOrganizationPayload, OrganizationIdPayload} from './interfaces';



// List organizations
const fetchOrganizationsCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {


  const token = get(path('user', 'token'));

  const queryString = buildQueryString(page, pageSize, options);
  console.log(queryString);
  const response = await fetch(
    organizationsUrl + queryString,
    {
      method: "get",
      headers: getHeaders(token)
    }
  );
  const json = await response.json();

  console.log(json);
  return [
    // replace(path(storeId, 'data', 'pages', `page-${page}`), json.content),
    // replace(path(storeId, 'meta', 'total'), json.totalElements),
    // replace(path(storeId, 'meta', 'pageSize'), pageSize)
  ];
});



const createOrganizationCommand = commandFactory<PartialOrganizationPayload>(async ({get, path, payload: {organization}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(organizationsUrl, {
    method: 'put',
    body: JSON.stringify(organization),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const startLoadingOrganizationCommand = commandFactory(({path}) => {
  return [
    // replace(path('organizationEditor', 'properties', 'organizationId'), undefined),
    replace(path('organizationEditor', 'organization'), undefined),
    replace(path('organizationEditor', 'loading'), true),
    replace(path('organizationEditor', 'loaded'), false)
  ];
});


const loadOrganizationCommand = commandFactory<OrganizationIdPayload>(async ({get, path, payload: {organizationId}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(organizationsUrl + `${organizationId}`, {
    headers: getHeaders(token)
  });
  const json = await response.json();

  if (!response.ok) {
    return [
      replace(path('organizationEditor', 'loading'), false),
      replace(path('errors'), json.errors)];
  }

  return [
    // replace(path('organizationEditor', 'properties', 'organizationId'), organizationId),
    replace(path('organizationEditor', 'organization'), json.organization),
    replace(path('organizationEditor', 'loading'), false),
    replace(path('organizationEditor', 'loaded'), true)
  ];
});


const saveOrganizationCommand = commandFactory<PartialOrganizationPayload>(async ({get, path, payload: {organization}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(organizationsUrl + `${organization.id}`, {
    method: 'post',
    body: JSON.stringify(organization),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const updateOrganizationCommand = commandFactory<PartialOrganizationPayload>(async ({get, path, payload: {organization}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(organizationsUrl + `${organization.id}`, {
    method: 'post',
    body: JSON.stringify(organization),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const deleteOrganizationCommand = commandFactory<OrganizationIdPayload>(async ({get, path, payload: {organizationId}}) => {
  const token = get(path('user', 'token'));
  await fetch(organizationsUrl + `${organizationId}`, {
    method: 'delete',
    headers: getHeaders(token)
  });
  return [];
});


const clearOrganizationEditorCommand = commandFactory(({path}) => {
  return [replace(path('organizationEditor'), {})];
});


export const fetchOrganizationsProcess = createProcess('list-organizations', [fetchOrganizationsCommand]);
export const fetchOrganizationProcess = createProcess('get-organization', [startLoadingOrganizationCommand, loadOrganizationCommand]);
export const clearOrganizationEditorProcess = createProcess('clear-organization-editor', [clearOrganizationEditorCommand]);
export const createOrganizationProcess = createProcess('update-organization', [createOrganizationCommand]);
export const saveOrganizationProcess = createProcess('save-organization', [saveOrganizationCommand]);
export const updateOrganizationProcess = createProcess('update-organization', [updateOrganizationCommand]);
export const deleteOrganizationProcess = createProcess('delete-organization', [deleteOrganizationCommand]);

