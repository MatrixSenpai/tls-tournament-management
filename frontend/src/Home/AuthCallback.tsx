import { FunctionComponent, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../common'

export const AuthCallbackUtility: FunctionComponent = props => {
    // @ts-ignore
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        const code = params.get('code')
        if (code) {
            login(code)
            navigate('/')
        }
    }, [params])

    return <p>Logging in...</p>
}

export const AuthSignoutUtility: FunctionComponent = props => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    useEffect(() => {
        logout()
        navigate('/')
    }, [])

    return <p>Logging out...</p>
}
