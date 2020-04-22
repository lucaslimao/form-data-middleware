const core = require('../core')

const express = async (req, res, next) => {

    try {

        req = await core(req, true)

        return next()

    } catch (error) {

        return res.status(500).json({ error: 'Erro ao ler Form-Data' })

    }

}

module.exports = express