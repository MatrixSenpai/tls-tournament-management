import type { FunctionComponent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ListPage } from '../common/ListPage.tsx'
import { useLoaderData, useNavigate } from 'react-router'
import type { Team } from '../bindings/Team.ts'
import type { Player } from '../bindings/Player.ts'

interface TeamWithCaptain {
    team: Team
    captain: Player
}

const columns: ColumnDef<TeamWithCaptain>[] = [
    {
        accessorKey: 'team._id.$oid',
        header: 'Team ID',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'team.name',
        header: 'Team Name',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'team.short_name',
        header: 'Abbreviation',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'captain.riot_name',
        header: 'Team Captain',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'team.active',
        header: 'Active Team',
        cell: info => <i className={`bi bi-${(info.getValue() as boolean) ? 'check' : 'x'}-lg`} />,
    },
    {
        id: 'display-arrow',
        cell: () => <i className='bi bi-chevron-right' />,
    },
]

export interface ListTeamProps {}
export const ListTeam: FunctionComponent<ListTeamProps> = props => {
    const navigate = useNavigate()
    const teams = useLoaderData<TeamWithCaptain[]>()
    const showTeams = (id: string) => {
        navigate(`/teams/${id}/details`)
    }

    return (
        <ListPage
            pageTitle='Teams'
            createTitle='Create Team'
            createLink='/teams/create'
            data={teams}
            columns={columns}
            navigation={showTeams}
        />
    )
}
