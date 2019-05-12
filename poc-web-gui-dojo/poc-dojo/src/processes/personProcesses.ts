import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {buildQueryString, commandFactory, getHeaders} from './utils';
import {peopleUrl} from '../../config';
import {ConfirmedPersonActionPayload, PageSortFilterPayload, PartialPersonPayload, PersonIdPayload} from './interfaces';
import {Person} from "../interfaces";


const personEditorInputCommand = commandFactory<PartialPersonPayload>(({get, path, payload: {person}}) => {

  console.log('Updating state of person fields');
  console.log(person);

  const currentPerson = get(path('personEditor', 'person'));
  const updatedPerson = {...currentPerson, ...person};

  console.log('Updated state of person fields');
  console.log(updatedPerson);

  return [replace(path('personEditor', 'person'), updatedPerson)];
});


// List people
const fetchPeopleCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {

  const token = get(path('user', 'token'));

  const queryString = buildQueryString(page, pageSize, options);
  console.log(queryString);
  const response = await fetch(
    peopleUrl + queryString,
    {
      method: "get",
      headers: getHeaders(token)
    }
  );
  const json = await response.json();

  console.log(json);
  return []; // Updating the store is handled by the Grid component (for now)
});


const startLoadingPersonCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor', 'person'), undefined),
    replace(path('personEditor', 'loading'), true),
    replace(path('personEditor', 'loaded'), false)
  ];
});


const loadPersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(peopleUrl + `${personId}`, {
    headers: getHeaders(token)
  });
  const json = await response.json();

  if (!response.ok) {
    return [
      replace(path('personEditor', 'loading'), false),
      replace(path('errors'), json.errors)];
  }

  return [
    replace(path('personEditor', 'person'), json),
    replace(path('personEditor', 'loading'), false),
    replace(path('personEditor', 'loaded'), true)
  ];
});


const createPersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));
  const response = await fetch(peopleUrl, {
    method: 'put',
    body: JSON.stringify(person),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);
  return [];
});


const savePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));

  const updatedPerson: Partial<Person> = get(path('personEditor', 'person'));

  if (!updatedPerson) {
    console.info('No updated person found. Quitting save process');
    return [];
  }

  const response = await fetch(peopleUrl + `${person.id}`, {
    method: 'post',
    body: JSON.stringify(updatedPerson),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.log(json);

  if (!response.ok) {
    console.log('Error saving person');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.message];
    return [
      replace(path('errors'), errors)
    ];
  }

  return [
    replace(path('feedback'), {text: 'Person saved'}),
    replace(path('errors'), undefined)
  ];
});


const startDeleteCommand = commandFactory<ConfirmedPersonActionPayload>(({path, payload: {confirmationRequest}}) => {

  if (confirmationRequest && confirmationRequest.action == 'delete-person' && confirmationRequest.confirmed) {
    confirmationRequest.confirming = true;
  }

  return [
    replace(path('personEditor', 'confirmationRequest'), confirmationRequest),
  ];
});


const deletePersonCommand = commandFactory<ConfirmedPersonActionPayload>(async ({get, path, payload: {personId}}) => {

    const confirmationRequest = get(path('personEditor', 'confirmationRequest'));
    if (!confirmationRequest || confirmationRequest.action !== 'delete-person') {
      return [];
    }

    if (confirmationRequest.confirmed === true) {
      console.log('Delete is confirmed and will be executed');
    } else {
      console.log('Delete is not yet confirmed by the user Delete will not be executed');
      return [];
    }

    const token = get(path('user', 'token'));
    const response = await fetch(peopleUrl + `${personId}`, {
      method: 'delete',
      headers: getHeaders(token)
    });

    const json = await response.json();
    console.log(json);

    if (!response.ok) {
      console.log('Error deleting person');
      let errors: { [index: string]: string[]; } = {};
      errors[json.error] = [json.message];
      return [
        replace(path('errors'), errors)
      ];
    }

    return [
      replace(path('personEditor', 'person'), undefined),
      replace(path('personEditor', 'confirmationRequest'), undefined),
      replace(path('feedback'), {text: 'Person deleted'}),
      replace(path('errors'), undefined)
    ];
  }
);


const cancelPersonDeleteCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor', 'confirmationRequest'), undefined)
  ];
});


const clearPersonEditorCommand = commandFactory(({path}) => {
  return [replace(path('personEditor'), {})];
});


export const fetchPeopleProcess = createProcess('list-people', [fetchPeopleCommand]);
export const fetchPersonProcess = createProcess('get-person', [startLoadingPersonCommand, loadPersonCommand]);
export const createPersonProcess = createProcess('create-person', [createPersonCommand]);
export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const deletePersonProcess = createProcess('delete-person', [startDeleteCommand, deletePersonCommand, clearPersonEditorCommand]);
export const personEditorInputProcess = createProcess('person-editor-input', [personEditorInputCommand]);
export const clearPersonEditorProcess = createProcess('clear-person-editor', [clearPersonEditorCommand]);

export const cancelPersonDeleteProcess = createProcess('cancel-delete-person', [cancelPersonDeleteCommand]);



