import {v2 as Cloudinary} from "cloudinary"
import fs from "fs"

Cloudinary.config({
    cloud_name: 'saurav-cloudinary-service',
      api_key: '328928862669117',
      api_secret: 'e9aidcPMPNaSImFw2ENjpOHLlzU'
})

const uploadFiles=async(localFilePath)=>{
    try {
        console.log(process.env.CLOUDINARY_API_KEY)
        const response=await Cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        },)

        fs.unlinkSync(localFilePath)
        console.log(response)
        return response.url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log(error)
    }
}

export default uploadFiles