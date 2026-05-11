import { FunctionComponent } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { AuthProvider } from '../common'

export interface AppProps {}
export const App: FunctionComponent<AppProps> = props => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}
