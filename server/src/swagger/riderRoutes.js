/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider operations API
 */

/**
 * @swagger
 * /rider/orders:
 *   get:
 *     summary: Get rider's assigned orders
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [shipped, delivered, undelivered]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of assigned orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 * 
 * /rider/orders/{id}:
 *   get:
 *     summary: Get single order details (Rider view)
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 * 
 * /rider/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Rider can only change from SHIPPED to DELIVERED or UNDELIVERED)
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [delivered, undelivered]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request data or order not in proper status
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 * 
 * /rider/dashboard:
 *   get:
 *     summary: Get rider dashboard stats
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rider dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     counts:
 *                       type: object
 *                       properties:
 *                         totalAssigned:
 *                           type: integer
 *                         shippedOrders:
 *                           type: integer
 *                         deliveredOrders:
 *                           type: integer
 *                         undeliveredOrders:
 *                           type: integer
 *                         todayOrders:
 *                           type: integer
 *                     performance:
 *                       type: object
 *                       properties:
 *                         deliveryRate:
 *                           type: string
 *                     recentOrders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 */