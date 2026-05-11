import { jwtDecode } from 'jwt-decode'
import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react'
import { request } from '../api'

interface AuthContext {
    authenticated: boolean
    name: string
    role: 'USER' | 'ADMIN'
    login: (code: string) => Promise<void>
    logout: () => Promise<void>
}
const AuthContext = createContext<AuthContext | null>(null)
const AuthContextProvider = AuthContext.Provider

export const AuthProvider: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [name, setName] = useState('')
    const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await request<string>('/auth/revalidate', 'GET')
                const decoded = jwtDecode(response)

                setAuthenticated(true)
                // @ts-ignore
                setRole(decoded.adm ? 'ADMIN' : 'USER')
                // @ts-ignore
                setName(decoded.usr)
                localStorage.setItem('authToken', response)
            } catch {
                await logout()
            }
        }
        checkAuth()
    }, [])

    const login = async (code: string) => {
        const response = await fetch(`/auth/finalize?code=${code}&state=state`)
        const data = await response.text()
        const decoded = jwtDecode(data)

        setAuthenticated(true)
        // @ts-ignore
        setRole(decoded.adm ? 'ADMIN' : 'USER')
        // @ts-ignore
        setName(decoded.usr)
        localStorage.setItem('authToken', data)
    }

    const logout = async () => {
        setAuthenticated(false)
        setRole('USER')
        setName('')
        localStorage.removeItem('authToken')
    }

    const value = {
        authenticated,
        name,
        role,
        login,
        logout,
    }

    return <AuthContextProvider value={value}>{children}</AuthContextProvider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider!')
    return ctx
}
