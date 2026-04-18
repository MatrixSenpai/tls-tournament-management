import type { FunctionComponent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { Player } from '../bindings/Player'
import { ListPage } from '../common/ListPage.tsx'
import { useLoaderData, useNavigate } from 'react-router'

const columns: ColumnDef<Player>[] = [
    {
        accessorKey: '_id.$oid',
        header: 'Player ID',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'riot_name',
        header: 'Summoner Name',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'is_team_captain',
        header: 'Team Captain',
        cell: info => <i className={`bi bi-${(info.getValue() as boolean) ? 'check' : 'x'}-lg`} />,
    },
    {
        id: 'display-arrow',
        cell: () => <i className='bi bi-chevron-right' />,
    },
]

export interface ListPlayerProps {}
export const ListPlayer: FunctionComponent<ListPlayerProps> = props => {
    const navigate = useNavigate()
    const { players } = useLoaderData<{ players: Player[] }>()
    const showPlayers = (id: string) => {
        navigate(`/players/${id}/details`)
    }

    return (
        <ListPage
            pageTitle='Players'
            createTitle='Create Player'
            createLink='/players/create'
            data={players}
            columns={columns}
            navigation={showPlayers}
        />
    )
}
