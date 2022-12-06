const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 30 },
    email: { min: 5, max: 100 },
    status: { value: 'allValue' },
    phone: {  min: 5, max: 20 },
    subject: { min: 1, max: 50 },
    message: { min: 1, max: 50000 },
}

module.exports = {
    validator: (req) => {
        // NAME
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })
        
        // Email
        req.checkBody('email', util.format(notify.ERROR_NAME, options.email.min, options.email.max) )
        .isLength({ min: options.email.min, max: options.email.max })
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
        
        // Phone
        req.checkBody('phone', util.format(notify.ERROR_NAME, options.phone.min, options.phone.max) )
        .isLength({ min: options.phone.min, max: options.phone.max })

        req.checkBody('subject', util.format(notify.ERROR_NAME, options.subject.min, options.subject.max) )
        .isLength({ min: options.subject.min, max: options.subject.max })

        // Message
        req.checkBody('message', util.format(notify.ERROR_NAME, options.message.min, options.message.max) )
            .isLength({ min: options.message.min, max: options.message.max });
    

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
}