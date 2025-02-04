import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if(extname && mimetype) {
        cb(null, true);
    }else{
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {fileSize: 2*1024*1024 }, 
    fileFilter: fileFilter,
});

export const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: "Image size must be less than 2MB!" });
        }
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

export default upload;