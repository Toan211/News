const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 80  },
    ordering: { min: 0, max: 100 },
    status: { value: 'allvalue' },
    special: { value: 'allvalue' },
    content: { min: 5, max: 100000000000 },
    group: { value: 'allvalue' },
    slug: { min: 5, max: 80 },
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

            req.checkBody('slug', util.format(notify.ERROR_SLUG, options.slug.min, options.slug.max) )
            .isLength({ min: options.slug.min, max: options.slug.max });
            
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // SPECIAL
        req.checkBody('special', notify.ERROR_SPECIAL)
            .isNotEqual(options.special.value);

            // CONTENT
        req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
            .isLength({ min: options.content.min, max: options.content.max });

             // GROUP
        req.checkBody('group_id', notify.ERROR_GROUP)
        .isNotEqual(options.group.value);

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];

        if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'avatar', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'avatar', msg: notify.ERROR_FILE_REQUIRE});
			}
        }

        return errors;
    }
}