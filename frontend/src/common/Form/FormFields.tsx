import { FunctionComponent } from 'react'
import { useField } from 'formik'

export interface CommonFormFieldProps {
    label: string
    name: string

    type: 'TEXT' | 'DATE' | 'DATETIME' | 'SELECT' | 'CHECKBOX' | 'RADIO'

    helperText?: string
    options?: Record<string, string>
    defaultText?: string
    inline?: boolean
}
export const CommonFormField: FunctionComponent<CommonFormFieldProps> = props => {
    const [field, meta] = useField(props.name)

    let fieldData
    switch (props.type) {
        case 'TEXT':
            fieldData = <FormTextField name={field.name} />
            break
        case 'DATE':
            fieldData = <FormDateField name={field.name} />
            break
        case 'DATETIME':
            fieldData = <FormDateTimeField name={field.name} />
            break
        case 'SELECT':
            fieldData = <FormSelectField name={field.name} options={props.options!} />
            break
    }

    return (
        <div className='mb-3'>
            <label htmlFor={field.name} className='form-label'>
                {props.label}
            </label>
            {fieldData}
            {props.helperText && !meta.error ? <div className='form-text'>{props.helperText}</div> : null}
            {meta.touched && meta.error ? <div className='invalid-feedback'>{meta.error}</div> : null}
        </div>
    )
}

export interface FormTextFieldProps {
    name: string
}
export const FormTextField: FunctionComponent<FormTextFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <input
            type='text'
            className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : null}`}
            {...field}
        />
    )
}

export interface FormDateFieldProps {
    name: string
}
export const FormDateField: FunctionComponent<FormDateFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <input
            type='date'
            className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : null}`}
            {...field}
        />
    )
}

export interface FormDateTimeFieldProps {
    name: string
}
export const FormDateTimeField: FunctionComponent<FormDateTimeFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <input
            type='datetime-local'
            className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : null}`}
            {...field}
        />
    )
}

export interface FormSelectFieldProps {
    name: string
    options: Record<string, string>
    defaultText?: string
}
export const FormSelectField: FunctionComponent<FormSelectFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <select
            className={`form-control form-select ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : null}`}
            {...field}
        >
            <option selected disabled value=''>
                {props.defaultText ?? 'Select an option...'}
            </option>
            {Object.entries(props.options).map(([k, v], i) => (
                <option key={i} value={k}>
                    {v}
                </option>
            ))}
        </select>
    )
}
