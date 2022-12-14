var express = require('express');
var router 	= express.Router();

const controllerName = 'adLocations';

const systemConfig  = require(__path_configs + 'system');
const MainModel 	= require(__path_models + controllerName);
const MainValidate	= require(__path_validates + controllerName);
const UtilsHelpers 	= require(__path_helpers + 'utils');
const NotifyHelpers = require(__path_helpers + 'notify');
const ParamsHelpers = require(__path_helpers + 'params');
const notify  		= require(__path_configs + 'notify');

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex = UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView	 = __path_views_admin + `pages/${controllerName}/`;


router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 	 = ParamsHelpers.createParam(req);
	
	let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, controllerName);
	await MainModel.countItem(params).then( (data) => { params.pagination.totalItems = data; });
	
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				controllerName,
				items,
				statusFilter,
				params,
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	
	MainModel.changeStatus(id, currentStatus, req.user,{task: "update-one"})
			.then((result) => {// NotifyHelpers.show(req, res, linkIndex, {task: 'change-status'}));
			res.json({'currentStatus': currentStatus, 'msg': notify.CHANGE_STATUS_SUCCESS, 'id': id})
		});
		});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	
	MainModel.changeStatus(req.body.cid, currentStatus,req.user, {task: "update-multi"})
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {task: 'change-multi-status', total: result.n}));
});

// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;

	MainModel.changeOrdering(cids, orderings,req.user, null)
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {total: result.n , task: 'change-ordering'}));
});


// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	MainModel.deleteItem(id, {task: 'delete-one'} ).then((result) => {
		NotifyHelpers.show(req, res, linkIndex, {task: 'delete'})
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	MainModel.deleteItem(req.body.cid, {task: 'delete-mutli'} )
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {total: result.n ,task: 'delete-multi'}));
});

// FORM
router.get(('/form(/:id)?'), (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', ordering: 0, status: 'allvalue', link: '', slug: ''};
	let errors   = null;
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, controllerName, item, errors});
	}else { // EDIT
		MainModel.getItem(id).then((item) =>{
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, controllerName, item, errors});
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	req.body 	= JSON.parse(JSON.stringify(req.body));

	let item 	= Object.assign(req.body);
	let taskCurrent	= (typeof item !== "undefined" && item.id !== "" ) ? "edit" : "add";

	let errors = MainValidate.validator(req);

	if(Array.isArray(errors) && errors.length > 0) {
		let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
		res.render(`${folderView}form`, { pageTitle, controllerName, item, errors});
	}else {
		MainModel.saveItem(item, req.user, {task: taskCurrent})
			.then((result) => NotifyHelpers.show(req, res, linkIndex, {task: taskCurrent}));
	}
});

// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

module.exports = router;