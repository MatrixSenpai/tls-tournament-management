import { FormikValues } from 'formik'
import { CommonForm, CommonFormFieldProps } from '../common'

export interface TournamentFormProps<T> {
    initialValues: T
    validationSchema: any
    submitFunction: (values: T) => Promise<void>
    successRedirectLocation: string
}
export function TournamentForm<T extends FormikValues>(props: TournamentFormProps<T>) {
    const fields: CommonFormFieldProps[] = [
        { label: 'Tournament Name', name: 'name', type: 'TEXT' },
        { label: 'Start Date', name: 'start_date', type: 'DATE' },
        { label: 'End Date', name: 'end_date', type: 'DATE', helperText: 'Optional if tournament has not ended' },
        {
            label: 'Status',
            name: 'state',
            type: 'SELECT',
            options: { Upcoming: 'Upcoming', Running: 'Running', Ended: 'Ended' },
        },
        {
            label: 'Winning Team',
            name: 'win_team_id',
            type: 'SELECT',
            helperText: 'Optional',
            options: { '1': 'Team 1', '2': 'Team 2', '3': 'Team 3', '4': 'Team 4', '5': 'Team 5' },
        },
    ]

    return (
        <CommonForm
            initialValues={props.initialValues}
            validationSchema={props.validationSchema}
            submitFunction={props.submitFunction}
            successRedirectLocation={props.successRedirectLocation}
            fields={fields}
        />
    )
}
