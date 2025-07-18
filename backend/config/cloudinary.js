import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dyfqfpgec',
  api_key: '972768314819877',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary; 