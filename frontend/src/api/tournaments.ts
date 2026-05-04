import useSWR, { type Fetcher } from 'swr'
import { buildFinalUrl } from './apiCore.ts'

import type { Tournament } from './types/Tournament.ts'
import type { FilterTournamentParams } from './types/FilterTournamentParams.ts'
import type { IncludeTournamentParams } from './types/IncludeTournamentParams.ts'
import type { CreateTournament } from './types/CreateTournament.ts'
import type { UpdateTournament } from './types/UpdateTournament.ts'
import { useState } from 'react'

const getTournamentsFetcher: Fetcher<
    Tournament[],
    { url: string; filter?: FilterTournamentParams; include?: IncludeTournamentParams }
> = async ({ url, include, filter }) => {
    const finalUrl = buildFinalUrl(url, { ...include, ...filter })
    const response = await fetch(finalUrl)
    return await response.json()
}

export function useGetTournaments(
    filter?: FilterTournamentParams,
    include?: IncludeTournamentParams,
) {
    const { data, error, isLoading } = useSWR(
        { url: '/api/v1/tournaments', include, filter },
        getTournamentsFetcher,
    )

    return { tournaments: data, error, isLoading }
}

export function useGetTournament(id: string) {
    const { data, error, isLoading } = useSWR<Tournament>(`/api/v1/tournaments/${id}`, k =>
        fetch(k).then(r => r.json()),
    )

    return { tournament: data, error, isLoading }
}

const createTournamentFetcher: Fetcher<
    Tournament,
    { url: string; body: CreateTournament }
> = async ({ url, body }) => {
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(r => r.json())
}
export function useCreateTournament() {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetcher = async (body: CreateTournament) => {
        setLoading(true)

        const response = await fetch('/api/v1/tournaments', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            setError(new Error(response.statusText))
        }
        setLoading(false)
    }

    return { createTournamentMutation: fetcher, error, isLoading }
}

export function useUpdateTournament() {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetcher = async (id: string, body: UpdateTournament) => {
        setLoading(true)

        const response = await fetch(`/api/v1/tournaments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            setError(new Error(await response.text()))
        }

        setLoading(false)
    }

    return { updateTournamentMutation: fetcher, error, isLoading }
}
