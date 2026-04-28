import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import type { Match } from '../bindings/Match.ts'
import { SinglePage } from '../common'
import type { Team } from '../bindings/Team.ts'

export interface SingleMatchProps {}
export const SingleMatch: FunctionComponent<SingleMatchProps> = props => {
    const { match, team_one, team_two } = useLoaderData<{
        match: Match
        team_one: Team
        team_two: Team
    }>()

    return (
        <SinglePage
            pageTitle={`${team_one.short_name} VS ${team_two.short_name}`}
            editLink={`/matches/${match._id['$oid']}/edit`}
        />
    )
}
