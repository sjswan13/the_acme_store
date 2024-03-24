const router = require('express').Router();
const { fetchUsers, createUserFavorites, destroyFavorite } = require('../../db')

router.get('/', async(req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send(customers);
  } catch (error) {
    next(error)
  }
});

router.post('/:user_id/favorites/', async (req, res, next) => {
  try {
    const { user_favorites } = req.body;
    const userFavorites = await createUserFavorites({
      user_id: req.params.user_id,
      product_id: product_id
    });
    res.status(201).send(userFavorites);
  } catch (error) {
    next(error)
  }
});

router.delete('/users/:userId/favorites/:id', async(req, res, next) => {
  try {
    await destroyFavorite({user_id: req.params.user_id, id: req.params.userFavorites});
    res.status(204).end();
  } catch (error) {
    next(error)
  }
})

module.exports = router;