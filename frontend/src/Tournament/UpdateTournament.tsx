import type { FunctionComponent } from 'react'
import type { UpdateTournament } from '../bindings/UpdateTournament.ts'
import type { Tournament } from '../bindings/Tournament.ts'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { TournamentForm } from './TournamentForm.tsx'
import { useLoaderData } from 'react-router'

export interface UpdateTournamentProps {}
// @ts-ignore
export const UpdateTournamentForm: FunctionComponent<UpdateTournamentProps> = props => {
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
        console.log(values)
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
