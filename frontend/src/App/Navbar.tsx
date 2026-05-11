import { FunctionComponent } from 'react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '../common'

export interface NavbarProps {}
export const Navbar: FunctionComponent<NavbarProps> = props => {
    const { authenticated, role, name } = useAuth()

    let links = [
        ['Tournaments', '/tournaments'],
        ['Teams', '/teams'],
        ['Players', '/players'],
        ['Series', '/series'],
        ['Games', '/games'],
    ].map(([name, link], index) => (
        <li className='nav-item' key={index}>
            <NavLink to={link} className='nav-link'>
                {name}
            </NavLink>
        </li>
    ))

    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className='container-fluid'>
                <a className='navbar-brand' href='/'>
                    TLS Tournaments
                </a>
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#mainNav'>
                    <span className='navbar-toggler-icon' />
                </button>

                <div className='collapse navbar-collapse' id='mainNav'>
                    <ul className='navbar-nav me-auto mb-2 mb-lg-0'>{links}</ul>
                </div>
            </div>

            <div className='d-flex me-2'>{authenticated ? <User /> : <LoginButton />}</div>
        </nav>
    )
}

const LoginButton: FunctionComponent = () => (
    <a
        href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&scope=identify&state=asdf&redirect_uri=${import.meta.env.VITE_DISCORD_CALLBACK}&prompt=consent`}
        className='btn btn-outline-success'
    >
        Login
    </a>
)

const User: FunctionComponent = () => {
    const { name, role } = useAuth()

    return (
        <ul className='navbar-nav'>
            <li className='nav-item dropdown'>
                <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown'>
                    {name}
                </a>

                <ul className='dropdown-menu'>
                    {role === 'ADMIN' ? (
                        <li>
                            <Link to='/users' className='dropdown-item'>
                                Manage Users
                            </Link>
                        </li>
                    ) : null}
                    <li>
                        <Link to='/logout' className='dropdown-item'>
                            Sign Out
                        </Link>
                    </li>
                </ul>
            </li>
        </ul>
    )
}
