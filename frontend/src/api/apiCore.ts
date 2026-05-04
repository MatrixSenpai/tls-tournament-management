export function buildFinalUrl(base: string, params?: Record<string, any>): string {
    let final = base
    if (params !== undefined) {
        const query = new URLSearchParams(params).toString()
        base += `?${query}`
    }

    return final
}
