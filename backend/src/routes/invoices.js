const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');

router.get('/', invoicesController.getAll);
router.get('/:id', invoicesController.getById);
router.post('/', invoicesController.create);
router.patch('/:id/status', invoicesController.updateStatus);
router.delete('/:id', invoicesController.remove);

module.exports = router;