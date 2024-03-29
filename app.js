var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')

const validator = require('express-validator');
const session = require('express-session');
var flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var moment = require('moment');
const fs = require('fs');
var Parser = require('rss-parser');
const nodemailer = require('nodemailer');

const pathConfig = require('./path');

// Define Path
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';

global.__path_configs   = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers   = __path_app + pathConfig.folder_helpers + '/';
global.__path_routers   = __path_app + pathConfig.folder_routers + '/';
global.__path_schemas   = __path_app + pathConfig.folder_schemas + '/';
global.__path_models    = __path_app + pathConfig.folder_models + '/';
global.__path_validates = __path_app + pathConfig.folder_validates + '/';
global.__path_views     = __path_app + pathConfig.folder_views + '/';

global.__path_views_admin = __path_views + pathConfig.folder_module_admin + '/';
global.__path_views_blog  = __path_views + pathConfig.folder_module_blog + '/';
//global.__path_views_sales  = __path_views + pathConfig.folder_module_sales + '/';

global.__path_public    = __base + pathConfig.folder_public + '/';
global.__path_uploads     = __path_public + pathConfig.folder_uploads + '/';
global.__path_middleware= __path_app + pathConfig.folder_middleware + '/';


const systemConfig = require(__path_configs + 'system');
const settingConfig = require(__path_configs + 'setting');
const databaseConfig = require(__path_configs + 'database');

// mongoose.connect(`mongodb+srv://admin:FC9sz7viteURvwgy@cluster0.wrsms.mongodb.net/training_nodejs?retryWrites=false&w=majority`);

// mongoose.connect(`mongodb://${databaseConfig.username}:${databaseConfig.password}@ds117590.mlab.com:17590/${databaseConfig.database}`);

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.3qeuo.mongodb.net/${databaseConfig.database}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.set('useFindAndModify', false);

var app = express();
app.use(cookieParser());
app.use(session({
  secret: 'abcnhds',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30*60*1000
  }
}
));

require(__path_configs + 'passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

app.use(validator({
  customValidators: {
    isNotEqual: (value1, value2) => {
      return value1!==value2;
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
// app.set('layout', __path_views + 'backend');
app.set('layout', __path_views_admin + 'admin');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Local variable
app.locals.systemConfig = systemConfig;
app.locals.settingConfig = settingConfig;
app.locals.moment = moment;
app.locals.fs = fs;

// Setup router
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routers + 'backend/index'));
app.use(`/${systemConfig.prefixBlog}`, require(__path_routers + 'frontend/index'));
//app.use(`/${systemConfig.prefixSales}`, require(__path_routers + 'frontend-sales/index'));

// -------ERROR PAGE------------

const ParamsHelpers = require(__path_helpers + 'params');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  let params 		 	 = ParamsHelpers.createParam(req);
  if(systemConfig.env == "dev") {
    res.status(err.status || 500);
    res.render(__path_views_admin +  'pages/error', { 
      pageTitle   : 'Page Not Found ',
      
       });
  }

  // render the error page
  if(systemConfig.env == "production") {
    res.status(err.status || 500);
    res.render(__path_views_blog +  'pages/error', {
      layout: __path_views_blog + 'frontend',
      top_post: false,
      silde_bar: false,
      params,
      titleHeader: "Không thấy trang",
      
    });
  }
});


module.exports = app;

