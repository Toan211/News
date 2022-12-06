const nodemailer = require('nodemailer');

const settingConfig  		= require(__path_configs + 'setting');


let sendEmail = (email, invoiceCode, message = 'Thank you for your purchase') => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		user: settingConfig.email,
		pass: settingConfig.password_email
		}
	});
	var mailOptions = {
		from: settingConfig.email,
		to: email,
		subject: message,
		text: 'Your invoice code is #' + invoiceCode
	};

	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
	});
}

module.exports = {
	sendEmail
}