require('firebase-admin/app');
const admin = require("firebase-admin");
const serviceAccount = require("./admin-private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {admin};