const { auth } = require("../../../config/auth");
const AccessToken = require("../models/AccessToken");
const AuthClient = require("../models/AuthClient");
const jwt = require("jsonwebtoken");
exports.verifyToken = async (req, res, next) => {
  /**
   * 1- User will send the token in authorization header
   * 2- We will retreive the token and:
   *    - Split it with .
   *    - Get the second index (signature)
   *    - perform a query on AccessToken table and make a where query with the value from previous
   *    - if located get the access_token row
   * 3- perform a query on AuthClients table with the client_id
   * 4- Get the secret from the auth_client result
   * 5- Verify the received token sent by the user
   * 6- if passed,next() else return 401 status code as JSON.
   */
  const token = req.headers.authorization;
  if (token) {
    if (token.startsWith("Bearer")) {
      //   const signature = token.split(" ")[1].split(".")[2];
      const siplitedToken = token.split(" ")[1];
      const signature = siplitedToken.split(".")[2];
      // console.log(signature);
      const accessToken = await AccessToken.findOne({
        where: { signature: signature },
      });
      if (accessToken) {
        try {
          const client = await AuthClient.findByPk(accessToken.client_id);
          const payload = jwt.verify(siplitedToken, client.secret);
          if (payload.id === accessToken.user_id) {
            // console.log(payload);
            if (!accessToken.revoked) {
              //if not revoked
              if (accessToken.expires_at >= Date.now()) {
                //ممكن نجمع الافات في اف وحدة
                // the expiration date of the accesstoken has not come yet
                const model = auth.providers[client.provider].model;
                const user = await model.findByPk(accessToken.user_id);
                // console.log(user);
                req.user = user;
                user.token = accessToken; // add the token internaly but not showed up because the token do not added to the datavalues // edited ==>  user.token = token 
                user.dataValues.token = token ; //to show up when sending , because the attriputes in the datavalues that shown 
                // req.token = accessToken;
              }
              return next(); //Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client because   send a response (like res.send()) more than once in the same request so we put return to end the execution
            }
          }
        } catch (error) {}
      }
    }
  }
  res.status(401).send({ status: false, message: "Unauthenticated" });
};
