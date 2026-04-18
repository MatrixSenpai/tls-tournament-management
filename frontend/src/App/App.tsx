import type { FunctionComponent } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'

export interface AppProps {}
// @ts-ignore
export const App: FunctionComponent<AppProps> = props => {
    return <RouterProvider router={router} />
}
