import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import type { Player } from '../bindings/Player.ts'
import type { Team } from '../bindings/Team.ts'
import type { UpdatePlayer } from '../bindings/UpdatePlayer.ts'
import * as Yup from 'yup'
import { PlayerForm } from './PlayerForm.tsx'
import { FormPage } from '../common'

export interface UpdatePlayerProps {}
export const UpdatePlayerForm: FunctionComponent<UpdatePlayerProps> = props => {
    const { player, teams } = useLoaderData<{ player: Player; teams: Team[] }>()

    const initialValues: UpdatePlayer = {
        team_id: player.team_id['$oid'],
        role: player.role,
        is_team_captain: player.is_team_captain,
        discord_name: player.discord_name,
    }

    const validationSchema = Yup.object({
        team_id: Yup.string().required('Required'),
        discord_name: Yup.string().notRequired(),
        role: Yup.string()
            .oneOf(['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Substitute', 'Coach'], 'Required')
            .required('Required'),
        is_team_captain: Yup.boolean().required('Required'),
    })

    return (
        <FormPage
            pageTitle='Update Player'
            returnToLocation='/players'
            initialValues={initialValues}
            validationSchema={validationSchema}
            submitOptions={{ method: 'PATCH', endpoint: `/api/v1/players/${player._id['$oid']}` }}
        >
            <PlayerForm create={false} teams={teams} />
        </FormPage>
    )
}
