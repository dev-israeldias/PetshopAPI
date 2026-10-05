const { validationResult } = require('express-validator');
const Agendamento = require('../models/Agendamento');

// cria um novo agendamento para o cliente autenticado 
async function criar(req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { petNome, servico, data, hora } = req.body;

    const agendamento = await Agendamento.create({
      petNome,
      servico,
      data,
      hora,
      clienteId: req.clienteId,
    });

    return res.status(201).json(agendamento);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao criar agendamento.', detalhe: erro.message });
  }
}

// lista apenas os agendamentos do cliente autenticado
async function listarMeus(req, res) {
  try {
    const agendamentos = await Agendamento.findAll({
      where: { clienteId: req.clienteId },
      order: [['data', 'ASC'], ['hora', 'ASC']],
    });
    return res.json(agendamentos);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar agendamentos.', detalhe: erro.message });
  }
}

module.exports = { criar, listarMeus };
