import type { FunctionComponent } from 'react'
import { useLoaderData } from 'react-router'
import type { Player } from '../bindings/Player.ts'
import { SinglePage } from '../common'

export interface SinglePlayerProps {}
export const SinglePlayer: FunctionComponent<SinglePlayerProps> = props => {
    const { player } = useLoaderData<{ player: Player }>()

    return (
        <SinglePage pageTitle={player.riot_name} editLink={`/players/${player._id['$oid']}/edit`} />
    )
}
