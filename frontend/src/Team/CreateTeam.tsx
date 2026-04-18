import type { FunctionComponent } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'
import * as Yup from 'yup'
import type { CreateTeam } from '../bindings/CreateTeam.ts'
import { Formik } from 'formik'
import { TeamForm } from './TeamForm.tsx'
import type { Tournament } from '../bindings/Tournament.ts'

export interface CreateTeamFormProps {}
export const CreateTeamForm: FunctionComponent<CreateTeamFormProps> = props => {
    const navigate = useNavigate()
    const { tournaments } = useLoaderData<{ tournaments: Tournament[] }>()

    const initialValues: CreateTeam = {
        name: '',
        short_name: '',
        active: true,
        tournament_ids: [],
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        short_name: Yup.string().required('Required'),
        active: Yup.boolean().required('Required'),
        tournament_ids: Yup.array(Yup.string()).notRequired(),
    })

    const submitFunction = async (values: CreateTeam) => {
        await fetch('/api/v1/teams', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => navigate('/teams'))
    }

    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                    <h2>Create Team</h2>

                    <Link to='/teams' className='btn btn-outline-secondary pb-0'>
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
                        <TeamForm create={true} availableTournaments={tournaments} />
                    </Formik>
                </div>
            </div>
        </div>
    )
}
