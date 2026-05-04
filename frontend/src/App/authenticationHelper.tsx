import { createContext, type ReactNode, useContext, useState } from 'react'

interface User {
    id: string
    admin: boolean
}

interface AuthenticationState {
    user: User | null
}

const UserContext = createContext<AuthenticationState>({ user: null })

export const UserContextProvider = (props: { children: ReactNode }) => {
    const [userState] = useState({ user: null })

    return <UserContext.Provider value={userState}>{props.children}</UserContext.Provider>
}

export const useUserContext = () => {
    const userContext = useContext(UserContext)

    if (!userContext) {
        throw new Error('useUserContext has to be used within User Context')
    }

    return userContext
}
