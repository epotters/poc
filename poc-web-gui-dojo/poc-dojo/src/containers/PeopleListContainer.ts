import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";

import PeopleList, {PeopleListProperties} from "../widgets/PeopleList";
import {fetchPeopleProcess, savePersonProcess} from "../processes/personProcesses";


function getProperties(store: Store<PocState>, properties: PeopleListProperties): PeopleListProperties {
  return {
    store: store,
    storeId: 'peopleGridState',
    fetchPeople: fetchPeopleProcess(store),
    updatePerson: savePersonProcess(store)
  };
}


// Use a StoreContainer
export default StoreContainer(PeopleList, 'state', {paths: [['peopleList']], getProperties});

