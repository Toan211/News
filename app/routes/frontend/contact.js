var express = require('express');
var router = express.Router();
const ContactModel 		= require(__path_models + 'contact');
const NotifyHelpers		= require(__path_helpers + 'notify');
const systemConfig  	= require(__path_configs + 'system');
const linkIndex		 	=  `/contact/`;


const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/contact/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET contact page. */
router.get('/', async (req, res, next) => {
	
	let params 		 	 = ParamsHelpers.createParam(req);

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: false,
		random_bar: true,
		params,
		titleHeader: "Contact - BlackHOSTVN " ,
	});
});

router.post('/save',   async(req, res, next) => {

  
	req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
	  ContactModel.saveItem(item, {task: 'add'}).then((result) => {
			NotifyHelpers.show(req, res, linkIndex, {task: 'add-contact'});
	  });
  });
  

module.exports = router;
