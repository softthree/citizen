const UserModel = require('../models/user');
const FeatureModel = require('../models/feature');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');

const featureActions = {
    addFeature: asyncMiddleware(async (req, res) => {
        let feature = await FeatureModel.findOne({ name: req.body.name });
        if (feature) {
            res.status(status.success.accepted).json({
                message: 'Feature Already Exists',
                status: 'failure'
            });
        } else {
            // Save new feature to db
            let newFeature = new FeatureModel({ ...req.body });
            let savedFeature = await newFeature.save();

            res.status(status.success.created).json({
                message: 'Feature Created Successfully',
                status: 'success',
                data: savedFeature,
            });
        }
    }),
    getFeatureInfo: asyncMiddleware(async (req, res) => {
        let feature = await FeatureModel.findOne({ plainName: req.params.name });
        if (feature) {
            res.status(status.success.accepted).json({
                message: 'Details Of Feature',
                status: 'success',
                data: feature
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Feature Not Found',
                status: 'failure'
            });
        }
    }),

    getFeatureList: asyncMiddleware(async (req, res) => {
        let features = await FeatureModel.find();
        if (features) {
            res.status(status.success.accepted).json({
                message: 'List Of Features',
                status: 'success',
                data: features
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Features Not Found',
                status: 'failure'
            });
        }
    }),

    updateFeature: asyncMiddleware(async (req, res) => {
        let feature = await FeatureModel.findOneAndUpdate({ plainName: req.params.name }, req.body, { new: true });
        if (feature) {
            res.status(status.success.accepted).json({
                message: 'Feature Updated',
                status: 'success',
                data: feature
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Feature Not Upadted',
                status: 'failure'
            });
        }
    }),
    recaptchaImages: asyncMiddleware(async (req, res) => {
        let features = await FeatureModel.find();
        if (features) {
            let images = [];
            let indexFeature = features.findIndex(x => x.plainName == req.params.name);
            let random = Math.floor(Math.random() * Math.floor(4));
            random = random == 0 ? 2 : random
            for (let i = 0; i < random; i++) {
                let randomIndex = Math.floor(Math.random() * Math.floor(features[indexFeature].images.length));
                let image = {
                    _id: features[indexFeature]._id,
                    imageUrl: features[indexFeature].images[randomIndex],
                    name: features[indexFeature].plainName
                }
                images.push(image)
            }
            features.splice(indexFeature, 1);
            let indexex = 0;
            while (indexex < features.length) {
                let random = Math.floor(Math.random() * Math.floor(3));
                random = random == 0 ? 1 : random
                for (let i = 0; i < random; i++) {
                    let randomIndex = Math.floor(Math.random() * Math.floor(features[indexex].images.length));
                    let image = {
                        _id: features[indexex]._id,
                        imageUrl: features[indexex].images[randomIndex],
                        name: features[indexex].plainName
                    }
                    images.push(image)
                }
                indexex++;
            }

            if (images.length < 9) {
                for (let i = images.length; i < 10; i++) {
                    let random = Math.floor(Math.random() * Math.floor(features.length));
                    random = random == 0 ? 1 : random
                    let randomIndex = Math.floor(Math.random() * Math.floor(features[random].images.length));
                    let image = {
                        _id: features[random]._id,
                        imageUrl: features[random].images[randomIndex],
                        name: features[random].plainName
                    }
                    images.push(image)
                }
            }
            if (images.length > 9) {
                images.splice(9)
            }

            res.status(status.success.accepted).json({
                message: 'Feature Updated',
                status: 'success',
                data: images
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Feature Not Upadted',
                status: 'failure'
            });
        }
    }),
    boundingImages: asyncMiddleware(async (req, res) => {
        let feature = await FeatureModel.findOne({plainName: req.params.name})
        if(feature) {
            res.status(status.success.accepted).json({
                message: 'Bounding Images',
                status: 'success',
                data: feature
            });
        }
    })
}

module.exports = featureActions;
