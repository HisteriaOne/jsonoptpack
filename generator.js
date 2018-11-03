var mocker = require('mocker-data-generator').default;

var config = {
    groups: 3,
    fields: 2
};

var fieldTypes = [
    {chance: 'bool'},
    {chance: 'string'},
    {chance: 'integer'}
];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateStructure() {
    var result = [];

    for (var i = 0; i < config.groups; i++) {
        var fields = [];
        for (var j = 0; j < config.fields; j++) {
            fields.push()
        }
        result.push(fields);
    }

    return result;
}

console.log(generateStructure());

function generateFieldTemplte(field, index) {
    var newObj = new Object();
    var name = 'object.rnd === ' + index + ',' + field[0];
    newObj[name] = field[1];
    return newObj;
}

var structure = generateStructure();

for (var i = 0; i < structure.length; i++) {
    for (var j = 0; j < structure[i].length; j++) {
        generateFieldTemplte(structure[i][j], i);
    }
}
