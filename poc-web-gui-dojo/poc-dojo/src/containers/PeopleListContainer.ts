
import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PeopleList} from "../widgets/PeopleList";
import {State} from "../interfaces";
import {listPeopleProcess, updatePersonProcess} from "../processes/personProcesses";


function getProperties(store: Store<State>): any {
  const {get, path} = store;

  return {
    people: get(path("peopleList", "people")),
    // result: get(path("result")),
    listPeople: listPeopleProcess(store),
    updatePerson: updatePersonProcess(store)
  };
}

// Use a StoreContainer
export const PeopleListContainer = StoreContainer(
    PeopleList,
    "state",
    {getProperties}
);