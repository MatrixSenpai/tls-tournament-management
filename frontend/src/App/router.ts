import { createBrowserRouter } from 'react-router'
import { Layout } from './Layout'

import { AuthCallbackUtility, AuthSignoutUtility, homeRoutes } from '../Home'
import { tournamentRoutes } from '../Tournament'

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [homeRoutes, tournamentRoutes],
    },
    {
        path: '/auth/callback',
        Component: AuthCallbackUtility,
    },
    {
        path: '/logout',
        Component: AuthSignoutUtility,
    },
])
