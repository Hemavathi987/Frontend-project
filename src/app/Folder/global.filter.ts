import { Table } from "primeng/table";

export function onGlobalTableFilter(table: Table, event: Event){
    return table.filterGlobal(
        (event.target as HTMLInputElement).value,
        'contains'
    );
}