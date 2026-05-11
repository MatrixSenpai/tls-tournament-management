import { Outlet } from 'react-router'
import { CreateTournamentForm } from './Create'
import { ListTournament } from './List'
import { ProtectedRoute } from '../common'

export * from './List'

export const tournamentRoutes = {
    path: 'tournaments',
    Component: Outlet,
    children: [
        {
            index: true,
            Component: ListTournament,
        },
        {
            path: 'create',
            Component: ProtectedRoute,
            children: [
                {
                    index: true,
                    Component: CreateTournamentForm,
                },
            ],
        },
    ],
}
