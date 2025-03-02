/**
 * @swagger
 * /add/artist-status:
 *   post:
 *     tags:
 *       - Artist Status
 *     name: Add Artist status
 *     summary: Add Artist status
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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist status added successfully
 */

/**
 * @swagger
 * /update/artist-status:
 *   put:
 *     tags:
 *       - Artist Status
 *     name: Update Artist status
 *     summary: Update Artist status
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
 *         description: Artist status updated successfully
 */

  /**
 * @swagger
 * /artist-status:
 *   get:
 *     tags:
 *       - Artist Status
 *     name: Get Artist Status Details
 *     summary: Get Artist Status
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
 *         description: Status Category Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/artist-status:
 *   post:
 *     tags:
 *       - Artist Status
 *     name: Remove Artist Status
 *     summary: Remove Artist Status
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
 *         description: Remove Status Category
 */
 /**
  
 * @swagger
 * /all/artist-status:
 *   get:
 *     tags:
 *       - Artist Status
 *     name: Get all Artist Status List
 *     summary: Get all Artist Status List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Status List
 */