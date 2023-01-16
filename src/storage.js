const {uploadBytes, ref, getDownloadURL } = require("firebase/storage");
const {app, storage} = require ("../setup")

/*
    * Uploads binary image data to storage bucket in path ./userID/recipeName
    * Returns a promise containing the download url for the image
*/
function storageUploadImage (image, refUrl)
{
    return new Promise ((resolve, reject) => 
    {
        if (image == null) return null; 
        const bucketRef = ref(storage, refUrl);
        uploadBytes(bucketRef, image.buffer)
        .then(() => {
            getDownloadURL(bucketRef)
            .then((url) => {
                console.log(url);
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