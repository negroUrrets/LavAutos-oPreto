const { Router } = require('express');
const auth = require('./auth');
const requireAuth = require('../middlewares/requireAuth');
const clientes = require('./clientes');
const vehiculos = require('./vehiculos');
const categoriasVehiculo = require('./categoriasVehiculo');
const marcasVehiculo = require('./marcasVehiculo');
const modelosVehiculo = require('./modelosVehiculo');
const lavados = require('./lavados');
const categoriasLavado = require('./categoriasLavado');
const utilerias = require('./utilerias');
const estadosLavado = require('./estadosLavado');

const router = Router();

router.use('/auth', auth);

router.use('/clientes', requireAuth, clientes);
router.use('/vehiculos', requireAuth, vehiculos);
router.use('/categorias-vehiculo', requireAuth, categoriasVehiculo);
router.use('/marcas-vehiculo', requireAuth, marcasVehiculo);
router.use('/modelos-vehiculo', requireAuth, modelosVehiculo);
router.use('/lavados', requireAuth, lavados);
router.use('/categorias-lavado', requireAuth, categoriasLavado);
router.use('/utilerias', requireAuth, utilerias);
router.use('/estados-lavado', requireAuth, estadosLavado);

module.exports = router;
