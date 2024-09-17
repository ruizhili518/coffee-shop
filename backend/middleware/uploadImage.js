import multer from 'multer';
import path from 'path';
import DataURIParser from 'datauri/parser.js';

const storage = multer.memoryStorage();
const uploadImg = multer({storage: storage});

const dUri = new DataURIParser();

const dataUri = (req) =>
    dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

export { uploadImg, dataUri };