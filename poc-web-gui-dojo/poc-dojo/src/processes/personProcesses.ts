import {createProcess} from '@dojo/framework/stores/process';
import {remove, replace} from '@dojo/framework/stores/state/operations';
import {commandFactory, getHeaders} from './utils';
import {baseUrl} from '../../config';
import {AddHouseholdPayload, DeleteHouseholdPayload, NewHouseholdPayload, PersonIdPayload} from './interfaces';

const startLoadingPersonCommand = commandFactory(({path}) => {
    return [
        replace(path('person', 'main'), undefined),
        replace(path('person', 'household'), []),
        replace(path('person', 'loading'), true),
        replace(path('person', 'loaded'), false)
    ];
});


const loadPersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
    const token = get(path('user', 'token'));
    const response = await fetch(`${baseUrl}/persons/${personId}`, {
        headers: getHeaders(token)
    });
    const json = await response.json();

    return [
        replace(path('person', 'main'), json.person),
        replace(path('person', 'loading'), false),
        replace(path('person', 'loaded'), true)
    ];
});


const loadHouseholdsCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
    const token = get(path('user', 'token'));
    const response = await fetch(`${baseUrl}/persons/${personId}/comments`, {
        headers: getHeaders(token)
    });
    const json = await response.json();

    return [replace(path('person', 'households'), json.households)];
});


const addHouseholdCommand = commandFactory<AddHouseholdPayload>(
    async ({at, get, path, payload: {person, newHousehold}}) => {
        const token = get(path('user', 'token'));
        const requestPayload = {
            comment: {
                body: newHousehold
            }
        };
        const response = await fetch(`${baseUrl}/persons/${personId}/households`, {
            method: 'post',
            headers: getHeaders(token),
            body: JSON.stringify(requestPayload)
        });
        const json = await response.json();
        const households = get(path('person', 'households'));

        return [
            replace(at(path('person', 'households'), households.length), json.household),
            replace(path('person', 'newHousehold'), '')
        ];
    }
);


const deleteHouseholdCommand = commandFactory<DeleteHouseholdPayload>(async ({at, get, path, payload: {personId, id}}) => {
    const token = get(path('user', 'token'));
    await fetch(`${baseUrl}/persons/${personId}/comments/${id}`, {
        method: 'delete',
        headers: getHeaders(token)
    });
    const households = get(path('person', 'households'));
    let index = -1;
    for (let i = 0; i < households.length; i++) {
        if (households[i].id === id) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        return [remove(at(path('person', 'comments'), index))];
    }
    return [];
});


const newHouseholdInputCommand = commandFactory<NewHouseholdPayload>(({path, payload: {newHousehold}}) => {
    return [replace(path('person', 'newHousehold'), newHousehold)];
});


const deletePersonCommand = commandFactory<PersonIdPayload>(async ({get, path, payload: {personId}}) => {
    const token = get(path('user', 'token'));
    await fetch(`${baseUrl}/persons/${personId}`, {
        method: 'delete',
        headers: getHeaders(token)
    });
    return [];
});


export const getPersonProcess = createProcess('get-person', [
    startLoadingPersonCommand,
    [loadPersonCommand, loadHouseholdsCommand]
]);
export const deletePersonProcess = createProcess('delete-person', [deletePersonCommand]);
export const addHouseholdProcess = createProcess('add-household', [addHouseholdCommand]);
export const deleteHouseholdProcess = createProcess('delete-household', [deleteHouseholdCommand]);
export const newHouseholdInputProcess = createProcess('new-household-input', [newHouseholdInputCommand]);

