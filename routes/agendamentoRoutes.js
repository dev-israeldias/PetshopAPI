const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const agendamentoController = require('../controllers/agendamentoController');

// cria um agendamento
router.post(
  '/',
  verifyToken,
  [
    body('petNome').trim().notEmpty().withMessage('O nome do pet é obrigatório.'),
    body('servico')
      .isIn(['banho', 'tosa', 'banho_e_tosa', 'consulta'])
      .withMessage('Serviço inválido.'),
    body('data').isDate().withMessage('Data inválida (use AAAA-MM-DD).'),
    body('hora')
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora inválida (use HH:MM).'),
  ],
  agendamentoController.criar
);

// lista os agendamentos do cliente logado
router.get('/', verifyToken, agendamentoController.listarMeus);

module.exports = router;
