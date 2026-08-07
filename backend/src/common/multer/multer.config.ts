import { memoryStorage } from 'multer';

export const multerOptions = () => ({
  storage: memoryStorage(),

  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
      return callback(new Error('Only image files are allowed'), false);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});