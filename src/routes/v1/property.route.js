const express = require('express');
const propertyController = require('../../controllers/property.controller');
const validate = require('../../middlewares/validate');
const propertyValidation = require('../../validations/property.validation');
const auth = require('../../middlewares/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Property Types, Property Status, amenities Route
router.route('/types').get(propertyController.getPropertyTypesList);
router.route('/status').get(propertyController.getPropertyStatusList);
router.route('/amenities').get(propertyController.getAmenitiesList);
router.route('/cities').get(propertyController.getCityList);

// property route
// router.route('/').post(auth(), validate(), propertyController.createProperty);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `public/property`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(`./${dir}`, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileName}${fileExt}`);
  },
  mimetype: (req, file, cb) => {
    cb(null, `${file.mimeType}`);
  }
});
const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } })
const cpUpload = upload.fields([{ name: 'images' }, { name: 'floorPlanImages' }]);
router.route('/')
  .post(auth('manageProperty'), validate(propertyValidation.createProperty), cpUpload, propertyController.createProperty)

router.route('/update-count')
  .put(propertyController.updatePropertyCount)
router.route('/user-properties')
  .get(auth('manageProperty'), propertyController.getUserProperties)
router.route('/latest-properties')
  .get(propertyController.getLatestProperties)

router.route('/properties')
  .post(propertyController.getProperties);

router.route('/edit-view/:propertyId')
  .get(propertyController.getPropertyByIdEditView)

router.route('/:propertyId')
  .get(propertyController.getPropertyById)
  .delete(auth('manageProperty'), validate(propertyValidation.deleteProperty), propertyController.deleteProperty)
  .put(auth('manageProperty'), validate(propertyValidation.updateProperty), cpUpload, propertyController.updateProperty)
  // .put(auth('manageProperty'), validate(propertyValidation.updateProperty), cpUpload, propertyController.updateProperty)

module.exports = router;
