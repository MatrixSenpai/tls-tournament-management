import { FunctionComponent, JSX, Suspense } from 'react'
import { Link } from 'react-router'
import { useAuth } from './useAuth.tsx'

export interface ListPageProps {
    title: string
    createTitle: string
    createLink: string

    children: JSX.Element
}
export const ListPage: FunctionComponent<ListPageProps> = props => {
    const { authenticated, role } = useAuth()

    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex flex-row justify-content-between'>
                    <div>
                        <h2>{props.title}</h2>
                    </div>

                    {authenticated && role === 'ADMIN' ? (
                        <div>
                            <Link to={props.createLink} className='btn btn-primary'>
                                <i className='bi bi-plus-lg me-2' />
                                {props.createTitle}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>
                    <Suspense fallback={<p>Loading data...</p>}>{props.children}</Suspense>
                </div>
            </div>
        </div>
    )
}
