const router = require("express").Router({mergeParams: true});
const {
  fetchPage,
  fetchMoveWithId,
  fetchNextMove
} = require("../controllers/chess.controller");
const { fetchPageMiddleware } = require("../middlewares/chess");

router.route("/").get(fetchPageMiddleware, fetchPage);
router.route("/:id/").get(fetchPageMiddleware, fetchMoveWithId);
router.route("/:id/*").get(fetchPageMiddleware, fetchNextMove);

module.exports = router;
