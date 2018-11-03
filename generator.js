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
            fields.push(['f' + i + '' +j, fieldTypes[getRandomInt(3)]])
        }
        result.push(fields);
    }

    return result;
}

function generateFieldTemplte(field, index) {
    return ['object.rnd === ' + index + ',' + field[0]+'', field[1]];
}

var structure = generateStructure();
var template = { rnd: { function: function() { return getRandomInt(config.groups); }, virtual: true}};

for (var i = 0; i < structure.length; i++) {
    for (var j = 0; j < structure[i].length; j++) {
        var field = generateFieldTemplte(structure[i][j], i);
        template[field[0]] = field[1];
    }
}

mocker().schema('data', template, 10).build().then(data => console.log(JSON.stringify(data)));
