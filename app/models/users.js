const MainModel 	= require(__path_schemas + 'users');
const FileHelpers = require(__path_helpers + 'file');
const uploadFolder = 'public/uploads/users/';
const fs = require('fs');
var md5 = require('md5');

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
            .select('name status ordering created modified group.name avatar username')
            .sort(sort)
            .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    },

    getItem: (id, options = null) => {
        return MainModel.findById(id);
    },

    getItemByUsername: (username, options = null) => {
        if(options == null) {
            return MainModel.find({status:'active', username: username})
                            .select('username password avatar status group.name')
        } 
    },

    countItem: (params, options = null) => {
        let objWhere    = {};
        
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return MainModel.count(objWhere);
    },

    changeStatus: (id, currentStatus,  user, options = null) => {
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

    changeOrdering: async (cids, orderings, user, options = null) => {
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
                FileHelpers.remove(uploadFolder, item.avatar);
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
				user_id : user.id,
				user_name: user.username,
				time: Date.now()
			}
            item.group = {
                id: item.group_id,
                name: item.group_name,
            }
            // item.password= /* md5 */(item.password)
			return new MainModel(item).save();
        }

        if(options.task == "edit") {
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                username: item.username,
                password: /* md5 */(item.password),
				status: item.status,
				content: item.content,
                avatar: item.avatar,
                group: {
                    id: item.group_id,
                    name: item.group_name,
                },
				modified: {
					user_id : user.id,
        			user_name: user.username,
        			time: Date.now()
				}
			});
        }

        if(options.task == "change-group-name") {
            return MainModel.updateMany({'group.id': item.id}, {
				group: {
                    id: item.id,
					name: item.name,
				},
			});
        }
    }
}