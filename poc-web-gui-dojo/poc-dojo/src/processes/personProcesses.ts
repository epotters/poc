import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import {baseUrl} from '../../config';
import {PartialPersonPayload, PersonIdPayload} from './interfaces';


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


export const getPersonProcess = createProcess('get-person', [
  startLoadingPersonCommand,
  [loadPersonCommand]
]);
export const clearPersonEditorProcess = createProcess('clear-person', [clearPersonEditorCommand]);
export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const deletePersonProcess = createProcess('delete-person', [deletePersonCommand]);

