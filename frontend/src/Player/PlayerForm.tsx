import type { FunctionComponent } from 'react'
import { Field, Form } from 'formik'
import { CommonFormField, SelectFormField } from '../common'
import type { Team } from '../bindings/Team.ts'

export interface PlayerFormProps {
    create: boolean
    teams: Team[]
}
export const PlayerForm: FunctionComponent<PlayerFormProps> = props => {
    const roleOptions = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Substitute', 'Coach']

    return (
        <Form>
            {props.create && <CommonFormField name='riot_account_name' label='Summoner Name' />}
            <CommonFormField name='discord_name' label='Discord Username' />
            <SelectFormField
                options={roleOptions.map(v => ({ name: v, value: v }))}
                name='role'
                label='Player Role'
            />
            <SelectFormField
                options={props.teams.map(t => ({ name: t.name, value: t._id['$oid'] }))}
                name='team_id'
                label='Current Team'
            />
            <div className='mb-3'>
                <div className='form-check'>
                    <Field type='checkbox' className='form-check-input' name='is_team_captain' />
                    <label htmlFor='is_team_captain' className='form-check-label'>
                        Team Captain
                    </label>
                </div>
            </div>

            <div className='col-12'>
                <button className='btn btn-primary' type='submit'>
                    Save
                </button>
            </div>
        </Form>
    )
}
