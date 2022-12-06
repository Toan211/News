var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ArticleModel 	= require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'categories');

const folderView	 = __path_views_blog + 'pages/article/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
// router.get('/:id', async (req, res, next) => {
// 	let idArticle 		= ParamsHelpers.getParam(req.params, 'id', '');
// 	let itemArticle		= {};
// 	let itemsOthers		= [];
// 	let params 		 	 = ParamsHelpers.createParam(req);

// 	// Article Info
// 	await ArticleModel.getItemFrontend(idArticle, null ).then( (item) => { itemArticle = item; });

// 	// Article In Category
// 	await ArticleModel.listItemsFrontend(itemArticle, {task: 'items-others'} ).then( (items) => { itemsOthers = items; });
	
// 	res.render(`${folderView}index`, {
// 		layout: layoutBlog,
// 		top_post: false,
// 		silde_bar: true,
// 		itemsOthers,
// 		itemArticle,
// 		params
// 	});
// });

/* GET home page. */
router.get('/:slug', async (req, res, next) => {
	let slugArticle 		= ParamsHelpers.getParam(req.params, 'slug', '');
	let itemArticle		= {};
	let itemsOthers		= [];
	let params 		 	 = ParamsHelpers.createParam(req);

	
	// Article Info
	await ArticleModel.getSlugArticle(slugArticle, null ).then( (item) => { itemArticle = item[0]; });
	
	// Get Category
	await CategoryModel.getItems({id: itemArticle.group.id}, {task: 'get-items-by-id'}).then( (items) => {itemMainCategory = items;});

	// Article In Category
	await ArticleModel.listItemsFrontend(itemArticle, {task: 'items-others'} ).then( (items) => { itemsOthers = items; });
	

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		random_bar: true,
		itemsOthers,
		itemArticle,
		itemMainCategory,
		params,
		titleHeader: itemArticle.name + " - BlackHOSTVN " ,
	});
});

module.exports = router;
