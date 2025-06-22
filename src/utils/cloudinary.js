import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
  try {
    if(!localFilePath) return null
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
    })
    //file uploaded
    console.log("file uploaded on cloudinary,",response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) //remove local file on server if upload fail
    return null;
  }
}

export {uploadOnCloudinary}