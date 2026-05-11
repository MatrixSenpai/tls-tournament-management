import { request } from './api'
import { FilterTournamentParams } from './types/FilterTournamentParams'
import { IncludeTournamentParams } from './types/IncludeTournamentParams'
import { Tournament } from './types/Tournament'
import { CreateTournament } from './types/CreateTournament'
import { UpdateTournament } from './types/UpdateTournament'
import useSWR from 'swr'

export const allTournaments = (filter?: FilterTournamentParams, include?: IncludeTournamentParams) => {
    const { data } = useSWR(
        '/tournaments',
        () => request<Tournament[]>('/tournaments', 'GET', { ...filter, ...include }),
        { suspense: true },
    )
    return { tournaments: data }
}

export const oneTournament = async (id: string): Promise<Tournament> => {
    return await request<Tournament>(`/tournaments/${id}`, 'GET')
}

export const createTournament = async (body: CreateTournament): Promise<void> => {
    return await request<void>('/tournaments', 'POST', body)
}

export const updateTournament = async (id: string, body: UpdateTournament): Promise<void> => {
    return await request<void>(`/tournaments/${id}`, 'PATCH', body)
}
