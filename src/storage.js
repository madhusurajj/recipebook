const {uploadBytes, ref, getDownloadURL } = require("firebase/storage");
const {app, storage} = require ("./setup")

/*
    * Uploads binary image data to storage bucket in path ./userID/recipeName
    * Returns a promise containing the download url for the image
*/
function storageUploadImage (image, refUrl)
{
    return new Promise ((resolve, reject) => 
    {
        //if no image uploaded -> send null url
        if (image == null) 
        {
            resolve(null);
            return; 
        }
        const bucketRef = ref(storage, refUrl);
        uploadBytes(bucketRef, image.buffer)
        .then(() => {
            getDownloadURL(bucketRef)
            .then((url) => {
                resolve(url);
            });
        })
        .catch((error) => {
            reject(error);
            return;
        }); 
    });
}

module.exports = {storageUploadImage};