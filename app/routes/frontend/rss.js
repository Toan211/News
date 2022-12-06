var express = require('express');
var router = express.Router();

let RSSParser = require('rss-parser');
let RssParser = new RSSParser();
const UrlHelpers = require(__path_helpers + 'url-helper');
const rp = require('request-promise');

const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/rss/';
const layoutBlog    = __path_views_blog + 'frontend';

const requestOptions = {
	method: 'GET',
	uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
	qs: {
	  'start': '1',
	  'limit': '10',
	  'convert': 'USD'
	},
	headers: {
	  'X-CMC_PRO_API_KEY': 'f6595e0d-07ac-4296-b2ad-a5b250aa9190'
	},
	json: true,
	gzip: true
  };
  

/* GET about page. */
router.get('/', async (req, res, next) => {
	
	let feed	= [];
	let GoldItems= [];
	let params 		 	 = ParamsHelpers.createParam(req);

	feed = await RssParser.parseURL('https://vnexpress.net/rss/the-thao.rss');
	FeedItems = feed.items;

	//goid xml (bug)
	// let GoldXML = 'https://www.sjc.com.vn/xml/tygiavang.xml';
	// await UrlHelpers.xmlToJson(GoldXML, (err, goid) => {
	// 	if(err){
	// 		return console.err(err);
	// 	}
	// 	GoldItems = goid.root.ratelist[0].city[0].item;

		//coin api
		rp(requestOptions).then(response => {
			let CoinItems = response.data;
			let CoinUpdateTime = response.status.timestamp;
			res.render(`${folderView}index`, {
				layout: layoutBlog,
				top_post: false,
				silde_bar: false,
				FeedItems,
				CoinItems,
				CoinUpdateTime,
				GoldItems, 
				params,
				titleHeader: "Tin tức tổng hợp - BlackHOSTVN" ,
			});
		  }).catch((err) => {
			console.log('API call error:', err.message);
		  });

		});
	// });
	
// 	feed.items.forEach(item => {
// 		console.log(item.title);
// });
	//console.log(feed.items[0]);
	

module.exports = router;


