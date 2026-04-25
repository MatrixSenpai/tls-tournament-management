import type { FunctionComponent } from 'react'
import { useField } from 'formik'

export interface CommonFormFieldProps {
    name: string
    label: string
}
export const CommonFormField: FunctionComponent<CommonFormFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <div className='mb-3'>
            <label htmlFor={field.name} className='form-label'>
                {props.label}
            </label>
            <input className='form-control' {...field} {...props} />
            {meta.touched && meta.error ? (
                <span className='invalid-feedback'>{meta.error}</span>
            ) : null}
        </div>
    )
}

export interface SelectOption {
    name: string
    value: string
}
export interface SelectFormFieldProps extends CommonFormFieldProps {
    options: SelectOption[]
}
export const SelectFormField: FunctionComponent<SelectFormFieldProps> = props => {
    const [field, meta] = useField(props.name)

    return (
        <div className='mb-3'>
            <label htmlFor={field.name} className='form-label'>
                {props.label}
            </label>
            <select className='form-select' {...field} {...props}>
                <option selected disabled>
                    Select option...
                </option>
                {props.options.map((v: SelectOption, i: number) => (
                    <option key={i} value={v.value}>
                        {v.name}
                    </option>
                ))}
            </select>
        </div>
    )
}
