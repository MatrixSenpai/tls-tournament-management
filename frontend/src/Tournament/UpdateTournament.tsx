import type { FunctionComponent } from 'react'
import type { UpdateTournament } from '../bindings/UpdateTournament.ts'
import type { Tournament } from '../bindings/Tournament.ts'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { TournamentForm } from './TournamentForm.tsx'
import { useLoaderData, useNavigate } from 'react-router'

export interface UpdateTournamentProps {}
// @ts-ignore
export const UpdateTournamentForm: FunctionComponent<UpdateTournamentProps> = props => {
    const navigate = useNavigate()
    const { tournament } = useLoaderData<{ tournament: Tournament }>()
    const initialValues: UpdateTournament = {
        start_date: tournament.start_date,
        state: tournament.state,
    }

    const validationSchema = Yup.object({
        start_date: Yup.date().required('Required'),
    })

    // @ts-ignore
    const submitFunction = async (values: UpdateTournament) => {
        let value = { ...values, start_date: new Date(values.start_date ?? tournament.start_date) }
        await fetch(`/api/v1/tournaments/${tournament._id['$oid']}`, {
            method: 'PATCH',
            body: JSON.stringify(value),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => navigate('/tournaments'))
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitFunction}
        >
            <TournamentForm create={false} />
        </Formik>
    )
}
