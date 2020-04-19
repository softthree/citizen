const UserModel = require('../models/user');
const SeedModel = require('../models/seed')
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');

const seedActions = {
    insertImage: asyncMiddleware(async (req, res) => {
        // Logic for seeding
        // let image = new SeedModel({ ...req.body })
        // let imageInserted = await image.save()
        // if (imageInserted) {
        //     res.status(status.success.accepted).json({
        //         message: 'Image Inserted',
        //         status: 'success'
        //     });
        // } else {
        //     res.status(status.success.accepted).json({
        //         message: 'Image insertion failed',
        //         status: 'failure'
        //     });
        // }

        // let image = await SeedModel.findByIdAndUpdate(req.body.id, { $push: { "sateliteImages": req.body.image } },
        let image = await SeedModel.findByIdAndUpdate(req.params.id, { "satelliteImages": req.body },
            { new: true }
        )
        if (image) {
            res.status(status.success.accepted).json({
                message: 'Image Inserted',
                status: 'success',
                images: image
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Image insertion failed',
                status: 'failure'
            });
        }
    }),

    deleteImage: asyncMiddleware(async (req, res) => {
        let image = await SeedModel.findByIdAndUpdate(req.params.id, { sateliteImages: req.body.images },
            { new: true }
        )
        if (image) {
            res.status(status.success.accepted).json({
                message: 'Image Deleted',
                status: 'success'
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Image deletion failed',
                status: 'failure'
            });
        }
    }),

    getSatelliteImages: asyncMiddleware(async (req, res) => {
        let images = await SeedModel.find()
        if (images) {
            res.status(status.success.accepted).json({
                message: 'All Images',
                status: 'success',
                data: images[0]
            });
        } else {
            res.status(status.success.accepted).json({
                message: 'Image fetching failed',
                status: 'failure'
            });
        }
    })
}

module.exports = seedActions;
