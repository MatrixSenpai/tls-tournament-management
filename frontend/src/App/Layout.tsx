import { FunctionComponent } from 'react'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar'

export interface LayoutProps {}
export const Layout: FunctionComponent<LayoutProps> = props => {
    return (
        <>
            <Navbar />
            <div className='container my-4'>
                <Outlet />
            </div>
        </>
    )
}
