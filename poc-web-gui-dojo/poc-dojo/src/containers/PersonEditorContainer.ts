import {Store} from '@dojo/framework/stores/Store';
import PersonEditor, {PersonEditorProperties} from './../widgets/PersonEditor';
import {deletePersonProcess, getPersonProcess, savePersonProcess} from './../processes/personProcesses';
import {State} from '../interfaces';
import {StoreContainer} from '@dojo/framework/stores/StoreInjector';

function getProperties(store: Store<State>, properties: PersonEditorProperties): PersonEditorProperties {
    const {get, path} = store;

    return {
        person: get(path('personEditor', 'person')),
        loaded: get(path('personEditor', 'loaded')),
        isAuthenticated: !!get(path('user', 'token')),
        loggedInUser: get(path('user', 'name')),

        getPerson: getPersonProcess(store),
        savePerson: savePersonProcess(store),
        deletePerson: deletePersonProcess(store),

        onFormInput: function () {
            console.log("Something was updated in the Person Editor");
        },
        onFormSave: function () {
            console.log("Person Editor wants to save something");
        }
    };
}

export default StoreContainer(PersonEditor, 'state', {paths: [['user'], ['personEditor']], getProperties});
