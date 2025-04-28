import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'

export class ProductRoute {

    router = Router()
    controller = new ProductController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/products', async (req, res) => await this.controller.products(req, res))
    }

}