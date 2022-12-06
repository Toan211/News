const ArticleModel 	= require(__path_models + 'articles');

module.exports = async(req, res, next) => {
    
    await ArticleModel
        .listItemsFrontend(null, {task: 'items-special'} )
        .then( (items) => { res.locals.itemsSpecial = items; });
    next();
}