var express = require('express');
var router 	= express.Router();
const fs = require('fs');

const controllerName = "advertisements";
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  = require(__path_configs + 'system');
const MainModel 	= require(__path_models + controllerName);
const GroupsModel 	= require(__path_models + 'adLocations');
const MainValidate	= require(__path_validates + controllerName);
const UtilsHelpers 	= require(__path_helpers + 'utils');
const NotifyHelpers = require(__path_helpers + 'notify');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers	= require(__path_helpers + 'file');
const notify  		= require(__path_configs + 'notify');
const StringHelpers = require(__path_helpers + 'string');

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex = UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView	 = __path_views_admin + `pages/${controllerName}/`;
const uploadAvatar	 = FileHelpers.upload('avatar', 'advertisements');


// List items
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 	 = ParamsHelpers.createParam(req);

	let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, controllerName);
	await MainModel.countItem(params).then( (data) => { params.pagination.totalItems = data; });

	let groupsItems	= [];
	await GroupsModel.listItemsInSelectbox().then((items)=> {
		groupsItems = items;
		groupsItems.unshift({_id: 'allvalue', name: 'All Category'});
	});

	await MainModel.countItems(params).then( (data) => {
		params.pagination.totalItems = data;
	});

	//console.log(params);
	
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, {
				pageTitle: pageTitleIndex,
				controllerName,
				items,
				statusFilter,
				params,
				groupsItems,
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active');
	let id				= ParamsHelpers.getParam(req.params, 'id', '');

	MainModel.changeStatus(id, currentStatus,req.user, {task: "update-one"})
		.then((result) => {// NotifyHelpers.show(req, res, linkIndex, {task: 'change-status'}));
		res.json({'currentStatus': currentStatus, 'msg': notify.CHANGE_STATUS_SUCCESS, 'id': id})
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active');

	MainModel.changeStatus(req.body.cid, currentStatus, req.user,{task: "update-multi"})
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {task: 'change-multi-status', total: result.n}));
});

// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;

	MainModel.changeOrdering(cids, orderings, req.user,null)
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {total: result.n , task: 'change-ordering'}));
});

// Delete
router.get('/delete/:id', async (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
	let idCategory = '';
	
	await MainModel.getItem(id, null).then( (item) => { idCategory = item.group.id});
	await GroupsModel.updateAmountOfItem(idCategory, -1).then( (result) => { });

	MainModel.deleteItem(id, {task: 'delete-one'} )
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {task: 'delete'}));
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	let id = req.body.cid;
	id.forEach( async (i) => {
		let idCategory = '';
		
		await MainModel.getItem(i, null).then( (item) => { idCategory = item.group.id});
		await GroupsModel.updateAmountOfItem(idCategory, -1).then( (result) => { });
	});
	MainModel.deleteItem(req.body.cid, {task: 'delete-mutli'} )
		.then((result) => NotifyHelpers.show(req, res, linkIndex, {total: result.n ,task: 'delete-multi'}));
});

// FORM
router.get(('/form(/:id)?'), async(req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', slug: '',  ordering: 0, status: 'allvalue', link:'',
				 group_id: '', group_name: '', group_slug:'', group_link: ''};

	let groupsItems	= [];
	await GroupsModel.listItemsInSelectbox().then((items)=> {
		groupsItems = items;
		groupsItems.unshift({_id: 'allvalue', name: 'All category'});
	});
	
	let errors   = null;
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, groupsItems, controllerName});
	}else { // EDIT
		MainModel.getItem(id).then((item) =>{
			item.group_id = item.group.id;
			item.group_name = item.group.name;
			item.group_slug = item.group.slug;
			item.group_link = item.group.link;
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, groupsItems, controllerName});
		});	
	}
	
});

// SAVE = ADD EDIT
router.post('/save', async(req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));

		let item = Object.assign(req.body);
		let taskCurrent	= (typeof item !== "undefined" && item.id !== "" ) ? "edit" : "add";

		let errors = MainValidate.validator(req, errUpload, taskCurrent);
		
		if(errors.length > 0) { 
			let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
			if(req.file != undefined){
				FileHelpers.remove(folderImage, req.file.filename);			
			} // xóa tấm hình khi form không hợp lệ
		
			let groupsItems	= [];
			await GroupsModel.listItemsInSelectbox().then((items)=> {
				groupsItems = items;
				groupsItems.unshift({_id: 'allvalue', name: 'All category', slug:''});
			});

			
			if (taskCurrent == "edit") item.avatar = StringHelpers.getNameImage(item.image_old);
			res.render(`${folderView}form`, { pageTitle, item, errors,brandsItems, groupsItems});
		}else {
			let message = (taskCurrent == "add") ? 'add' : 'edit';
			if(req.file  == undefined){ // không có upload lại hình
				item.avatar = item.image_old;
			}else{
				item.avatar = req.file.filename;
				if(taskCurrent == "edit") {
					FileHelpers.remove(folderImage, item.image_old);	
				}
			}
			

			MainModel.saveItem(item, req.user, {task: taskCurrent} )
			.then((result) => NotifyHelpers.show(req, res, linkIndex, {task: message}));
		}
	});
});

// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

// FILTER GROUP
router.get(('/filter-group/:group_id'), (req, res, next) => {
	req.session.group_id		= ParamsHelpers.getParam(req.params, 'group_id', '');
	res.redirect(linkIndex);
});

module.exports = router;
