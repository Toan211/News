
let countItems = async (model) => {
    let total = Number();
    await model.count({}, function( err, count){
        total = count;
    });
    return total;
}

let countItems2 = async (model) => {
    let total = 0;
    await model.count({}).then( (data) => {
		total = data;
    });
    return total;
}

module.exports = {
    countItems,
    countItems2
}