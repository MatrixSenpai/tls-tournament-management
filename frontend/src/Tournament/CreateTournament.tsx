import type { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { TournamentForm } from './TournamentForm.tsx'
import type { CreateTournament } from '../bindings/CreateTournament.ts'
import { Link, useNavigate } from 'react-router'

export interface CreateTournamentProps {}
export const CreateTournamentForm: FunctionComponent<CreateTournamentProps> = props => {
    const navigate = useNavigate()

    const initialValues: CreateTournament = {
        name: '',
        start_date: '',
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        start_date: Yup.date().required('Required'),
    })

    // @ts-ignore
    const submitFunction = async (values: CreateTournament) => {
        let value = { ...values, start_date: new Date(values.start_date) }
        await fetch('/api/v1/tournaments', {
            method: 'POST',
            body: JSON.stringify(value),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => navigate('/tournaments'))
    }

    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                    <h2>Create Tournament</h2>

                    <Link to='/tournaments' className='btn btn-outline-secondary pb-0'>
                        <i className='bi bi-x-lg m-0' />
                    </Link>
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={submitFunction}
                    >
                        <TournamentForm create={true} />
                    </Formik>
                </div>
            </div>
        </div>
    )
}
