import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'
import type { Match } from '../bindings/Match.ts'
import { type SingleBlock, SinglePage } from '../common'

export interface SingleTournamentProps {}
export const SingleTournament: FunctionComponent<SingleTournamentProps> = props => {
    const { tournament, teams, matches } = useLoaderData<{
        tournament: Tournament
        teams: Team[]
        matches: Match[]
    }>()

    const items: SingleBlock[] = [
        {
            title: 'Teams',
            items: teams.map(t => {
                return {
                    text: t.name,
                    badgeContent: t.short_name,
                    itemLink: `/teams/${t._id['$oid']}/details`,
                }
            }),
        },
    ]

    return (
        <SinglePage
            pageTitle={tournament.name}
            editLink={`/tournaments/${tournament._id['$oid']}/edit`}
            blocks={items}
        />
    )
}
