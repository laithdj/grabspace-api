    const multer = require('multer');
    const fs = require('fs');
    const config = require('./config');

    const fileTypes = {
        vendorProfile: 'VEND_PROFILE',
        ServiceImage: 'SERVICE_IMG',

    }

    const baseLocation = config.storage.baseUrl;

    const getFilePath = (type, req) => {
        switch (type) {
            case fileTypes.vendorProfile:
                return `/filestore/${req.query.id}`;

            case fileTypes.ServiceImage:
                return `/filestore/${req.query.id}`;
            default:
                return `/filestore/temp`;
        }
    }

    const getFileName = (type, req, file) => {

        const originalname = file.originalname;
        const ext = originalname.split('.').pop();
        const name = originalname.split('.').slice(0, -1).join('.');

        let fileName;
        switch (type) {
            case fileTypes.vendorProfile:
                fileName = `${fileTypes.vendorProfile}.${ext}`;
                break;

            case fileTypes.ServiceImage:
                fileName = `${fileTypes.ServiceImage}.${ext}`;
                break;


            default:
                fileName = `temp-${name}.${ext}`;
        }

        req.body.newFileName = fileName;
        req.body.originalname = originalname;
        return fileName;
    }


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const { type } = req.params;

            const filePath = getFilePath(type, req);

            req.body.filePath = filePath;

            let completePath = baseLocation + filePath;

            // create new path/dir if not exists
            if(fs.existsSync(completePath)){
                return cb(null, completePath);
            }
            else{
                fs.mkdir(completePath, { recursive: true }, err => {
                    if (err) {
                        console.log(err);
                    }
                    cb(err, completePath);
                });
            }
        },
        filename: function (req, file, cb) {
            const { type } = req.params;
            const fileName = getFileName(type, req, file)
            cb(null, fileName);
        }
    })

    const upload = multer({ storage: storage });

    const uploadSingleFile = () => upload.single('file');

    module.exports = {
        fileTypes,
        uploadSingleFile
    }

