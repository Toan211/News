var express = require('express');
var router = express.Router();

const ArticleModel = require(__path_models + 'articles');
const ParamsHelpers = require(__path_helpers + 'params');

const AdvertisementModel 	= require(__path_models + 'advertisements');
const AdLocationModel 	= require(__path_models + 'adLocations');

const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next)=> {	

	
	let itemsNews 	 	= [];
	let params 		 	 = ParamsHelpers.createParam(req);
	let adver = '';

	// Latest News
	await ArticleModel.listItemsFrontend(null, {task: 'items-news'} ).then( (items) => { itemsNews = items; });

	


	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		silde_bar: true,
		random_bar: true,
		params,
		itemsNews,
		titleHeader: "Home-BlackHOSTVN",
	});
});




module.exports = router;