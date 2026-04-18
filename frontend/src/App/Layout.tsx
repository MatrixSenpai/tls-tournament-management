import type { FunctionComponent } from 'react'
import { Navigation } from './Navigation.tsx'
import { Outlet } from 'react-router'

export interface LayoutProps {}
// @ts-ignore
export const Layout: FunctionComponent<LayoutProps> = props => {
    return (
        <>
            <Navigation />
            <div className='container my-4'>
                <Outlet />
            </div>
        </>
    )
}
