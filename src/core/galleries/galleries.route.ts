import express from "express";
import galleriesController from "./galleries.controller";
import { uploadDynamic } from "../../shared/middlewares/uploadMiddleware";
import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

// add photo
router.post(
	"/add/:folder_name",
	authenticateJWT,
	uploadDynamic.single("image"),
	galleriesController.addPhoto
	/**
	 * #swagger
	 * #swagger.tags = ['Galleries']
	 * #swagger.path = '/api/v1/galleries/add'
	 * #swagger.description = ''
	 * #swagger.summary = ''
	 * #swagger.method = 'post'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Galleries' } }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.responses[200] = { description: 'Authenticated' }
	 * #swagger.responses[401] = { description: 'Unauthorized' }
	 */
);

// get all photos
router.get(
	"/all",
	galleriesController.getPhotos
	/**
	 * #swagger
	 * #swagger.tags = ['Galleries']
	 * #swagger.path = '/api/v1/galleries/all'
	 * #swagger.description = ''
	 * #swagger.summary = ''
	 * #swagger.method = 'get'
	 */
);

// get photo by id
router.get(
	"/:pic_id",
	galleriesController.getPhotoById
	/**
	 * #swagger
	 * #swagger.tags = ['Galleries']
	 * #swagger.path = '/api/v1/galleries/{:pic_id}'
	 * #swagger.parameters[':pic_id'] = { in: 'path', description: 'ID photo.', required: true, type: 'string' }
	 * #swagger.description = ''
	 * #swagger.summary = ''
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// edit photo by id
router.put(
	"/edit/:pic_id",
	authenticateJWT,
	galleriesController.editPhoto
	/**
	 * #swagger
	 * #swagger.tags = ['Galleries']
	 * #swagger.path = '/api/v1/galleries/edit/{:pic_id}'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/GalleriesReplace' } }
	 * #swagger.parameters[':pic_id'] = { in: 'path', description: 'ID photo.', required: true, type: 'string' }
	 * #swagger.description = ''
	 * #swagger.summary = ''
	 * #swagger.method = 'put'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.responses[200] = { description: 'Authenticated' }
	 * #swagger.responses[401] = { description: 'Unauthorized' }
	 */
);

// delete photo
router.delete(
	"/delete/:pic_id",
	authenticateJWT,
	galleriesController.deletePhoto
	/**
	 * #swagger
	 * #swagger.tags = ['Galleries']
	 * #swagger.path = '/api/v1/galleries/delete/{:pic_id}'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/GalleriesUpdate' } }
	 * #swagger.parameters[':pic_id'] = { in: 'path', description: 'ID photo.', required: true, type: 'string' }
	 * #swagger.description = ''
	 * #swagger.summary = ''
	 * #swagger.method = 'delete'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.responses[200] = { description: 'Authenticated' }
	 * #swagger.responses[401] = { description: 'Unauthorized' }
	 */
);

export default router;
