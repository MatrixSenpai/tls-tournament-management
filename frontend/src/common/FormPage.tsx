import { FunctionComponent, JSX } from 'react'
import { Link } from 'react-router'

export interface FormPageProps {
    title: string
    cancelLocation: string
    children: JSX.Element
}
export const FormPage: FunctionComponent<FormPageProps> = props => {
    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex flex-row justify-content-between'>
                    <div>
                        <h2>{props.title}</h2>
                    </div>

                    <div>
                        <Link to={props.cancelLocation} className='btn btn-secondary'>
                            &times;
                        </Link>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>{props.children}</div>
            </div>
        </div>
    )
}
