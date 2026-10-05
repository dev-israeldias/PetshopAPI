const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Cliente = require('../models/Cliente');
require('dotenv').config();

// Cadastrar um cliente novo
async function registrar(req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { nome, email, senha, telefone } = req.body;

    const jaExiste = await Cliente.findOne({ where: { email } });
    if (jaExiste) {
      return res.status(409).json({ erro: 'Já existe um cliente com esse e-mail.' });
    }

    // criptografia da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const cliente = await Cliente.create({ nome, email, senha: senhaHash, telefone });

    return res.status(201).json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao registrar cliente.', detalhe: erro.message });
  }
}

// confere a senha com bcrypt e devolve um token 
async function login(req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.CHAVESECRETISSIMA,
      { expiresIn: '8h' }
    );

    return res.json({ mensagem: 'Login realizado com sucesso.', token });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: erro.message });
  }
}

module.exports = { registrar, login };
