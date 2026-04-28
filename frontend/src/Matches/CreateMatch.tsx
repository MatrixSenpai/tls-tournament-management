import type { FunctionComponent } from 'react'
import type { CreateMatch } from '../bindings/CreateMatch.ts'
import * as Yup from 'yup'
import { FormPage } from '../common'
import { MatchForm } from './MatchForm.tsx'
import { useLoaderData } from 'react-router'
import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'

export interface CreateMatchProps {}
export const CreateMatchForm: FunctionComponent<CreateMatchProps> = props => {
    const { tournaments, teams } = useLoaderData<{ tournaments: Tournament[]; teams: Team[] }>()
    const initialValues: CreateMatch = {
        tournament_id: '',
        team_one_id: '',
        team_two_id: '',
        scheduled_match_start: new Date(),
        state: 'Upcoming',
        number_of_games: 3,
    }

    const validationSchema = Yup.object({
        tournament_id: Yup.string().required('Required'),
        team_one_id: Yup.string().required('Required'),
        team_two_id: Yup.string().required('Required'),
        scheduled_match_start: Yup.date().required('Required'),
        state: Yup.string().required('Required'),
        number_of_games: Yup.number().required('Required'),
    })

    const transform = (values: CreateMatch): CreateMatch => {
        return {
            ...values,
            number_of_games: Number(values.number_of_games),
            scheduled_match_start: new Date(values.scheduled_match_start!),
        }
    }

    return (
        <FormPage
            pageTitle='Create Match'
            returnToLocation='/matches'
            initialValues={initialValues}
            submitOptions={{ method: 'POST', endpoint: '/api/v1/matches', transform }}
            validationSchema={validationSchema}
        >
            <MatchForm tournaments={tournaments} teams={teams} create={true} />
        </FormPage>
    )
}
