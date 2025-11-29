import { imagekit } from "./providers/imagekit.csp.provider.js"




const UploadFile =  (data) => {
    return imagekit.upload(data)
}

export {UploadFile}