const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

// bd sequelize agendamento
const Agendamento = sequelize.define('Agendamento', {
  petNome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servico: {
    type: DataTypes.ENUM('banho', 'tosa', 'banho_e_tosa', 'consulta'),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado'),
    defaultValue: 'pendente',
  },
}, {
  tableName: 'agendamentos',
  timestamps: true,
});

// um cliente pode ter vários agendamentos
Cliente.hasMany(Agendamento, { foreignKey: 'clienteId' });
Agendamento.belongsTo(Cliente, { foreignKey: 'clienteId' });

module.exports = Agendamento;
