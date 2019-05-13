import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {buildQueryString, buildQueryStringForFilter, commandFactory, getHeaders} from './utils';
import {peopleUrl} from '../../config';
import {
  ConfirmationPayload,
  ConfirmedPersonActionPayload,
  PageSortFilterPayload,
  PartialPersonPayload,
  PersonIdPayload
} from './interfaces';
import {Person} from "../interfaces";


const personEditorInputCommand = commandFactory<PartialPersonPayload>(({get, path, payload: {person}}) => {

  console.debug('Updating state of person fields');
  console.debug(person);

  const currentPerson = get(path('personEditor', 'person'));
  const updatedPerson = {...currentPerson, ...person};

  // console.debug('Updated state of person fields');
  // console.debug(updatedPerson);

  return [replace(path('personEditor', 'person'), updatedPerson)];
});


// List people
const fetchPeopleCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {

  const token = get(path('user', 'token'));
  const queryString = buildQueryString(page, pageSize, options);

  console.debug(queryString);
  const response = await fetch(
    peopleUrl + queryString,
    {
      method: "get",
      headers: getHeaders(token)
    }
  );
  const json = await response.json();

  console.debug(json);
  return []; // Updating the store is handled by the Grid component
});


const startFetchingPersonCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor', 'person'), undefined),
    replace(path('personEditor', 'loading'), true),
    replace(path('personEditor', 'loaded'), false)
  ];
});


const fetchPersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
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
  console.debug(json);
  return [];
});


const savePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('user', 'token'));

  const updatedPerson: Partial<Person> = get(path('personEditor', 'person'));

  if (!updatedPerson) {
    console.info('No updated person found. Quitting save process');
    return [];
  }

  let url = peopleUrl;
  let method = 'put';
  if (updatedPerson.id != undefined) {

    url = peopleUrl + `${person.id}`;
    method = 'post';
  }

  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(updatedPerson),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.debug(json);

  if (!response.ok) {
    console.error('Error saving person');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.message];
    return [
      replace(path('errors'), errors)
    ];
  }

  console.info('Person saved successfully');

  return [
    replace(path('feedback'), {text: 'Person saved'}),
    replace(path('errors'), undefined)
  ];
});


const startDeletePersonCommand = commandFactory<ConfirmedPersonActionPayload>(({path, payload: {confirmationRequest}}) => {

  if (confirmationRequest && confirmationRequest.action == 'delete-person' && confirmationRequest.confirmed) {
    confirmationRequest.confirming = true;
  }

  return [
    replace(path('confirmationRequest'), confirmationRequest),
  ];
});


const deletePersonCommand = commandFactory<ConfirmedPersonActionPayload>(async ({get, path, payload: {personId}}) => {

    const confirmationRequest = get(path('confirmationRequest'));
    if (!confirmationRequest || confirmationRequest.action !== 'delete-person') {
      return [];
    }

    if (confirmationRequest.confirmed) {
      console.info('Delete is confirmed and will be executed');
    } else {
      console.info('Delete is not yet confirmed by the user Delete will not be executed');
      return [];
    }

    const token = get(path('user', 'token'));
    const response = await fetch(peopleUrl + `${personId}`, {
      method: 'delete',
      headers: getHeaders(token)
    });

    const json = await response.json();
    console.debug(json);

    if (!response.ok) {
      console.error('Error deleting person');
      let errors: { [index: string]: string[]; } = {};
      errors[json.error] = [json.message];
      return [
        replace(path('errors'), errors)
      ];
    }

    console.info('Person deleted successfully');


    return [
      replace(path('personEditor', 'person'), undefined),
      replace(path('confirmationRequest'), undefined),
      replace(path('feedback'), {text: 'Person deleted'}),
      replace(path('errors'), undefined)
    ];
  }
);


const cancelPersonActionCommand = commandFactory(({path}) => {
  return [
    replace(path('confirmationRequest'), undefined)
  ];
});


const clearPersonEditorCommand = commandFactory(({path}) => {
  return [replace(path('personEditor'), {})];
});


