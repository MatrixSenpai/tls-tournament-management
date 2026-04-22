import type { FunctionComponent } from 'react'
import { Link, useLoaderData } from 'react-router'
import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'
import type { Match } from '../bindings/Match.ts'
import type { Player } from '../bindings/Player.ts'
import { type SingleBlock, SinglePage } from '../common'

export interface SingleTeamProps {}
export const SingleTeam: FunctionComponent<SingleTeamProps> = props => {
    const { tournaments, team, matches, players } = useLoaderData<{
        tournaments: Tournament[]
        team: Team
        matches: Match[]
        players: Player[]
    }>()

    const items: SingleBlock[] = [
        {
            title: 'Players',
            items: players.map(p => {
                return {
                    text: p.riot_name,
                    badgeContent: p.is_team_captain ? 'TC' : undefined,
                    itemLink: `/players/${p._id['$oid']}/details`,
                }
            }),
        },
        {
            title: 'Registered Tournaments',
            items: tournaments.map(t => {
                return {
                    text: t.name,
                    badgeContent: t.state,
                    itemLink: `/tournaments/${t._id['$oid']}/details`,
                }
            }),
        },
    ]

    return (
        <SinglePage
            pageTitle={`${team.name} (${team.short_name})`}
            editLink={`/teams/${team._id['$oid']}/edit`}
            blocks={items}
        />
    )
}
