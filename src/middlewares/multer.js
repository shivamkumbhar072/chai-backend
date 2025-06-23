import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Get file extension
    let extension = path.extname(file.originalname);

    // Fallback if extension is missing
    if (!extension && file.mimetype) {
      const mimeToExt = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
      };
      extension = mimeToExt[file.mimetype] || '';
    }

    extension = extension.toLowerCase();

    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

export const upload = multer({ storage });
