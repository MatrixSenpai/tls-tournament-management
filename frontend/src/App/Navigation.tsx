import type { FunctionComponent } from 'react'
import { Link, NavLink } from 'react-router'

export interface NavigationProps {}
// @ts-ignore
export const Navigation: FunctionComponent<NavigationProps> = props => {
    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className='container-fluid'>
                <Link to='/' className='navbar-brand'>
                    TLS Tournaments
                </Link>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#mainNav'
                >
                    <span className='navbar-toggler-icon' />
                </button>

                <div className='collapse navbar-collapse' id='mainNav'>
                    <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/tournaments'>
                                Tournaments
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/teams'>
                                Teams
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/players'>
                                Players
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/matches'>
                                Matches
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link disabled' to='/users'>
                                Users
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/*<div>*/}
                {/*    <ul className='navbar-nav mb-2 mb-lg-0'>*/}
                {/*        <li className='nav-item dropdown'>*/}
                {/*            <a*/}
                {/*                className='nav-link dropdown-toggle'*/}
                {/*                href='#'*/}
                {/*                role='button'*/}
                {/*                data-bs-toggle='dropdown'*/}
                {/*            >*/}
                {/*                <i className='bi bi-person me-2' />*/}
                {/*                MatrixSenpai*/}
                {/*            </a>*/}
                {/*            <ul className='dropdown-menu'>*/}
                {/*                <li>*/}
                {/*                    <span className='dropdown-item'>Settings</span>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <hr className='dropdown-divider' />*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <span className='dropdown-item'>Sign Out</span>*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </div>
        </nav>
    )
}
