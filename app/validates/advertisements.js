const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 80  },
    ordering: { min: 0, max: 100 },
    status: { value: 'allvalue' },
    link: { min: 0, max: 1000 },
    group: { value: 'allvalue' },
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })
        //LINK
        req.checkBody('link', util.format(notify.ERROR_SLUG, options.link.min, options.link.max) )
            .isLength({ min: options.link.min, max: options.link.max });
            
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

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