import type { FunctionComponent } from 'react'
import { Field, Form, ErrorMessage } from 'formik'

export interface TournamentFormProps {
    create: boolean
}
// @ts-ignore
export const TournamentForm: FunctionComponent<TournamentFormProps> = props => {
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
                <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>
                        Tournament Name
                    </label>
                    <Field type='text' className='form-control' name='name' />
                    <ErrorMessage name='name'>
                        {msg => <span className='invalid-feedback'>{msg}</span>}
                    </ErrorMessage>
                </div>
            )}

            <div className='mb-3'>
                <label htmlFor='start_date' className='form-label'>
                    Start Date
                </label>
                <Field name='start_date'>
                    {/* @ts-ignore */}
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
                <ErrorMessage name='start_date'>
                    {msg => <span className='invalid-feedback'>{msg}</span>}
                </ErrorMessage>
            </div>

            {!props.create && (
                <div className='mb-3'>
                    <Field as='select' className='form-select' name='state'>
                        <option value='Upcoming'>Upcoming</option>
                        <option value='Running'>Running</option>
                        <option value='Ended'>Ended</option>
                    </Field>
                </div>
            )}

            <div className='col-12'>
                <button className='btn btn-primary' type='submit'>
                    Save
                </button>
            </div>
        </Form>
    )
}
