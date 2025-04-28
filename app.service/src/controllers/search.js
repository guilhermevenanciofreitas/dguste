//import { Authorization } from "./authorization.js";
import { AppContext } from '../database/index.js'
import Sequelize from "sequelize"
import _ from "lodash"
import { Exception } from "../utils/exception.js";

export class SearchController {

    company = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                where.push({
                    //'$company.codigo_empresa$': companyBusinessId,
                    '$userId$': userId,
                    '$company.nome_fantasia$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                })

                const companies = await db.CompanyUser.findAll({
                    attributes: ['id'],
                    include: [
                        {model: db.Company, as: 'company', attributes: ['id', 'name', 'surname']}
                    ],
                    where,
                    order: [
                        [{model: db.Company, as: 'company'}, 'id', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(_.map(companies, (companyUser) => companyUser.company.dataValues))

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    calledReason = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const reasons = await db.CalledReason.findAll({
                    attributes: ['id', 'description'],
                    where: [{
                        '$description$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['description', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(reasons)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    calledOccurrence = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const occurrences = await db.CalledOccurrence.findAll({
                    attributes: ['id', 'description'],
                    where: [{
                        '$description$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['description', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(occurrences)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    calledStatus = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const status = await db.CalledStatus.findAll({
                    attributes: ['id', 'description'],
                    where: [{
                        '$description$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['description', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(status)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    user = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                where.push({'$companyUsers.company.codigo_empresa$': companyBusinessId})

                where.push({'$userName$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}})

                const users = await db.User.findAll({
                    attributes: ['id', 'userName'],
                    include: [
                        {model: db.CompanyUser, as: 'companyUsers', attributes: ['id'], include: [
                            {model: db.Company, as: 'company', attributes: ['id', 'companyBusinessId']}
                        ]}
                    ],
                    where,
                    order: [
                        ['userName', 'asc']
                    ],
                    limit: 20,
                    subQuery: false
                })

                res.status(200).json(users)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    role = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const company = await db.Company.findOne({attributes: ['companyBusinessId'], where: [{codigo_empresa_filial: companyId}]})

                const where = [{'$companyBusinessId$': company.companyBusinessId}]

                where.push({'$name$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}})
                
                const roles = await db.Role.findAll({
                    attributes: ['id', 'name'],
                    where,
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(roles)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    partner = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                where.push({'$companyBusinessId$': companyBusinessId})

                where.push({[Sequelize.Op.or]: [
                    {'$CpfCnpj$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                    {'$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                ]})

                const partners = await db.Partner.findAll({
                    attributes: ['id', 'cpfCnpj', 'name', 'surname'],
                    where,
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(partners);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    city = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const city = await db.City.findAll({
                    attributes: ['id', 'name'],
                    include: [
                        {model: db.State, as: 'state', attributes: ['id', 'acronym']}
                    ],
                    where: [{
                        nome_municipio: {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`},
                    }],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(city)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error)
        })
    }

    driver = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                where.push({'$companyBusinessId$': companyBusinessId})

                where.push({[Sequelize.Op.or]: [
                    {'$CpfCnpj$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                    {'$nome$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                ]})

                const driver = await db.Partner.findAll({
                    attributes: ['id', 'cpfCnpj', 'surname'],
                    where,
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(driver);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    sender = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                //where.push({'$companyBusinessId$': companyBusinessId})

                where.push({[Sequelize.Op.or]: [
                    {'$CpfCnpj$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                    {'$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                ]})

                await db.transaction(async (transaction) => {

                    const sender = await db.Partner.findAll({
                        attributes: ['id', 'cpfCnpj', 'name', 'surname'],
                        where,
                        order: [
                            ['surname', 'asc']
                        ],
                        limit: 20,
                        transaction
                    });
    
                    res.status(200).json(sender);
    
                })
                
            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    recipient = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = []

                //where.push({'$companyBusinessId$': companyBusinessId})

                where.push({[Sequelize.Op.or]: [
                    {'$CpfCnpj$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                    {'$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                ]})

                const recipient = await db.Partner.findAll({
                    attributes: ['id', 'cpfCnpj', 'name', 'surname'],
                    where,
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(recipient);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    employee = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext(options)

                const where = []

                //where.push({'$companyBusinessId$': companyBusinessId})

                where.push({[Sequelize.Op.or]: [
                    {'$CpfCnpj$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                    {'$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                ]})

                const partners = await db.Partner.findAll({
                    attributes: ['id', 'cpfCnpj', 'name', 'surname'],
                    where,
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(partners);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    bankAccount = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const bankAccounts = await db.BankAccount.findAll({
                    attributes: ['id', 'agency', 'account'],
                    include: [
                        {model: db.Bank, as: 'bank', attributes: ['id', 'name']}
                    ],
                    where: [{
                        /*
                        [Op.or]: {
                            '$bank.name$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'agency': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'agencyDigit': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'account': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'accountDigit': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                        }*/
                    }],
                    order: [
                        //['bank', 'name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(bankAccounts);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    contabilityCategorie = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const contabilityCategories = await db.ContabilityCategorie.findAll({
                    attributes: ['id', 'name'],
                    where: [{
                        '$companyId$': company.id,
                    }],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(contabilityCategories);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    receivementMethod = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const receivementMethods = await db.ReceivementMethod.findAll({
                    attributes: ['id'],
                    include: [
                        {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']}
                    ],
                    where: [{
                        '$companyId$': company.id,
                        '$currencyMethod.name$': {[Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['currencyMethod', 'name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(_.map(receivementMethods, (receivementMethod) => Object.create(receivementMethod.currencyMethod)));

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    taskMethod = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const taskMethods = await db.TaskMethod.findAll({
                    attributes: ['id', 'name'],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(taskMethods);

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    /*
    async service(req, res) {
        Auth.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext(options)

                const services = await db.Service.findAll({
                    attributes: ["id", "description"],
                    where: {'description': {[Op.like]: `%${req.body?.search.replace(' ', "%")}%`}},
                    order: [["description", "asc"]],
                    limit: 20
                });

                res.status(200).json(services);

            } catch (error) {
                Exception.error(res, error);
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }
    */

    /*
    async vehicle(req, res) {
        Auth.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext(options)

                const vehicles = await db.Vehicle.findAll({
                    attributes: ["id", "identity"],
                    where: {identity: {[Op.like]: `%${req.body?.search.replace(' ', "%")}%`}},
                    order: [["identity", "asc"]],
                    limit: 20
                });

                res.status(200).json(vehicles);

            } catch (error) {
                Exception.error(res, error);
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }
    */

    cfop = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const cfop = await db.Cfop.findAll({
                    attributes: ['id', 'code', 'description'],
                    where: [{
                        [Sequelize.Op.or]: [
                            {'$CFOP$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}},
                            {'$Descricao$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}
                        ]
                    }],
                    order: [
                        ['code', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(cfop)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    integration = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const integrations = await db.Integration.findAll({
                    attributes: ['id', 'name'],
                    where: [{'$name$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(integrations)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }

    companyIntegration = async (req, res) => {
        Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
            try {

                const db = new AppContext()

                const where = [{'$integration.name$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}}]

                if (req.body.scope) {
                    where.push({'$integration.scope$': {[Sequelize.Op.like]: `%${req.body?.scope}%`}})
                }

                const companyIntegrations = await db.CompanyIntegration.findAll({
                    attributes: ['id'],
                    include: [
                        {model: db.Integration, as: 'integration', attributes: ['id', 'name']}
                    ],
                    where,
                    order: [
                        [{model: db.Integration, as: 'integration'}, 'name', 'asc']
                    ],
                    limit: 20
                })

                res.status(200).json(companyIntegrations)

            } catch (error) {
                Exception.error(res, error)
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }
  
}