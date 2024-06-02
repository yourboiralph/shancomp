import BaseAPIService from '~/components/api/BaseAPIService'

class ProductsService extends BaseAPIService {
    async getProducts(params: object): Promise<any> {
        return await this.request(`/products`, 'GET', params)
    }
}

export const productsService = new ProductsService()
