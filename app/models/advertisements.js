const MainModel 	= require(__path_schemas + 'advertisements');
const FileHelpers = require(__path_helpers + 'file');
const uploadFolder  = __path_uploads + 'advertisements/';
const fs = require('fs');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        if(params.groupID !== 'allvalue' && params.groupID !== '') objWhere['group.id'] = params.groupID;

        sort[params.sortField]  = params.sortType;

        return MainModel
            .find(objWhere)
            .select('name slug status ordering created modified group avatar link')
            .sort(sort)
            .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    },

    listItemsFrontend: (params = null, options = null) => {
        let find = {};
        let select = 'name slug created group avatar link';
        let limit;
        let sort = '';


        if(options.task == 'items-each-cate'){
            find = {status:'active','group.id': params.id};
            sort = {ordering: 'asc'};
            limit = 1;
        }

        if (options.task == 'items-random'){
            return MainModel.aggregate([
                    { $match: { status: 'active' }},
                    { $project : {_id: 1,name : 1, slug:1 , created : 1 ,avatar: 1, link: 1}  },
                    { $sample: {size: 4}}
                ]);
        }


        if(options.task == 'items-search'){
            return MainModel.find({$text: {$search: params.keyword}, status:'active'})
                    .limit(5)
                    .exec();
        }

        return MainModel.find(find).select(select).limit(limit).sort(sort);

    },


    listItemsSearch: (params, options = null) =>{
        let objWhere    = {status:'active'};
        let sort		= {};
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        

        return MainModel
            .find(objWhere)
            .select('name slug created modified group link')
            .sort(sort);
            
    },

    getItem: (id, options = null) => {
        return MainModel.findById(id);
    },

    getItemFrontend: (id, options = null) => {
        return MainModel.findById(id)
            .select('name slug created modified group avatar link');
    },

    getSlugArticle: (slug, option = null) => {
        let select = 'name slug created group avatar link';
        return MainModel.find({slug: slug}).select(select);
    },

    countItem: (params, options = null) => {
        let objWhere    = {};

        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return MainModel.count(objWhere);
    },

    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        if(params.groupID !== '') objWhere.groupID = params.groupID;
        
        return MainModel.countDocuments(objWhere);
    },
    

    changeStatus: (id, currentStatus, user, options = null) => {
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data 			= {
            status: status,
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        }

        if(options.task == "update-one"){
            return MainModel.updateOne({_id: id}, data);
        }

        if(options.task == "update-multi"){
            data.status = currentStatus;
            return MainModel.updateMany({_id: {$in: id }}, data);
        }
    },


    changeOrdering: async (cids, orderings,user, options = null) => {
        let data = {
            ordering: parseInt(orderings),
            modified:{
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
                }
            };

        if(Array.isArray(cids)) {
            for(let index = 0; index < cids.length; index++) {
                data.ordering = parseInt(orderings[index]);
                await MainModel.updateOne({_id: cids[index]}, data)
            }
            return Promise.resolve("Success");
        }else{
            return MainModel.updateOne({_id: cids}, data);
        }
    },


    deleteItem: async (id, options = null) => {
        if(options.task == "delete-one") {
            await MainModel.findById(id).then((item) => {
                for(let idx = 0; idx < item.avatar.length; idx++) {
					FileHelpers.remove(uploadFolder, item.avatar[idx]);
				}
            });
            return MainModel.deleteOne({_id: id});
        }

        if(options.task == "delete-mutli"){
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await MainModel.findById(id[index]).then((item) => {
                        
                        FileHelpers.remove(uploadFolder, item.avatar);
                        
                    });
                }
            }else{
                await MainModel.findById(id).then((item) => {
                    
                    FileHelpers.remove(uploadFolder, item.avatar);
            
                });
            }
            return MainModel.deleteMany({_id: {$in: id } });
        }
    },

    saveItem: (item, user, options = null) => {
        if(options.task == "add") {
            item.created = {
				user_id: user.id,
                user_name: user.username,
				time: Date.now()
			}
            item.group = {
                id: item.group_id,
                name: item.group_name,
                slug: item.group_slug,
                link: item.group_link,
            }
			return new MainModel(item).save();
        }

        if(options.task == "edit") {
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                status: item.status,
				link: item.link,
                slug: item.slug,
                avatar: item.avatar,
                group: {
                    id: item.group_id,
                    name: item.group_name,
                    slug: item.group_slug,
                    link: item.group_link,
                },
				modified:{
                    user_id: user.id,
                    user_name: user.username,
					time: Date.now()
				},
			});
        }

        if(options.task == "change-group-name") {
            return MainModel.updateMany({'group.id': item.id}, {
				group: {
                    id: item.id,
					name: item.name,
                    slug: item.slug,
                    link: item.link,
				},
			});
        }
    },
}