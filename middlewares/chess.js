const asyncHandler = require("../middlewares/async");

const axios = require("axios");
const cheerio = require("cheerio");

const Cache = require("ttl-cache");

const ttlCache = new Cache({
  ttl: 180, // Number of seconds to keep entries
});

exports.fetchPageMiddleware = asyncHandler(async (req, res, next) => {
  let DBObject = {};
  let htmlData = "";
  if (ttlCache.get("DBObject") && ttlCache.get("htmlData")) {
    DBObject = ttlCache.get("DBObject");
    htmlData = ttlCache.get("htmlData");
    console.log("exists in ttl");
  } else {
    console.log("doesn't exists in ttl");
    htmlData = await axios.get(process.env.ECO_URL);
    const $ = cheerio.load(htmlData.data);
    $("tr").each((idx, element) => {
      const tableRow = $(element).text();
      const moveNameAndId = tableRow.split("\n")[0];
      const id = moveNameAndId.slice(0, 3);
      const movesString = tableRow.split("\n")[1];
      const movesArr = movesString.split(" ").filter((m)=>{
          if(isNaN(m)){
              return m;
          }
      });

      DBObject[id] = {
        moveName: moveNameAndId.slice(3),
        movesString: movesString,
        movesArr: movesArr,
      };
    });

    ttlCache.set("DBObject", DBObject);
    ttlCache.set("htmlData", htmlData);
  }

  //adding to body
  req.body.DBObject = DBObject;
  req.body.rawChessData = htmlData.data;
  next();
});
