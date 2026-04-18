import { createBrowserRouter, Outlet } from 'react-router'
import { Layout } from './Layout.tsx'
import {
    CreateTournamentForm,
    ListTournament,
    SingleTournament,
    UpdateTournamentForm,
} from '../Tournament'
import { CreateTeamForm, ListTeam } from '../Team'
import { ListPlayer } from '../Player'
import { ListMatch } from '../Matches'

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            {
                path: 'tournaments',
                Component: Outlet,
                children: [
                    {
                        index: true,
                        Component: ListTournament,
                        loader: async () => {
                            let tournaments = await fetch('/api/v1/tournaments').then(res =>
                                res.json(),
                            )
                            return { tournaments }
                        },
                    },
                    {
                        path: ':id/details',
                        Component: SingleTournament,
                        loader: async ({ params }) => {
                            let tournament = await fetch(`/api/v1/tournaments/${params.id}`).then(
                                res => res.json(),
                            )
                            let teams = await fetch(`/api/v1/tournaments/${params.id}/teams`).then(
                                res => res.json(),
                            )
                            let matches = await fetch(
                                `/api/v1/tournaments/${params.id}/matches`,
                            ).then(res => res.json())
                            return { tournament, teams, matches }
                        },
                    },
                    {
                        path: 'create',
                        Component: CreateTournamentForm,
                    },
                    {
                        path: ':id/edit',
                        Component: UpdateTournamentForm,
                        loader: async ({ params }) => {
                            let tournament = await fetch(`/api/v1/tournaments/${params.id}`).then(
                                res => res.json(),
                            )
                            return { tournament }
                        },
                    },
                ],
            },
            {
                path: 'teams',
                Component: Outlet,
                children: [
                    {
                        index: true,
                        Component: ListTeam,
                        loader: async () => {
                            let teams = await fetch('/api/v1/teams').then(res => res.json())
                            return Promise.all(
                                teams.map(async team => {
                                    return await fetch(`/api/v1/teams/${team._id['$oid']}/captain`)
                                        .then(async res => {
                                            let captain = await res.json()
                                            return { team, captain, _id: team._id }
                                        })
                                        .catch(() => {
                                            return { team, captain: null, _id: team._id }
                                        })
                                }),
                            )
                        },
                    },
                    {
                        path: 'create',
                        Component: CreateTeamForm,
                        loader: async () => {
                            let tournaments = await fetch('/api/v1/tournaments').then(res =>
                                res.json(),
                            )
                            return { tournaments }
                        },
                    },
                ],
            },
            {
                path: 'players',
                Component: Outlet,
                children: [
                    {
                        index: true,
                        Component: ListPlayer,
                        loader: async () => {
                            let players = await fetch('/api/v1/players').then(res => res.json())
                            return { players }
                        },
                    },
                ],
            },
            {
                path: 'matches',
                Component: Outlet,
                children: [
                    {
                        index: true,
                        Component: ListMatch,
                        loader: async () => [],
                    },
                ],
            },
        ],
    },
])
