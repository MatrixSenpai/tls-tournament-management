import { FunctionComponent } from 'react'
import { Tournament } from '../api/types/Tournament.ts'
import { allTournaments } from '../api/tournament.ts'
import { createColumnHelper } from '@tanstack/react-table'
import { CommonTable, ListPage } from '../common'

const columnHelper = createColumnHelper<Tournament>()
const columns = [
    columnHelper.accessor('id', {
        header: () => <span>ID</span>,
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('name', {
        header: () => <span>Tournament Name</span>,
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('start_date', {
        header: () => <span>Start</span>,
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('state', {
        header: () => <span>Status</span>,
        cell: value => value.getValue(),
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: () => <i className='bi bi-chevron-right' />,
    }),
]

export interface ListTournamentProps {}
export const ListTournament: FunctionComponent<ListTournamentProps> = props => {
    return (
        <ListPage title='All Tournaments' createTitle='Create Tournament' createLink='/tournaments/create'>
            <ListTournamentTable />
        </ListPage>
    )
}

interface ListTournamentTableProps {}
const ListTournamentTable: FunctionComponent<ListTournamentTableProps> = props => {
    const { tournaments } = allTournaments()

    const setSelectedRow = (value: Tournament) => console.log(value)

    return <CommonTable columns={columns} data={tournaments} selectedRow={setSelectedRow} />
}
