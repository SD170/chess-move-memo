const asyncHandler = require("../middlewares/async");

//  @desc       return raw data
//  @route      get /
//  @access     Public
exports.fetchPage = asyncHandler(async (req, res, next) => {
  const htmlFormat = req.body.rawChessData;
  const DBObject = req.body.DBObject;
  await res.status(200).json({
    success: true,
    data: {
      htmlFormat,
      betterFormat: DBObject,
    },
  });
});

//  @desc       return a perticuler move
//  @route      get /:id
//  @access     Public
exports.fetchMoveWithId = asyncHandler(async (req, res, next) => {
  const result = req.body.DBObject[req.params.id];
  res.status(200).json({
    success: true,
    data: result.movesString,
  });
});

//  @desc       return a next move
//  @route      get /:id/*
//  @access     Public
exports.fetchNextMove = asyncHandler(async (req, res, next) => {
  let moveString = req.body.DBObject[req.params.id].movesArr.join("/");
  const moveParam =
    req.params[0][req.params[0].length - 1] == "/"
      ? req.params[0]
      : req.params[0] + "/";
  let result = "";
  if (moveString.includes(moveParam)) {
    moveString = moveString.replace(moveParam, "").trim("/");
    result = moveString.split("/")[0];
  }
  res.status(200).json({
    success: true,
    data: result ? result : null,
  });
});
