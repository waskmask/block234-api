/**
 * @swagger
 * /add/badge:
 *   post:
 *     tags:
 *       - Badge
 *     name: Add Badge
 *     summary: Add Badge
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
 *         description: Badge added successfully
 */

/**
 * @swagger
 * /update/badge:
 *   put:
 *     tags:
 *       - Badge
 *     name: Update Badge
 *     summary: Update Badge
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
 *         description: Badge updated successfully
 */

  /**
 * @swagger
 * /badge:
 *   get:
 *     tags:
 *       - Badge
 *     name: Get Badge Details
 *     summary: Get Badge
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
 *         description: Badge Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/badge:
 *   post:
 *     tags:
 *       - Badge
 *     name: Remove Badge
 *     summary: Remove Badge
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
 *         description: Remove Badge Category
 */
 /**
  
 * @swagger
 * /all/badge:
 *   get:
 *     tags:
 *       - Badge
 *     name: Get all Badge List
 *     summary: Get all Badge List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Badge List
 */