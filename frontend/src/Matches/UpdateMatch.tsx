import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import type { Match } from '../bindings/Match.ts'
import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'
import type { UpdateMatch } from '../bindings/UpdateMatch.ts'
import { FormPage } from '../common'
import { MatchForm } from './MatchForm.tsx'

export interface UpdateMatchProps {}
export const UpdateMatchForm: FunctionComponent<UpdateMatchProps> = props => {
    const { match, tournaments, teams } = useLoaderData<{
        match: Match
        tournaments: Tournament[]
        teams: Team[]
    }>()
    const initialValues: UpdateMatch = {
        scheduled_match_start: new Date(match.scheduled_match_start ?? ''),
        state: match.state,
        number_of_games: match.number_of_games,
    }

    const transform = (values: UpdateMatch): UpdateMatch => {
        return {
            ...values,
            number_of_games: Number(values.number_of_games),
            scheduled_match_start: new Date(values.scheduled_match_start!),
        }
    }

    return (
        <FormPage
            pageTitle='Update Match'
            returnToLocation='/matches'
            initialValues={initialValues}
            submitOptions={{
                method: 'PATCH',
                endpoint: `/api/v1/matches/${match._id['$oid']}`,
                transform,
            }}
        >
            <MatchForm tournaments={tournaments} teams={teams} create={false} />
        </FormPage>
    )
}
