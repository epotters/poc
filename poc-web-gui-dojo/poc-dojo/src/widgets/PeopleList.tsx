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
        title: "First Name"
    },
    {
        id: "lastName",
        title: "Last Name"
    },
    {
        id: "birthDate",
        title: "Birth date"
    },
    {
        id: "gender",
        title: "M/F"
    }
];


const fetcher = async (
    page: number,
    pageSize: number,
    options: FetcherOptions = {}
) => {
    const offset = (page - 1) * pageSize;
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
    // return { data: json.data, meta: { total: json.total } };
    // return { data: json.get("content"), meta: { total: json.get("totalElements") } };
    // console.log(json.data.content);
    // console.log(json.data);
    // console.log(json.content);
    // console.log(json.totalElements);

    return {data: json.data.content, meta: {total: json.totalElements}};

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

