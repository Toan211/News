const ArticleModel 	= require(__path_models + 'articles');

module.exports = async(req, res, next) => {
    let itemsAr = [];

    await ArticleModel
        .listItemsFrontend(null, {task: 'items-article-in-category'} )
        .then( (items) => { res.locals.itemsArticleInCategory = items; });
        //console.log(res.locals.itemsArticleInCategory[0].group.id);
    next();
}