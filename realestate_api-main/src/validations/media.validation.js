const Joi = require('joi');

const uploadMedia = {
    params: Joi.object().keys({
        type: Joi.string().required(),
    }),
};
const getMedia = {
    params: Joi.object().keys({
        type: Joi.string().required(),
    }),
    query: Joi.object().keys({
        id: Joi.string().required(),
        try: Joi.string(),
    }),
};

const deleteMedia = {
    params: Joi.object().keys({
        type: Joi.string().required(),
    }),
    query: Joi.object().keys({
        id: Joi.string().required(),
    }),
};


module.exports = {
    uploadMedia,
    getMedia,
    deleteMedia
};
