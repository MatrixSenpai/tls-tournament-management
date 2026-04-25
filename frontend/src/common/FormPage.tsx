import { ObjectSchema } from 'yup'
import { type FunctionComponent, type ReactElement, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { Formik } from 'formik'

interface SubmitFormOptions {
    method: 'POST' | 'PATCH'
    endpoint: string
    transform?: (values: any) => any
}

export interface FormPageProps {
    pageTitle: string
    returnToLocation: string
    initialValues: any
    validationSchema?: ObjectSchema<any>
    submitOptions: SubmitFormOptions
    children: ReactElement
}
export const FormPage: FunctionComponent<FormPageProps> = props => {
    const navigate = useNavigate()
    const alertRef = useRef<HTMLDivElement>(null)

    const submitFunction = async (values: any) => {
        const transform =
            props.submitOptions.transform !== undefined
                ? props.submitOptions.transform(values)
                : values
        const response = await fetch(props.submitOptions.endpoint, {
            method: props.submitOptions.method,
            body: JSON.stringify(transform),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const alert = alertRef.current
            alert?.classList.remove('d-none')
            console.error(JSON.stringify(response))
        } else {
            navigate(props.returnToLocation)
        }
    }

    return (
        <>
            <div
                className='alert alert-danger alert-dismissible fade show d-none'
                id='errorAlert'
                ref={alertRef}
            >
                <i className='bi flex-shrink-0 me-2 bi-exclamation-triangle-fill' />
                <strong>Server Error: </strong> Check console for details
                <button type='button' className='btn-close' data-bs-dismiss='alert' />
            </div>
            <div className='d-grid row-gap-4'>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-between'>
                        <h2>{props.pageTitle}</h2>
                        <Link to={props.returnToLocation} className='btn-close' />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <Formik initialValues={props.initialValues} onSubmit={submitFunction}>
                            {props.children}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}
