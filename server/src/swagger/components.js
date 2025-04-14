/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address
 *         googleId:
 *           type: string
 *           description: Google ID for OAuth
 *         profilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         role:
 *           type: string
 *           enum: [customer, admin, rider]
 *           description: User's role in the system
 *         isApproved:
 *           type: boolean
 *           description: Whether the user is approved to use the system
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         phone:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - category
 *         - brand
 *         - images
 *         - variants
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         category:
 *           type: string
 *           enum: [fan, air-conditioner]
 *           description: Product category
 *         brand:
 *           type: string
 *           description: Product brand
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               color:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sku:
 *                 type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         specifications:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         numReviews:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - orderItems
 *         - shippingAddress
 *         - contactInfo
 *         - paymentMethod
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order
 *         user:
 *           type: string
 *           description: Reference to the user who placed the order
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               product:
 *                 type: string
 *               variant:
 *                 type: string
 *               name:
 *                 type: string
 *               color:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *         shippingAddress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         contactInfo:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *         paymentMethod:
 *           type: string
 *         paymentResult:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             status:
 *               type: string
 *             update_time:
 *               type: string
 *             email_address:
 *               type: string
 *         itemsPrice:
 *           type: number
 *         taxPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered, undelivered, cancelled]
 *         assignedRider:
 *           type: string
 *           description: Reference to the rider assigned to deliver the order
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         trackingNumber:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     ApprovedEmail:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id
 *         email:
 *           type: string
 *           description: Approved email address
 *         role:
 *           type: string
 *           enum: [customer, admin, rider]
 *           description: Role for this approved email
 *         isActive:
 *           type: boolean
 *         addedBy:
 *           type: string
 *           description: Reference to the admin who added this email
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     ForbiddenError:
 *       description: User does not have permission to access this resource
 *     NotFoundError:
 *       description: The requested resource was not found
 *     BadRequestError:
 *       description: The request contains invalid parameters
 */