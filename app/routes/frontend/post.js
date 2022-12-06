var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/post/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderView}index`, { 
    top_post: false,
    silde_bar: true,
    layout: layoutBlog,
  });

});

module.exports = router;
