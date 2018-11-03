"use strict";


/*******************************************************************************
 * Constructor
 ******************************************************************************/

function jsonoptpack() {}


/*******************************************************************************
 * Public
 ******************************************************************************/

jsonoptpack.prototype.pack = function(data)
{
  var out = []

  var objects = {}
  this.appendObjects(out, objects, data)
  console.log(objects)

  this.appendSchema(out, objects, data)
  this.appendData(out, data)

  return out.join("|")
}

jsonoptpack.prototype.unpack = function(str)
{
  if (typeof str !== "string") { return str }

  // TODO: strings can contain symbol "|", it means we must implement own splitter with handling "\|" and "\\"
  var a = str.split("|")

  var objects = []
  var i = this.unpackObjects(a, 0, objects)

  console.log(objects)

  return null // TODO
}


/*******************************************************************************
 * Private
 ******************************************************************************/

jsonoptpack.prototype.appendData = function(out, data)
{
  // TODO
}

jsonoptpack.prototype.appendObjects = function(out, objects, data)
{
  if (data === null) { return }

  this.findObjects(objects, data)

  var i = 0

  var f = out.length
  out.push(0)

  for (var k in objects) {
    i++
    out.push(objects[k][0])
  }
  out[f] = i

  f = out.length
  out.push(0)

  var dt = []
  for (var k in objects) {
    var m = objects[k][1]
    for (var l in m) {
      dt.push(m[l])
      out.push(l)
    }
  }
  out[f] = dt.join("")
}

jsonoptpack.prototype.appendSchema = function(out, objects, data)
{
  if (data === null || typeof data !== "object") { return }

  if (!Array.isArray(data)) {
    out.push(objectkeys[this.getObjectKey(data)])
    return
  }

  var objectkeys = {}
  var ol = 0
  for (var k in objects) { objectkeys[k] = ol++ }
  console.log(objectkeys)

  out.push("a" + data.length)

  var prev = null
  var j = 0
  var sizes = []
  var ola = []
  var k
  for (var i in data) {
    var v = data[i]
    if (typeof v !== "object") {
      // TODO: next step: check string, numbers, arrays, etc.
      j = 0
      continue
    }

    k = this.getObjectKey(v)
    if (prev === null) {
      prev = k
      j = 1
      continue
    }

    if (k === prev) {
      j++
      continue
    }

    sizes.push(j)
    j = 1
    ola.push(objectkeys[prev])
    prev = k
  }
  ola.push(objectkeys[k])

  out.push(ola.join(ol <= 9 ? "" : "|"))

  var sz = []
  for (var i in sizes) { sz.push(sizes[i]) }
  sz.push(j)
  out.push(sz.join(data.length <= 9 ? "" : "|"))
}

jsonoptpack.prototype.findObjects = function(objects, data)
{
  if (data === null || typeof data !== "object") { return }

  if (Array.isArray(data)) {
    for (var i in data) { this.findObjects(objects, data[i]) }
    return
  }

  var i = 0
  var m = {}
  for (var k in data) {
    i++
    m[k] = this.getDatatype(data[k])
  }
  objects[this.getObjectKey(data)] = [i, m]

  for (var k in data) { this.findObjects(objects, data[k]) }
}

jsonoptpack.prototype.getDatatype = function(value)
{
  if (value === null) { return 0 }

  if (typeof value === "boolean") { return 1 }
  if (typeof value === "number")  { return 2 }
  if (typeof value === "string")  { return 3 }
  if (Array.isArray(value))       { return 4 }
  if (typeof value === "object")  { return 5 }
}

jsonoptpack.prototype.getObjectKey = function(object)
{
  var a = []
  for (var k in object) { a.push(k, this.getDatatype(object[k])) }
  return a.join("|")
}

jsonoptpack.prototype.unpackObjects = function(a, index, objects)
{
  if (a.length === 0) { return }

  var count = a[index++]
  if (count === 0) { return }

  var sizes = Array(count)
  var sizesall = 0
  for (var i = 0; i < count; i++) {
    var j = a[index++]
    sizes[i] = j
    sizesall += j
  }

  var dt = a[index++]

  var k = 0
  for (var i = 0; i < count; i++) {
    var m = {}
    for (var j = 0; j < sizes[i]; j++) { m[a[index++]] = dt.charCodeAt(k++) - 48 }
    objects.push(m)
  }

  return index
}


/*******************************************************************************
 * Test
 ******************************************************************************/

/*
[{ "a" : "string0", "b": 40},{ "a" : "string1", "b": 41},{"c": true, "d":45, "e": "string2"},{ "a" : "string2", "b": 42}]
"2|2|3|21012|a|b|c|d|e|
a4|0|1|0|2|1|1| or a4|010|2|1|1| or a4|010|211|
string0|string1|string2|40|41|42|1|45|@2"
*/

var test = [
  {"a": "string0", "b": 40},
  {"a": "string1", "b": 41},
  {"c": true, "d": 45, "e": "string2"},
  {"a": "string2", "b": 42}
]

console.log(test)

var jp = new jsonoptpack
var px = jp.pack(test)
console.log(px)
console.log(jp.unpack(px))
