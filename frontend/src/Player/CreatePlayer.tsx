import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import * as Yup from 'yup'
import type { Team } from '../bindings/Team.ts'
import type { CreatePlayer } from '../bindings/CreatePlayer.ts'
import { PlayerForm } from './PlayerForm.tsx'
import { FormPage } from '../common'

export interface CreatePlayerProps {}
export const CreatePlayerForm: FunctionComponent<CreatePlayerProps> = props => {
    const { teams } = useLoaderData<{ teams: Team[] }>()

    const initialValues: CreatePlayer = {
        team_id: '',
        riot_account_name: '',
        discord_name: '',
        role: 'Substitute',
        is_team_captain: false,
    }

    const validationSchema = Yup.object({
        team_id: Yup.string().required('Required'),
        riot_account_name: Yup.string().required('Required'),
        discord_name: Yup.string().notRequired(),
        role: Yup.string()
            .oneOf(['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Substitute', 'Coach'], 'Required')
            .required('Required'),
        is_team_captain: Yup.boolean().required('Required'),
    })

    return (
        <FormPage
            pageTitle='Create Player'
            returnToLocation='/players'
            initialValues={initialValues}
            validationSchema={validationSchema}
            submitOptions={{ method: 'POST', endpoint: '/api/v1/players' }}
        >
            <PlayerForm create={true} teams={teams} />
        </FormPage>
    )
}
