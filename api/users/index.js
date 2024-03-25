const router = require('express').Router();
const { fetchUsers, createUserFavorites, destroyFavorite, fetchUserFavorites } = require('../../db')

router.get('/', async(req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send(users);
  } catch (error) {
    next(error)
  }
});

router.get('/:id/favorites/', async(req, res, next) => {
  try {
    const user_id = req.params.id;
    const userFavorites = await fetchUserFavorites(user_id);
    res.status(200).send(userFavorites);
  } catch (error) {
    next(error)
  }
});

router.post('/:id/favorites/', async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const { product_id } = req.body;
     if (!product_id) {
      return res.status(400).json({ error: "Product ID must be provided." });
    }
    const userFavorites = await createUserFavorites({
      user_id: req.params.id,
      product_id: product_id
    });
    res.status(201).send(userFavorites);
  } catch (error) {
    next(error)
  }
});

router.delete('/:user_id/favorites/:id', async(req, res, next) => {
  try {
    const { user_id, id: user_favorites } = req.params;

    await destroyFavorite({user_id, id: user_favorites});
    res.status(204).end();
  } catch (error) {
    next(error)
  }
})

module.exports = router;