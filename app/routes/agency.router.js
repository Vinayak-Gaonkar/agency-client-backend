const AgencyController = require("../controllers/agency.controller");

/**
 * @swagger
 * tags:
 *   name: Agency
 *   description: All about /Agency
 */


exports.routesConfig = function (app) {
   /**
  * @swagger
  * /api/agency:
  *   post:
  *     tags:
  *       - Agency and Client
  *     description: Add Agency and its clients
  *     parameters:
  *       - name: body
  *         description: parameters
  *         in: body
  *         schema:
  *            $ref: '#/definitions/addAgency'
  *     security:
  *       - JWT: []
  *     responses:
  *       201:
  *         description: created
  *         schema:
  *           type: object
  *           example: {"status": "success"}
  *       400:
  *         description: no created
  *         schema:
  *           type: object
  *           example: {"reason": "ValidationError: agencyId: Path agencyId is required."}
  */
   app.post("/agency", AgencyController.createAgency);
   /**
  * @swagger
  * /api/client/{agencyId}/{clientId}:
  *   put:
  *     tags:
  *       - Agency and Client
  *     description: update client
  *     parameters:
  *       - name: agencyId
  *         in: path
  *         schema:
  *           type: integer
  *       - name: clientId
  *         in: path
  *         schema:
  *           type: integer
  *       - name: body
  *         description: parameters
  *         in: body
  *         schema:
  *            $ref: '#/definitions/updateClient'
  *     security:
  *       - JWT: []
  *     responses:
  *       200:
  *         description: updated
  *         schema:
  *           type: object
  *           example: {"status": "success"}
  *       400:
  *         description: not updated
  *         schema:
  *           type: object
  *           example: {"reason": "Unable to update qwer"}
  */
   app.put("/client/:agencyId/:id", AgencyController.updateClient);

   /**
     * @swagger
     * /api/agency:
     *   get:
     *     tags:
     *       - Agency and Client
     *     description: update client
     *     responses:
     *       200:
     *         description: updated
     *         schema:
     *           type: object
     *           example: {"status": "success"}
     *       400:
     *         description: not updated
     *         schema:
     *           type: object
     *           example: {"reason": "Unable to update qwer"}
     */
   app.get("/agency", AgencyController.getAgency);


   return app
}

/**
* @swagger
* definition:
*   addAgency:
*     properties:
*       agencyId:
*         type: string
*         example: 091d855801
*       agencyName:
*         type: string
*         example: newAgency
*       address1:
*         type: string
*         example: BSK 3rd stage, Bengaluru
*       address2:
*         type: string
*         example: Lorem Ipsum
*       state:
*         type: string
*         example: "Karnataka"
*       city:
*         type: string
*         example: Bengaluru
*       phoneNumber:
*         type: string
*         example: 8765432189
*       clients:
*         type: array
*           type:object
*
*         example: [{
            "clientId":"2012345",
            "clientName":"Vinak-client",
            "email":"gaonkar@gmail.com",
            "phoneNumber":"8466473829",
            "totalBill":10229
        }]
*/


/**
* @swagger
* definition:
*   updateClient:
*     properties:
*       clientName:
*         type: string
*         example: 091d855801
*       email:
*         type: string
*         example: newAgency
*       phoneNumber:
*         type: string
*         example: BSK 3rd stage, Bengaluru
*       totalBill:
*         type: number
*         example: Lorem Ipsum
*/