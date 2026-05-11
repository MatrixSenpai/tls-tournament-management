import { FunctionComponent } from 'react'
import * as Yup from 'yup'

import { TournamentForm } from './Form.tsx'
import { CreateTournament } from '../api/types/CreateTournament.ts'
import { createTournament } from '../api/tournament.ts'
import { FormPage } from '../common'

export interface CreateTournamentFormProps {}
export const CreateTournamentForm: FunctionComponent<CreateTournamentFormProps> = props => {
    const initialValues: CreateTournament = {
        name: '',
        start_date: '',
        end_date: '',
        state: 'Upcoming',
        win_team_id: null,
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        start_date: Yup.date().required('Required'),
        end_date: Yup.date().notRequired(),
        state: Yup.string().oneOf(['Upcoming', 'Running', 'Ended']).required('Required'),
        win_team_id: Yup.string().notRequired(),
    })

    const submitFunction = async (values: CreateTournament) => {
        const finalValues = {
            ...values,
            start_date: new Date(values.start_date).toISOString(),
            end_date: values.end_date ? new Date(values.end_date).toISOString() : null,
        }
        return createTournament(finalValues)
    }

    return (
        <FormPage title='Create Tournament' cancelLocation='/tournaments'>
            <TournamentForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                submitFunction={submitFunction}
                successRedirectLocation='/tournaments'
            />
        </FormPage>
    )
}
