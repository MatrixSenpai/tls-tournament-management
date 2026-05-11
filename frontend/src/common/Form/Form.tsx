import { useState } from 'react'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router'
import { Form, Formik, FormikValues } from 'formik'
import { CommonFormField, CommonFormFieldProps } from './FormFields.tsx'

export interface CommonFormProps<T> {
    initialValues: T
    validationSchema?: any
    submitFunction: (values: T) => Promise<void>
    successRedirectLocation: string

    fields: CommonFormFieldProps[]
}
export function CommonForm<T extends FormikValues>(props: CommonFormProps<T>) {
    const navigate = useNavigate()
    const [visible, setVisible] = useState<{ message: string; submission: T } | null>(null)

    const submitFunction = async (values: T) => {
        try {
            await props.submitFunction(values)
            navigate(props.successRedirectLocation)
        } catch (error) {
            setVisible({
                message: (error as AxiosError).message,
                submission: values,
            })
            console.log(error)
        }
    }

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                validationSchema={props.validationSchema}
                onSubmit={submitFunction}
            >
                <Form>
                    {props.fields.map((field, i) => (
                        <CommonFormField key={i} {...field} />
                    ))}

                    <div className='mb-3'>
                        <button className='btn btn-primary' type='submit'>
                            Save
                        </button>
                    </div>
                </Form>
            </Formik>

            {visible ? (
                <div className='toast-container position-fixed top-0 end-0 p-3'>
                    <div className='toast show' role='alert'>
                        <div className='toast-header'>
                            <strong className='me-auto'>Submission Failure</strong>
                            <button className='btn-close' onClick={() => setVisible(null)} />
                        </div>

                        <div className='toast-body'>
                            <p>An issue was encountered saving this item.</p>
                            <p>Error details:</p>
                            <p>{JSON.stringify(visible)}</p>
                            <p>Please take a screenshot and alert MatrixSenpai on Discord</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
