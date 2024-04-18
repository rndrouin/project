// Middleware function to check API key
function checkAPIKey(req, res, next) {
    const apiKey = process.env.API_KEY;
    const requestAPIKey = req.headers['x-api-key'];
  
    //attempted to troubleshoot
    //console.log("apiKey:", apiKey);
    //console.log("requestAPIKey:", requestAPIKey);
  
    if (!requestAPIKey) {
      res.status(401).send('API Key is missing');
    } else if (requestAPIKey !== apiKey) {
      res.status(403).send('API Key is invalid');
    } else {
      next();
    }
  }

  module.exports = checkAPIKey;