const router = require('express').Router();
const { fetchProducts } = require('../../db')

router.get('/', async(req, res, next) => {
  try {
    const products = await fetchProducts();
    res.status(200).send(products);
  } catch (error) {
    next(error)
  }
});

module.exports = router;