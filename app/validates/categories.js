const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 50 },
    ordering: { min: 0, max: 100 },
    status: { value: 'allvalue' },
    slug: { min: 5, max: 80 },
    //content: { min: 5, max: 200 },
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
        
        // SLUG
        req.checkBody('slug', util.format(notify.ERROR_SLUG, options.slug.min, options.slug.max) )
            .isLength({ min: options.slug.min, max: options.slug.max });
            
        // CONTENT
        // req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
        //     .isLength({ min: options.content.min, max: options.content.max });

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
}