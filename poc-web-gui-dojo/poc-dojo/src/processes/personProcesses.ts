import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {buildQueryString, commandFactory, getHeaders} from './utils';
import {baseUrl} from '../../config';
import {PageSortFilterPayload, PartialPersonPayload, PersonIdPayload} from './interfaces';


// List people
const listPeopleCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {

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

  return [
    replace(path("peopleList", "people"), json.content),
    replace(path("peopleList", "meta"), json.content),
  ];

});


const updatePersonCommand = commandFactory<PartialPersonPayload>(({path}) => {

  return [];
});


const startLoadingPersonCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor', 'personId'), undefined),
    replace(path('personEditor', 'person'), undefined),
    replace(path('personEditor', 'loading'), true),
    replace(path('personEditor', 'loaded'), false)
  ];
});


const loadPersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(`${baseUrl}/persons/${personId}`, {
    headers: getHeaders(token)
  });
  const json = await response.json();

  return [
    replace(path('personEditor', 'personId'), personId),
    replace(path('personEditor', 'person'), json.person),
    replace(path('personEditor', 'loading'), false),
    replace(path('personEditor', 'loaded'), true)
  ];
});


const savePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));
  await fetch(`${baseUrl}/persons/${person.id}`, {
    method: 'post',
    headers: getHeaders(token)
  });
  return [];
});


const deletePersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
  const token = get(path('user', 'token'));
  await fetch(`${baseUrl}/persons/${personId}`, {
    method: 'delete',
    headers: getHeaders(token)
  });
  return [];
});


const clearPersonEditorCommand = commandFactory(({path}) => {
  return [replace(path('personEditor'), {})];
});


export const listPeopleProcess = createProcess('list-people', [listPeopleCommand]);
export const getPersonProcess = createProcess('get-person', [
  startLoadingPersonCommand,
  [loadPersonCommand]
]);
export const clearPersonEditorProcess = createProcess('clear-person-editor', [clearPersonEditorCommand]);
export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const updatePersonProcess = createProcess('update-person', [updatePersonCommand])
export const deletePersonProcess = createProcess('delete-person', [deletePersonCommand]);

