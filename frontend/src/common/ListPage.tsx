import type { ReactElement } from 'react'
import { type ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Link } from 'react-router'

export interface ListPageProps<T> {
    pageTitle: string
    createTitle: string
    createLink: string
    data: T[]
    columns: ColumnDef<T>[]
    navigation: (id: string) => void
}

export function ListPage<T>(props: ListPageProps<T>): ReactElement {
    const { pageTitle, createTitle, createLink, data, columns, navigation } = props
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // @ts-ignore
        getRowId: row => row._id['$oid'],
        enableRowSelection: true,
        enableMultiRowSelection: false,
        // @ts-ignore
        onRowSelectionChange: value => navigation(Object.keys(value())[0]),
    })

    return (
        <>
            <div className='row my-4'>
                <div className='col d-flex justify-content-between'>
                    <h2>{pageTitle}</h2>

                    <div>
                        <Link to={createLink} className='btn btn-primary'>
                            <i className='bi bi-plus me-2' />
                            {createTitle}
                        </Link>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>
                    <table className='table table-striped table-hover'>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th scope='col' key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} onClick={row.getToggleSelectedHandler()}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
