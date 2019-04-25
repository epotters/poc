import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {buildQueryString, commandFactory, getHeaders} from './utils';
import {baseUrl} from '../../config';
import {PageSortFilterPayload, PartialPersonPayload, PersonIdPayload} from './interfaces';


// List people
const fetchPeopleCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {
  const token = get(path('user', 'token'));
  const queryString = buildQueryString(page, pageSize, options);
  console.log(queryString);
  const response = await fetch(
      baseUrl + queryString,
      {
        method: "get",
        headers: getHeaders(token)
      }
  );
  const json = await response.json();
  console.log(json);
  return [
    replace(path("peopleList", "properties", "people"), json.content),
    replace(path("peopleList", "properties", "meta"), {total: json.totalElements})
  ];
});



const createPersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(baseUrl, {
    method: 'put',
    body: JSON.stringify(person),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const startLoadingPersonCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor', 'properties', 'personId'), undefined),
    replace(path('personEditor', 'properties','person'), undefined),
    replace(path('personEditor', 'loading'), true),
    replace(path('personEditor', 'loaded'), false)
  ];
});


const loadPersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(baseUrl + `${personId}`, {
    headers: getHeaders(token)
  });
  const json = await response.json();

  if (!response.ok) {
    return [replace(path('personEditor', 'loading'), false), replace(path('errors'), json.errors)];
  }

  return [
    replace(path('personEditor', 'properties', 'personId'), personId),
    replace(path('personEditor', 'properties', 'person'), json.person),
    replace(path('personEditor', 'loading'), false),
    replace(path('personEditor', 'loaded'), true)
  ];
});


const savePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(baseUrl + `${person.id}`, {
    method: 'post',
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const updatePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(baseUrl + `${person.id}`, {
    method: 'post',
    body: JSON.stringify(person),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const deletePersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
  const token = get(path('user', 'token'));
  await fetch(baseUrl + `${personId}`, {
    method: 'delete',
    headers: getHeaders(token)
  });
  return [];
});


const clearPersonEditorCommand = commandFactory(({path}) => {
  return [replace(path('personEditor'), {})];
});


export const fetchPeopleProcess = createProcess('list-people', [fetchPeopleCommand]);
export const fetchPersonProcess = createProcess('get-person', [
  startLoadingPersonCommand,
  [loadPersonCommand]
]);
export const clearPersonEditorProcess = createProcess('clear-person-editor', [clearPersonEditorCommand]);
export const createPersonProcess = createProcess('update-person', [createPersonCommand]);

export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const updatePersonProcess = createProcess('update-person', [updatePersonCommand]);
export const deletePersonProcess = createProcess('delete-person', [deletePersonCommand]);

