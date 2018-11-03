var jsonoptpack = require("./jsonoptpack");

/*
[{ "a" : "string0", "b": 40},{ "a" : "string1", "b": 41},{"c": true, "d":45, "e": "string2"},{ "a" : "string2", "b": 42}]
"2|2|3|21012|a|b|c|d|e|
a4|0|1|0|2|1|1| or a4|010|2|1|1| or a4|010|211|
string0|string1|string2|40|41|42|1|45|@2"

  2|2|3|21012|a|b|c|d|e|a4|010|211|string0|string1|string2|40|41|42|1|45|@2
*/

var test = [
  {"a": "string0", "b": 40},
  {"a": "string1", "b": 41},
  {"c": true, "d": 45, "e": "string2"},
  {"c": false, "d": 46, "e": "string2"},
  {"a": "string2", "b": 42}
]

console.log(JSON.stringify(test))

var px = jsonoptpack.pack(test)
console.log(px)
console.log(jsonoptpack.unpack(px))
