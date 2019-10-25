import {createProcess} from '@dojo/framework/stores/process';
import {replace} from '@dojo/framework/stores/state/operations';
import {GridPages} from "@dojo/widgets/grid/interfaces";

import {buildQueryString, buildQueryStringForFilter, commandFactory, getHeaders} from './utils';
import {peopleUrl} from '../../config';
import {ConfirmationPayload, PageSortFilterPayload, PartialPersonPayload, PersonIdPayload} from './interfaces';
import {ConfirmationRequest, Person} from "../interfaces";


const personEditorInputCommand = commandFactory<PartialPersonPayload>(({get, path, payload: {person}}) => {

  const currentPerson = get(path('personEditor', 'person'));
  const updatedPerson = {...currentPerson, ...person};

  return [
    replace(path('personEditor', 'person'), updatedPerson),
    replace(path('personEditor', 'hasChanges'), true)
  ];
});


// List people
const fetchPeopleCommand = commandFactory<PageSortFilterPayload>(async ({get, path, payload: {page, pageSize, options}}) => {

  const token = get(path('session', 'token'));

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
  const token = get(path('session', 'token'));
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
    replace(path('personEditor', 'loaded'), true),
    replace(path('personEditor', 'hasChanges'), false)
  ];
});


const savePersonCommand = commandFactory<PartialPersonPayload>(async ({get, path, payload: {person}}) => {
  const token = get(path('session', 'token'));

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

  console.debug(json);
  console.info('Person saved successfully');

  return [
    replace(path('personEditor', 'person'), json),
    replace(path('personEditor', 'hasChanges'), false),
    replace(path('feedback'), {text: 'Person saved'}),
    replace(path('errors'), undefined)
  ];
});


const startDeletePersonCommand = commandFactory<ConfirmationPayload>(({path, payload: {confirmationRequest}}) => {

  if (confirmationRequest && confirmationRequest.action == 'delete-person' && confirmationRequest.confirmed) {
    confirmationRequest.confirming = true;
  }

  return [
    replace(path('confirmationRequest'), confirmationRequest),
  ];
});


