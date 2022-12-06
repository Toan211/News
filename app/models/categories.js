const MainModel 	= require(__path_schemas + 'categories');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        
        sort[params.sortField]  = params.sortType;
    
        return MainModel
            .find(objWhere)
            .select('name status ordering created modified slug')
            .sort(sort)
            .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    },

    listItemsFrontend: (params= null, options = null) => {
        let find = {};
        let select = 'name slug';
        let limit = 10;
        let sort = '';

        if (options.task == 'items-in-menu'){
            find = {status:'active'};
            sort = {ordering: 'asc'};            
        }

        return MainModel.find(find).select(select).limit(limit).sort(sort);
    },

    getItem: (id, options = null) => {
        return MainModel.findById(id);
    },

    getItems: (params = null, option = null) => {
        if(option.task == 'get-items-by-id'){
            return MainModel.findById(params.id).select('name slug');
        }
        if(option.task == 'get-name-items'){
            return MainModel.find({}, {_id: 1, name: 1});
        }
        if(option.task == 'get-items-by-slug'){
            return MainModel.find({slug: params.slug}).select('name slug');
        }
    },

    listItemsInSelectbox: (params, options = null) => {
        return  MainModel.find({}, {_id: 1, name: 1, slug: 1});
    },

    

    countItem: (params, options = null) => {
        let objWhere    = {};
        
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return MainModel.count(objWhere);
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

    deleteItem: (id, options = null) => {
        if(options.task == "delete-one") {
            return MainModel.deleteOne({_id: id});
        }

        if(options.task == "delete-mutli") {
            return MainModel.remove({_id: {$in: id } });
        }
    },

    saveItem: (item, user, options = null) => {
        if(options.task == "add") {
            item.created = {
				user_id: user.id,
                user_name: user.username,
				time: Date.now()
            }
            
			return new MainModel(item).save();
        }

        if(options.task == "edit") {
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                slug: item.slug,
				status: item.status,
				content: item.content,
				modified: {
					user_id: user.id,
                    user_name: user.username,
        			time: Date.now()
				}
			});
        }
    }
}