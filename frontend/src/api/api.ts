import axios, { AxiosResponse } from 'axios'

const client = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error),
)

export const request = async <T>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await client({ method, url, data })
    return response.data
}