const startBatchUpdatePeopleCommand = commandFactory<ConfirmationPayload>(({path, payload: {confirmationRequest}}) => {
  if (confirmationRequest && confirmationRequest.action == 'update-people' && confirmationRequest.confirmed) {
    confirmationRequest.confirming = true;
  }
  return [
    replace(path('confirmationRequest'), confirmationRequest),
  ];
});


const batchUpdatePeopleCommand = commandFactory<ConfirmationPayload>(async ({get, path, payload: {}}) => {

  const confirmationRequest = get(path('confirmationRequest'));
  if (!confirmationRequest || confirmationRequest.action !== 'update-people') {
    return [];
  }

  if (confirmationRequest.confirmed) {
    console.info('Batch update action is confirmed and will be executed');
  } else {
    console.info('Batch update action is not yet confirmed by the user and will not be executed');
    return [];
  }

  const updatedPerson: Partial<Person> = get(path('peopleList', 'personForBatchUpdate'));

  const {meta} = get(path("peopleGridState", 'meta'));
  const queryString = buildQueryStringForFilter({filter: meta.filter});
  const token = get(path('user', 'token'));

  const response = await fetch(peopleUrl + queryString, {
    method: 'patch',
    body: JSON.stringify(updatedPerson),
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.debug(json);

  if (!response.ok) {
    console.error('Error batch updating people');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.message];
    return [
      replace(path('errors'), errors)
    ];
  }

  console.info('Batch of people updated successfully');


  return [
    replace(path('confirmationRequest'), undefined),
  ];
});


const startBatchDeletePeopleCommand = commandFactory<ConfirmationPayload>(({path, payload: {confirmationRequest}}) => {

  if (confirmationRequest && confirmationRequest.action == 'delete-people' && confirmationRequest.confirmed) {
    confirmationRequest.confirming = true;
  }

  return [
    replace(path('confirmationRequest'), confirmationRequest),
  ];
});


const batchDeletePeopleCommand = commandFactory<ConfirmationPayload>(async ({get, path, payload: {}}) => {

  const confirmationRequest = get(path('confirmationRequest'));
  if (!confirmationRequest || confirmationRequest.action !== 'delete-people') {
    return [];
  }

  if (confirmationRequest.confirmed) {
    console.info('Batch delete action is confirmed and will be executed');
  } else {
    console.info('Batch delete action is not yet confirmed by the user and will not be executed');
    return [];
  }

  const {meta} = get(path("peopleGridState", 'meta'));
  const queryString = buildQueryStringForFilter({filter: meta.filter});
  const token = get(path('user', 'token'));


  const response = await fetch(peopleUrl + queryString, {
    method: 'patch',
    headers: getHeaders(token)
  });
  const json = await response.json();
  console.debug(json);

  if (!response.ok) {
    console.error('Error batch updating people');
    let errors: { [index: string]: string[]; } = {};
    errors[json.error] = [json.message];
    return [
      replace(path('errors'), errors)
    ];
  }

  console.info('Batch of people deleted successfully');

  return [
    replace(path('confirmationRequest'), undefined),
  ];
});


// Exports
export const fetchPeopleProcess = createProcess('list-people', [fetchPeopleCommand]);
export const fetchPersonProcess = createProcess('get-person', [startFetchingPersonCommand, fetchPersonCommand]);
export const createPersonProcess = createProcess('create-person', [createPersonCommand]);
export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const deletePersonProcess = createProcess('delete-person', [startDeletePersonCommand, deletePersonCommand, clearPersonEditorCommand]);
export const batchUpdatePeopleProcess = createProcess('update-people', [startBatchUpdatePeopleCommand, batchUpdatePeopleCommand]);
export const batchDeletePeopleProcess = createProcess('delete-people', [startBatchDeletePeopleCommand, batchDeletePeopleCommand]);
export const personEditorInputProcess = createProcess('person-editor-input', [personEditorInputCommand]);
export const clearPersonEditorProcess = createProcess('clear-person-editor', [clearPersonEditorCommand]);

export const cancelPersonActionProcess = createProcess('cancel-person-action', [cancelPersonActionCommand]);