const deletePersonCommand = commandFactory<ConfirmationPayload>(async ({get, path, payload: {}}) => {

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

    const person: Partial<Person> = get(path('personEditor', 'person'));

    console.debug('Person to delete found');
    console.debug(person);

    const url = peopleUrl + `${person.id}`;
    console.debug('url: ' + url);

    const token = get(path('session', 'token'));
    const response = await fetch(url, {
      method: 'delete',
      headers: getHeaders(token)
    });

    console.debug('Response received');

    console.debug(response);


    if (!response.ok) {
      console.error('Error deleting person');

      // Only json for errors
      const json = await response.json();
      console.debug(json);

      let errors: { [index: string]: string[]; } = {};
      errors[json.error] = [json.message];
      return [
        replace(path('confirmationRequest'), undefined),
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


const cancelPersonActionCommand = commandFactory(({get, path}) => {
  const confirmationRequest: ConfirmationRequest = get(path('confirmationRequest'));
  console.info('Action cancelled ' + confirmationRequest.action);
  return [
    replace(path('confirmationRequest'), undefined)
  ];
});


const clearPersonEditorCommand = commandFactory(({path}) => {
  return [
    replace(path('personEditor'), {}),
    replace(path('personEditor', 'hasChanges'), false)
  ];
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
  const token = get(path('session', 'token'));

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
      replace(path('confirmationRequest'), undefined),
      replace(path('errors'), errors)
    ];
  }

  const feedbackText: string = 'Batch of people updated successfully';
  console.info(feedbackText);

  return [
    replace(path('feedback'), {text: feedbackText}),
    replace(path('confirmationRequest'), undefined)
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
  const token = get(path('session', 'token'));


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
      replace(path('confirmationRequest'), undefined),
      replace(path('errors'), errors)
    ];
  }

  console.info('Batch of people deleted successfully');

  return [
    replace(path('confirmationRequest'), undefined),
  ];
});


const relativeNavigationCommand = commandFactory(({get, path}) => {

  const currentPerson: Person = get(path('personEditor', 'person'));

  if (!currentPerson || !currentPerson.id) {
    console.info('Currently there is no person loaded in the EntityEditor. Relative navigation is not possible.');
    return [
      replace(path('personEditor', 'canNavigate'), false),
      replace(path('personEditor', 'previousPerson'), undefined),
      replace(path('personEditor', 'nextPerson'), undefined)
    ];
  }

  const pageNumber: number = get(path('peopleGridState', 'meta', 'page'));
  const pages: GridPages<Person> = get(path('peopleGridState', 'data', 'pages'));
  const currentPage: Person[] = pages['page-' + pageNumber];

  let currentPersonIndex: number = -1;
  if (Object.keys(pages).length > 0) {
    for (const [index, person] of currentPage.entries()) {
      if (person.id == currentPerson.id) {
        currentPersonIndex = index;
        break;
      }
    }
  } else {
    console.debug('No pages loaded yet');
  }

  if (currentPersonIndex == -1) {
    return [
      replace(path('personEditor', 'canNavigate'), false),
      replace(path('personEditor', 'previousPerson'), undefined),
      replace(path('personEditor', 'nextPerson'), undefined)
    ];
  } else {
    console.debug('Current person found on page ' + pageNumber + ' at index ' + currentPersonIndex);
  }

  // Is the current person the first or last in the people loaded so far?
  const isFirstPersonLoaded: boolean = (pageNumber == 1 && currentPersonIndex == 0);
  const lastPageLoadedNumber: number = Object.keys(pages).length - 1;
  const lastPage: Person[] = pages['page-' + lastPageLoadedNumber];
  const isLastPersonLoaded: boolean = (pageNumber == lastPageLoadedNumber && currentPersonIndex == lastPage.length);


  let previousPerson: Person | undefined;
  if (!isFirstPersonLoaded) {
    if (currentPersonIndex == 0) {
      const previousPage: Person[] = pages['page-' + (pageNumber - 1)];
      previousPerson = previousPage[previousPage.length - 1];
    } else {
      previousPerson = currentPage[currentPersonIndex - 1];
    }
    console.info('Previous person found with id ' + previousPerson.id);
  }

  let nextPerson: Person | undefined;
  if (!isLastPersonLoaded) {
    if (currentPersonIndex == currentPage.length - 1) {
      const nextPage: Person[] = pages['page-' + (pageNumber + 1)];
      nextPerson = nextPage[0];
    } else {
      nextPerson = currentPage[currentPersonIndex + 1];
    }
    console.info('Next person found with id ' + nextPerson.id);
  }

  return [
    replace(path('personEditor', 'canNavigate'), true),
    replace(path('personEditor', 'previousPerson'), (previousPerson ? previousPerson : undefined)),
    replace(path('personEditor', 'nextPerson'), (nextPerson ? nextPerson : undefined))
  ];
});


// Exports
export const fetchPeopleProcess = createProcess('list-people', [fetchPeopleCommand]);
export const fetchPersonProcess = createProcess('get-person', [startFetchingPersonCommand, fetchPersonCommand, relativeNavigationCommand]);
export const savePersonProcess = createProcess('save-person', [savePersonCommand]);
export const deletePersonProcess = createProcess('delete-person', [startDeletePersonCommand, deletePersonCommand]);
export const batchUpdatePeopleProcess = createProcess('update-people', [startBatchUpdatePeopleCommand, batchUpdatePeopleCommand]);
export const batchDeletePeopleProcess = createProcess('delete-people', [startBatchDeletePeopleCommand, batchDeletePeopleCommand]);
export const personEditorInputProcess = createProcess('person-editor-input', [personEditorInputCommand]);
export const clearPersonEditorProcess = createProcess('clear-person-editor', [clearPersonEditorCommand]);
export const cancelPersonActionProcess = createProcess('cancel-person-action', [cancelPersonActionCommand]);
export const relativePeopleNavigationProcess = createProcess('relative-people-navigation', [relativeNavigationCommand]);






