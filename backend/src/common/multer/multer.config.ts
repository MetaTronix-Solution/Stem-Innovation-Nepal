import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = (folder: string) => ({
  storage: diskStorage({
    destination: `./uploads/${folder}`,

    filename: (req, file, callback) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

      callback(null, uniqueName + extname(file.originalname));
    },
  }),

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
