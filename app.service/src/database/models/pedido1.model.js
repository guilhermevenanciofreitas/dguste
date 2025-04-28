import Sequelize from 'sequelize'

export class Pedido1 {

  numero = {
    field: 'numero',
    primaryKey: true,
    type: Sequelize.BIGINT,
  }

  emissao = {
    field: 'emissao',
    type: Sequelize.STRING,
  }

  codcli = {
    field: 'codcli',
    type: Sequelize.INTEGER,
  }

  codven = {
    field: 'codven',
    type: Sequelize.INTEGER,
  }

  tab = {
    field: 'tab',
    type: Sequelize.INTEGER,
  }

  pag = {
    field: 'pag',
    type: Sequelize.STRING,
  }

  prz = {
    field: 'prz',
    type: Sequelize.INTEGER,
  }

  sit = {
    field: 'sit',
    type: Sequelize.STRING,
  }

}