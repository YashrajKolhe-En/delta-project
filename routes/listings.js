const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// same "/" routes for index & create route combining
router
.route("/")
.get(wrapAsync (listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image][url]'),
    validateListing,
  wrapAsync (listingController.createListing)
);
// .post ( upload.single('listing[image][url]'), (req, res) => {
//   res.send(req.file);
// });

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// combine show & update & delete Route "/:id"
router.route("/:id")
.get(wrapAsync (listingController.showListing)
)
.put(
   isLoggedIn,
   isOwner,
   upload.single('listing[image][url]'),
   validateListing,
   wrapAsync (listingController.updateListing)
)
.delete(isLoggedIn, isOwner,  wrapAsync (listingController.destroyListing)
);

//Edit Route
 router.get("/:id/edit",
   isLoggedIn,
   isOwner,
 wrapAsync (listingController.renderEditForm)
);

module.exports = router;