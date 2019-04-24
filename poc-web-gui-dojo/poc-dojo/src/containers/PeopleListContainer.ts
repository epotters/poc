
import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import PeopleList, {PeopleListProperties} from "../widgets/PeopleList";
import {State} from "../interfaces";
import {listPeopleProcess, updatePersonProcess} from "../processes/personProcesses";
import {PersonEditorProperties} from "../widgets/PersonEditor";



function getProperties(store: Store<State>, properties: PeopleListProperties): PeopleListProperties {

  const {get, path} = store;

  return {
    people: get(path("peopleList", "people")),
    page: get(path("peopleList", "page")),
    pageSize: get(path("peopleList", "pageSize")),
    options: get(path("peopleList", "options")),
    listPeople: listPeopleProcess(store),
    updatePerson: updatePersonProcess(store),
    meta: {}
  };
}


// Use a StoreContainer
export default StoreContainer(
    PeopleList,
    "state",
    {getProperties}
);
