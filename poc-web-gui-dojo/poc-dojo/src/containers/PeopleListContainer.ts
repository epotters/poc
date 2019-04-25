import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";

import PeopleList, {PeopleListProperties} from "../widgets/PeopleList";
import {fetchPeopleProcess, updatePersonProcess} from "../processes/personProcesses";


function getProperties(store: Store<State>, properties: PeopleListProperties): PeopleListProperties {

  const {get, path} = store;

  return {
    people: get(path("peopleList", "properties", "people")),
    meta: get(path("peopleList", "properties", "meta")),
    page: get(path("peopleList", "properties", "page")),
    pageSize: get(path("peopleList", "properties", "pageSize")),
    options: get(path("peopleList", "properties", "options")),
    fetchPeople: fetchPeopleProcess(store),
    updatePerson: updatePersonProcess(store)
  };
}


// Use a StoreContainer
export default StoreContainer(
    PeopleList,
    "state",
    {getProperties}
);
