const express = require('express');
const router = express.Router();
const receiptsController = require('../controllers/receiptsController');

router.get('/', receiptsController.getAll);
router.get('/:id', receiptsController.getById);
router.post('/', receiptsController.create);
router.delete('/:id', receiptsController.remove);

module.exports = router;