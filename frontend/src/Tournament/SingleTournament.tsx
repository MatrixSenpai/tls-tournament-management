import type { FunctionComponent } from 'react'
import { Link, useLoaderData } from 'react-router'
import type { Tournament } from '../bindings/Tournament.ts'
import type { Team } from '../bindings/Team.ts'
import type { Match } from '../bindings/Match.ts'

export interface SingleTournamentProps {}
// @ts-ignore
export const SingleTournament: FunctionComponent<SingleTournamentProps> = props => {
    const { tournament, teams, matches } = useLoaderData<{
        tournament: Tournament
        teams: Team[]
        matches: Match[]
    }>()

    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                    <h2>{tournament.name}</h2>

                    <div>
                        <Link
                            to={`/tournaments/${tournament._id['$oid']}/edit`}
                            className='btn btn-primary'
                        >
                            <i className='bi bi-pencil me-2' />
                            Edit
                        </Link>
                    </div>
                </div>
            </div>
            <div className='row row-gap-md-0 row-gap-4'>
                <div className='col-md-6 col-12'>
                    <h4>Registered Teams</h4>

                    <div className='list-group'>
                        {teams.map(team => (
                            <li className='list-group-item'>{team.name}</li>
                        ))}
                    </div>
                </div>

                <div className='col-md-6 col-12'>
                    <h4>Matches</h4>
                    <div className='list-group'>
                        <li className='list-group-item'>Match 1</li>
                        <li className='list-group-item'>Match 2</li>
                        <li className='list-group-item'>Match 3</li>
                        <li className='list-group-item'>Match 4</li>
                        <li className='list-group-item'>Match 5</li>
                        <li className='list-group-item'>Match 6</li>
                    </div>
                </div>
            </div>
        </div>
    )
}
