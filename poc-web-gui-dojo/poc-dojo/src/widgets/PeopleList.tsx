import {tsx} from "@dojo/framework/widget-core/tsx";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";

import Grid from "@dojo/widgets/grid";
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";
// import Button from "@dojo/widgets/button";


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

    let sortParams = "";
    if (options.sort != undefined) {
        sortParams += (options.sort.columnId != undefined) ? "&sort=" + options.sort.columnId + "," : "";
        sortParams += (options.sort.direction != undefined) ? options.sort.direction : "asc";
    }
    const queryString = "?page" + page + "&size=" + pageSize + sortParams;
    console.log(queryString);

    const response = await fetch(
        "http://127.0.0.1:8002/poc/api/people/" + queryString,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    // const responseWorking = await fetch(
    //     "http://127.0.0.1:8002/poc/api/people/",
    //     {
    //         method: "POST",
    //         body: JSON.stringify({
    //             sort: options.sort,
    //             filter: options.filter,
    //             offset,
    //             size: pageSize
    //         }),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }
    // );

    const json = await response.json();
    // console.log(json.content);
    // console.log(json.totalElements);

    return {data: json.content, meta: {total: json.totalElements}};
};

//
// w(Button, {}, ['Login'])

//             <Button onClick={}>New</Button>

export default class extends WidgetBase {
    protected render() {
        return (
            <div styles={{width: "100%"}}>
                <Grid fetcher={fetcher} columnConfig={columnConfig} height={720}/>
            </div>
        );
    }
}

