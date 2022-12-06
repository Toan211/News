
module.exports = {
    prefixAdmin: 'adminCCC',
    prefixBlog: '',
    //prefixSales: 'sales',
    format_long_time: 'DD-MM-YYYY hh:mm:ss',
    format_date: 'DD-MM-YYYY',
    env: 'production', // production dev
    status_value: [
        {id: 'allvalue', name: 'Choose Status'},
		{id: 'active', name: 'Active'},
		{id: 'inactive', name: 'InActive'},
    ],
    special_value: [
        {id: 'allvalue', name: 'Choose Special'},
		{id: 'active', name: 'Active'},
		{id: 'inactive', name: 'InActive'},
    ],
    groupacp_value: [ 
        {id: 'allvalue', name: 'Choose Group ACP'},
		{id: 'yes', name: 'Yes'},
		{id: 'no', name: 'No'},
    ],
    radio_object: [
		{value: 'yes', name: 'Yes'},
		{value: 'no', name: 'No'}
	],
};