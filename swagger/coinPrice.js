/**
 * @swagger
 * /add/coinPrice:
 *   post:
 *     tags:
 *       - Coin Price
 *     name: Add Coin Price
 *     summary: Add Coin Price
 *     consumes:
 *       - application/json
 *     parameters:
 *             - name : name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : status
 *               in: formData
 *               type: string
 *               required: true
 *             - name : icon_img
 *               in: formData
 *               type: string
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Coin Price added successfully
 */

/**
 * @swagger
 * /update/coinPrice:
 *   put:
 *     tags:
 *       - Coin Price
 *     name: Update Coin Price
 *     summary: Update Coin Price
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             name:
 *               type: string
 *             status:
 *               type: number
 *         required:
 *           - id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Coin Price updated successfully
 */

  /**
 * @swagger
 * /coinPrice:
 *   get:
 *     tags:
 *       - Coin Price
 *     name: Get Coin Price Details
 *     summary: Get Coin Price
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *            type: integer 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Coin Price Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/coinPrice:
 *   post:
 *     tags:
 *       - Coin Price
 *     name: Coin Price Category
 *     summary: Coin Price Category
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *            type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Coin Price Category
 */
 /**
  
 * @swagger
 * /all/coinPrice:
 *   get:
 *     tags:
 *       - Coin Price
 *     name: Get all Coin Price List
 *     summary: Get all Coin Price List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Coin Price List
 */