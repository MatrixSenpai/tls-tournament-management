import { FunctionComponent } from 'react'
import { useAuth } from './useAuth.tsx'
import { Link, Outlet } from 'react-router'

export const ProtectedRoute: FunctionComponent = () => {
    const { authenticated } = useAuth()

    return authenticated ? (
        <Outlet />
    ) : (
        <div className='row'>
            <div className='col-12'>
                <h2>Unauthorized</h2>
                <p>You must be signed in and an admin in order to access this page</p>
                <p>If you believe this to be an error, contact MatrixSenpai on the TLS Discord</p>
                <Link to='/' className='btn btn-primary'>
                    Return Home
                </Link>
            </div>
        </div>
    )
}
