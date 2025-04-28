import { Router } from 'express'
import { SaleOrderController } from '../controllers/saleOrder.controller.js'

export class SaleOrderRoute {

    router = Router()
    controller = new SaleOrderController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/import', async (req, res) => await this.controller.import(req, res))
    }

}