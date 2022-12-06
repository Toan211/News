var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ArticleModel 	= require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'categories');

const folderView	 = __path_views_blog + 'pages/category/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
// router.get('/:id', async (req, res, next) => {
// 	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
// 	let params 		 	 = ParamsHelpers.createParam(req);

// 	let itemsInCategory	= [];
// 	let itemsInArticle	= [];
// 	console.log(idCategory);
// 	// Article In Category
// 	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

// 	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

// 	res.render(`${folderView}index`, {
// 		layout: layoutBlog,
// 		top_post: false,
// 		silde_bar: true,
// 		itemsInCategory,
// 		itemsInArticle,
// 		params
// 	});
// });

router.get('/(:slug)?', async (req, res, next) => {
	let slugCategory 		= ParamsHelpers.getParam(req.params, 'slug', '');
	let params 		 	 = ParamsHelpers.createParam(req);
	let idCategory;
	let itemsInCategory	= [];
	let itemsInArticle	= [];
	//console.log(slugCategory);
	// find id of category
    await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id});
	// Article In Category
	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		random_bar: false,
		itemsInCategory,
		itemsInArticle,
		params,
		titleHeader: itemsInCategory[0].group.name + " - BlackHOSTVN" ,
		
		
	});
});

router.get('/:id/json', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
	//console.log(idCategory);
	let itemsArticleJs	= [];
	// Article In Category
	
	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-news-category'} ).then( (items) => { itemsArticleJs = items; });

	res.json(itemsArticleJs);
});

// router.get('/items/json', async (req, res, next) => {
// 	let itemsCategory   = [];
	
// 	//category
// 	await CategoryModel.listItemsFrontend(null,{task: 'items-in-menu'} ).then( (items) => { itemsCategory = items; });
// 	console.log(itemsCategory);
// 	res.json(itemsCategory);
//   });
  
  

module.exports = router;