import type { FunctionComponent } from 'react'
import { Field, Form, ErrorMessage, useField } from 'formik'
import type { Tournament } from '../bindings/Tournament.ts'

export interface TeamFormProps {
    create: boolean
    availableTournaments: Tournament[]
}
export const TeamForm: FunctionComponent<TeamFormProps> = props => {
    const { availableTournaments } = props

    return (
        <Form>
            <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                    Team Name
                </label>
                <Field type='text' className='form-control' name='name' />
            </div>

            <div className='mb-3'>
                <label htmlFor='short_name' className='form-label'>
                    Team Abbreviation
                </label>
                <Field type='text' className='form-control' name='short_name' />
            </div>

            <div className='mb-3'>
                <div className='form-check'>
                    <Field type='checkbox' className='form-check-input' name='active' />
                    <label htmlFor='active' className='form-check-label'>
                        Active Team
                    </label>
                </div>
            </div>

            <TournamentSelection availableTournaments={availableTournaments} />

            <div className='col-12'>
                <button className='btn btn-primary' type='submit'>
                    Save
                </button>
            </div>
        </Form>
    )
}

interface TournamentSelectionProps {
    availableTournaments: Tournament[]
}
const TournamentSelection: FunctionComponent<TournamentSelectionProps> = props => {
    const { availableTournaments } = props
    const [field, meta, helper] = useField('tournament_ids')

    const addItem = e => {
        const id = e.target.value
        e.target.value = null
        helper.setValue([...field.value, id]).then(() => {})
    }
    const removeItem = (id: string) => {
        let newValue: string[] = field.value
        newValue = newValue.filter(v => v !== id)
        helper.setValue(newValue).then(() => {})
    }

    return (
        <div className='mb-3'>
            <div>
                <label htmlFor='tournamentIdSelector' className='form-label'>
                    Participating Tournaments
                </label>

                <select name='tournamentIdSelector' className='form-select' onChange={addItem}>
                    <option selected>Select Tournament</option>
                    {availableTournaments.map((t, i) => (
                        <option key={i} value={t._id['$oid']}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            <ul className='mt-2 list-group'>
                {field.value.map((t: string, i: number) => (
                    <TournamentListItem
                        tournaments={availableTournaments}
                        tournamentId={t}
                        removeHandler={removeItem}
                        key={i}
                    />
                ))}
            </ul>
        </div>
    )
}

interface TournamentListItemProps {
    tournaments: Tournament[]
    tournamentId: string
    removeHandler: (id: string) => void
}
const TournamentListItem: FunctionComponent<TournamentListItemProps> = props => {
    const tournamentMapItem = props.tournaments.find(v => v._id['$oid'] === props.tournamentId)!

    return (
        <li className='list-group-item'>
            <div className='d-flex w-100 justify-content-between'>
                <p>{tournamentMapItem.name}</p>
                <button
                    type='button'
                    className='btn btn-secondary py-0'
                    onClick={() => props.removeHandler(tournamentMapItem._id['$oid'])}
                >
                    <i className='bi bi-x-lg' />
                </button>
            </div>
        </li>
    )
}
