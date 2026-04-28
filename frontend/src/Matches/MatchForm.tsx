import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'
import type { FunctionComponent } from 'react'
import { Field, Form } from 'formik'
import { CommonFormField, SelectFormField } from '../common'
import type { CreateMatch } from '../bindings/CreateMatch.ts'

export interface MatchFormProps {
    tournaments: Tournament[]
    teams: Team[]
    create: boolean
}
export const MatchForm: FunctionComponent<MatchFormProps> = props => {
    const match_states = ['Upcoming', 'Running', 'Ended']
    let teams = props.teams.map(v => ({ name: v.name, value: v._id['$oid'] }))
    const dateTransform = (value: string): string => {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    }

    return (
        <Form>
            {props.create && (
                <SelectFormField
                    options={props.tournaments.map(v => ({ name: v.name, value: v._id['$oid'] }))}
                    name='tournament_id'
                    label='Tournament'
                />
            )}
            {props.create && (
                <SelectFormField options={teams} name='team_one_id' label='Team One' />
            )}
            {props.create && (
                <SelectFormField options={teams} name='team_two_id' label='Team Two' />
            )}

            <div className='mb-3'>
                <label htmlFor='scheduled_match_start' className='form-label'>
                    Match Start Time
                </label>
                <Field name='scheduled_match_start'>
                    {({ field: { name, value, onChange } }) => (
                        <input
                            type='datetime-local'
                            value={dateTransform(value)}
                            onChange={onChange}
                            name={name}
                            className='form-control'
                        />
                    )}
                </Field>
            </div>

            <SelectFormField
                options={match_states.map(v => ({ name: v, value: v }))}
                name='state'
                label='Current Match State'
            />

            <CommonFormField name='number_of_games' label='Number of Games' />

            <div className='mb-3'>
                <button className='btn btn-primary' type='submit'>
                    Save
                </button>
            </div>
        </Form>
    )
}
