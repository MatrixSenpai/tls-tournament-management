import type { FunctionComponent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ListPage } from '../common'
import { useLoaderData, useNavigate } from 'react-router'
import type { Match } from '../bindings/Match.ts'
import type { Team } from '../bindings/Team.ts'
import type { Tournament } from '../bindings/Tournament.ts'

interface MatchWithTeamsTournament {
    match: Match
    tournament: Tournament
    team_one: Team
    team_two: Team
}

const columns: ColumnDef<MatchWithTeamsTournament>[] = [
    {
        accessorKey: 'match._id.$oid',
        header: 'Match ID',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'tournament.name',
        header: 'Tournament',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'team_one.short_name',
        header: 'Team One',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'team_two.short_name',
        header: 'Team Two',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'match.state',
        header: 'Stage',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'match.number_of_games',
        header: 'Series',
        cell: info => <span>Bo{info.getValue() as string}</span>,
    },
    {
        id: 'display-arrow',
        cell: () => <i className='bi bi-chevron-right' />,
    },
]

export interface ListMatchProps {}
export const ListMatch: FunctionComponent<ListMatchProps> = props => {
    const navigate = useNavigate()
    const matchData = useLoaderData<MatchWithTeamsTournament[]>()
    const showMatch = (id: string) => {
        navigate(`/matches/${id}/details`)
    }

    return (
        <ListPage
            pageTitle='Matches'
            createTitle='Create Match'
            createLink='/matches/create'
            data={matchData}
            columns={columns}
            navigation={showMatch}
        />
    )
}
