import APIError from '~/components/api/APIError'

class BaseAPIService {
    async request(url: string, method: string, params: object = []): Promise<any> {
        const runtimeConfig = useRuntimeConfig()
        let config: any = {
            baseURL: `http://127.0.0.1:8000/api`,
            method: method,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('_token'),
                Accept: 'application/json',
            }
        }

        if (method === 'GET') {
            config.params = params
        } else {
            config.body = JSON.stringify(params)
        }

        try {
            console.log('Request Config:', config)
            return await $fetch(url, config)
        } catch (error: any) {
            console.error('API Error:', error)
            switch (error.response?.status) {
                case 400:
                case 404:
                case 422:
                case 429:
                    throw new APIError(error.response._data)
                case 401:
                    this.revokeAccess()
                    break
                case 500:
                    throw new APIError({
                        message: "Server error. Please try again. If the problem persists, contact your system administrator"
                    })
                default:
                    throw new APIError({
                        message: "Something went wrong. Please try again. If the problem persists, contact your system administrator"
                    })
            }
        }
    }

    revokeAccess() {
        localStorage.removeItem("_token")
        navigateTo('/')
    }
}

export default BaseAPIService
