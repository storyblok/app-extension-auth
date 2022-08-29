const dummyOrigin = 'https://dummy.com'

export const appendQueryParams = (url: string, params: Record<string, string>): string => {
    const urlObj = new URL(url, dummyOrigin)
    Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value)
    })

    return (
        urlObj
            .toString()
            .replace(
                new RegExp(`^${dummyOrigin}`),
                ''
            )
    )
}