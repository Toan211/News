const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 80  },
    ordering: { min: 0, max: 100 },
    status: { value: 'allvalue' },
    link: { min: 0, max: 1000 },
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

            req.checkBody('link', util.format(notify.ERROR_SLUG, options.link.min, options.link.max) )
            .isLength({ min: options.link.min, max: options.link.max });
            
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];

        return errors;
    }
}