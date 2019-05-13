import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";

import PeopleList, {PeopleListProperties} from "../widgets/PeopleList";
import {
  batchDeletePeopleProcess,
  batchUpdatePeopleProcess, cancelPersonActionProcess,
  fetchPeopleProcess,
  savePersonProcess
} from "../processes/personProcesses";
import {redirectProcess} from "../processes/routeProcesses";


function getProperties(store: Store<PocState>, properties: PeopleListProperties): PeopleListProperties {
  return {
    store: store,
    storeId: 'peopleGridState',
    fetchPeople: fetchPeopleProcess(store),
    createPerson: redirectProcess(store),
    updatePerson: savePersonProcess(store),

    updatePeople: batchUpdatePeopleProcess(store),
    deletePeople: batchDeletePeopleProcess(store),
    cancelPersonAction: cancelPersonActionProcess(store)
  };
}


// Use a StoreContainer
export default StoreContainer(PeopleList, 'state', {paths: [['peopleList']], getProperties});

