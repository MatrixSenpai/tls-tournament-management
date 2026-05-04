import type { FunctionComponent } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import { UserContextProvider } from './authenticationHelper.tsx'

export interface AppProps {}
// @ts-ignore
export const App: FunctionComponent<AppProps> = props => {
    return (
        <UserContextProvider>
            <RouterProvider router={router} />
        </UserContextProvider>
    )
}
