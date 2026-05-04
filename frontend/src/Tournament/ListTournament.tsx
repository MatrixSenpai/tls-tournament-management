import type { FunctionComponent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ListPage } from '../common'
import { useLoaderData, useNavigate } from 'react-router'
import type { Tournament } from '../api/types/Tournament.ts'
import { useGetTournaments } from '../api'

const columns: ColumnDef<Tournament>[] = [
    {
        accessorKey: 'id',
        header: 'Tournament ID',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'name',
        header: 'Tournament Name',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'state',
        header: 'Stage',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: info => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
        id: 'display-arrow',
        cell: () => <i className='bi bi-chevron-right' />,
    },
]

export interface ListTournamentProps {}
export const ListTournament: FunctionComponent<ListTournamentProps> = props => {
    let navigate = useNavigate()

    const { tournaments, isLoading, error } = useGetTournaments()

    const showTournament = (id: string) => {
        navigate(`/tournaments/${id}/details`)
    }

    return (
        <ListPage
            pageTitle='Tournaments'
            createTitle='Create Tournament'
            createLink='/tournaments/create'
            data={tournaments ?? []}
            columns={columns}
            navigation={showTournament}
        />
    )
}
