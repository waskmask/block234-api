/**
 * @swagger
 * /add/artist-category:
 *   post:
 *     tags:
 *       - Artist Category
 *     name: Add Artist Category
 *     summary: Add Artist Category
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
 *               type: file
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category added successfully
 */

/**
 * @swagger
 * /update/artist-category:
 *   post:
 *     tags:
 *       - Artist Category
 *     name: Update Artist Category
 *     summary: Update Artist Category
 *     consumes:
 *       - application/json
 *     parameters:
 *             - name : id
 *               in: formData
 *               type: string
 *               required: true
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
 *               type: file
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category updated successfully
 */

  /**
 * @swagger
 * /artist-category/{id}:
 *   get:
 *     tags:
 *       - Artist Category
 *     name: Get Artist Category Details
 *     summary: Get Artist Category
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: integer
 *            required: true
 *            description: Artist category id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/artist-category/{id}:
 *   post:
 *     tags:
 *       - Artist Category
 *     name: Remove Artist Category
 *     summary: Remove Artist Category
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: integer
 *            required: true
 *            description: Artist category id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Remove Artist Category
 */
 /**
  
 * @swagger
 * /all/artist-category:
 *   get:
 *     tags:
 *       - Artist Category
 *     name: Get all Artist Category List
 *     summary: Get all Artist Category List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category List
 */