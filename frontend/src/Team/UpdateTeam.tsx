import type { FunctionComponent } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'
import type { Team } from '../bindings/Team.ts'
import type { UpdateTeam } from '../bindings/UpdateTeam.ts'
import * as Yup from '.store/yup-npm-1.7.1-ba72b33527/package'
import { Formik } from 'formik'
import { TeamForm } from './TeamForm.tsx'
import type { Tournament } from '../bindings/Tournament.ts'

export interface UpdateTeamProps {}
export const UpdateTeamForm: FunctionComponent<UpdateTeamProps> = props => {
    const navigate = useNavigate()
    const { team, tournaments } = useLoaderData<{ team: Team; tournaments: Tournament[] }>()
    const initialValues: UpdateTeam = {
        name: team.name,
        short_name: team.short_name,
        active: team.active,
        tournament_ids: team.tournament_ids.map(v => v['$oid']),
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        short_name: Yup.string().required('Required'),
        active: Yup.boolean().required('Required'),
        tournaments: Yup.array(Yup.string()).notRequired(),
    })

    const submitFunction = async (values: UpdateTeam) => {
        await fetch(`/api/v1/teams/${team._id['$oid']}`, {
            method: 'PATCH',
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
                    <h2>Update Team</h2>

                    <Link to='/teams' className='btn btn-outline-secondary pb-0'>
                        <i className='bi bi-x-lg mb-0' />
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
                        <TeamForm create={false} availableTournaments={tournaments} />
                    </Formik>
                </div>
            </div>
        </div>
    )
}
