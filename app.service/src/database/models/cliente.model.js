import Sequelize from 'sequelize'

export class Cliente {

  codcli = {
    field: 'codcli',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  razao = {
    field: 'razao',
    type: Sequelize.STRING,
  }

  fantasia = {
    field: 'fantasia',
    type: Sequelize.STRING,
  }

}