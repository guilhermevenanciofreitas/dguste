import { Router } from 'express'
import { SellerController } from '../controllers/seller.controller.js'

export class SellerRoute {

    router = Router()
    controller = new SellerController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/sellers', async (req, res) => await this.controller.sellers(req, res))
    }

}