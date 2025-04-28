import { AppContext } from "../database/index.js"
import Sequelize from "sequelize"
import _ from 'lodash'

import { Exception } from "../utils/exception.js"

export class SellerController {

  sellers = async (req, res) => {
    //await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        const db = new AppContext()

        const sellers = await db.Vendedor.findAll({attributes: ['codven', 'nome', 'senha']})

        res.status(200).json({sellers})

      } catch (error) {
        Exception.error(res, error)
      }
    //}).catch((error) => {
    //  Exception.unauthorized(res, error)
    //})
  }

  /*
  detail = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          const called = await db.Called.findOne({
            attributes: ['id', 'number', 'priority', 'step', 'externalProtocol', 'subject', 'observation'],
            include: [
              {model: db.Company, as: 'company', attributes: ['id', 'surname']},
              {model: db.Partner, as: 'requested', attributes: ['id', 'surname']},
              {model: db.CalledStatus, as: 'status', attributes: ['id', 'description']},
              {model: db.User, as: 'responsible', attributes: ['id', 'userName']},
              {model: db.Partner, as: 'requested', attributes: ['id', 'cpfCnpj', 'surname']},
              {model: db.CalledReason, as: 'reason', attributes: ['id', 'description']},
              {model: db.CalledOccurrence, as: 'occurrence', attributes: ['id', 'description']}
            ],
            where: [{id: id}],
            transaction
          })

          res.status(200).json(called)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  submit = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        let called = {
          id: req.body.id,
          companyId: req.body.company?.id || null,
          requestedId: req.body.requested?.id || null,
          responsibleId: req.body.responsible?.id || null,
          reasonId: req.body.reason?.id || null,
          occurrenceId: req.body.occurrence?.id || null,
          priority: req.body.priority,
          step: req.body.step,
          externalProtocol: req.body.externalProtocol,
          subject: req.body.subject,
          observation: req.body.observation
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(called.id)) {

            let lastNumber = await db.query(`SELECT MAX(number) AS number FROM called INNER JOIN empresa_filial ON empresa_filial.codigo_empresa_filial = called.companyId WHERE empresa_filial.codigo_empresa = ${companyBusinessId}`, {type: Sequelize.QueryTypes.SELECT})
            
            lastNumber = parseInt(lastNumber[0]['number'])

            called = await db.Called.create({userId, number: lastNumber ? lastNumber + 1 : 1, createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), ...called}, {transaction})

          } else {
            await db.Called.update(called, {where: [{id: called.id}], transaction})
          }

          called = await db.Called.findOne({
            attributes: ['id', 'number'], include: [
              {model: db.User, as: 'responsible', attributes: ['id', 'userName']}
            ],
            where: [{id: called.id}],
            transaction
          })

          res.status(200).json(called)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }
  */
}