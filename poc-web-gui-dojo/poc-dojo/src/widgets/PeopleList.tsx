import {tsx} from "@dojo/framework/widget-core/tsx";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";

import Grid from "@dojo/widgets/grid";
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


const columnConfig = [
    {
        id: "id",
        title: "ID"
    },
    {
        id: "firstName",
        title: "First Name",
        sortable: true,
        editable: true,
        filterable: true
    },
    {
        id: "lastName",
        title: "Last Name",
        sortable: true,
        editable: true,
        filterable: true
    },
    {
        id: "gender",
        title: "M/F",
        renderer: (item: any) => {
            return (
                (item.value == "MALE") ? "Man" : "Woman"
            );
        }
    },
    {
        id: "birthDate",
        title: "Birth date"
    },
    {
        id: "birthPlace",
        title: "Birth place"
    }
];



const fetcher = async (
    page: number,
    pageSize: number,
    options: FetcherOptions = {}
) => {

    const offset = (page - 1) * pageSize;

    //const temp = sorter(filterer(data, options), options)


    const response = await fetch(
        // `https://mock-json-server.now.sh/data?offset=${offset}&size=${pageSize}`,
        "http://127.0.0.1:8002/poc/api/people/",
        {
            method: "POST",
            body: JSON.stringify({
                sort: options.sort,
                filter: options.filter,
                offset,
                size: pageSize
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const json = await response.json();


    // console.log("json: ");
    // console.log(json);

    console.log(json.content);
    console.log(json.totalElements);

    return {data: json.content, meta: {total: json.totalElements}};
};


export default class extends WidgetBase {
    protected render() {
        return (
            <div styles={{width: "100%"}}>
                <Grid fetcher={fetcher} columnConfig={columnConfig} height={450}/>
            </div>
        );
    }
}

