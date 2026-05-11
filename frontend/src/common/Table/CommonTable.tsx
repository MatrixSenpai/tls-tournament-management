import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export interface CommonTableProps<T> {
    columns: any
    data: T[]
    selectedRow: (value: T) => void
}
export function CommonTable<T extends { id: string }>(props: CommonTableProps<T>) {
    const table = useReactTable({
        columns: props.columns,
        data: props.data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: row => row.id,
        enableRowSelection: true,
        // @ts-ignore
        onRowSelectionChange: value => props.selectedRow(Object.keys(value())[0]),
    })

    return (
        <table className='table table-hover'>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th scope='table' key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} onClick={row.getToggleSelectedHandler()}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
