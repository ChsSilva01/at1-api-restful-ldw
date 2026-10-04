'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agendamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paciente: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      profissional: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      data_horario: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Agendado', 'Realizado', 'Cancelado'),
        defaultValue: 'Agendado',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // É importante dropar a tabela correta no down e, caso o Postgres reclame do tipo ENUM,
    // garantimos a remoção limpa.
    await queryInterface.dropTable('agendamentos');
  }
};