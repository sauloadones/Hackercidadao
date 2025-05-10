import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config(); 

cloudinary.config({
 
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'boia/ofertas',
    resource_type: 'image',
    format: 'jpg',
    public_id: file.originalname.split('.')[0]
  })
});

export const upload = multer({ storage });
