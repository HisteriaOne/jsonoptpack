"use strict";

var jsonoptpack = function()
{
  function prepareStrings(strings, index, object)
  {
    var a = object[1]

    for (var i in a) {
      var s = a[i]
      var v = strings[s]
      if (typeof v === "undefined") {
        strings[s] = index++
      } else {
        var x = String(v)
        if (x.length + 1 < s.length) { a[i] = "@" + v }
      }
    }

    return index
  }

  function appendData(out, objects)
  {
    var strings = {}
    var index = 0

    for (var k in objects) {
      var m = objects[k][1]
      for (var l in m) {
        var object = m[l]
        if (object[0] === 1) { out.push(object[1].join("")) }
      }
    }

    for (var k in objects) {
      var m = objects[k][1]
      for (var l in m) {
        var object = m[l]
        if (object[0] === 2) { out.push(object[1].join("|")) }
      }
    }

    for (var k in objects) {
      var m = objects[k][1]
      for (var l in m) {
        var object = m[l]
        if (object[0] === 3) {
          index = prepareStrings(strings, index, object)
          out.push(object[1].join("|"))
        }
      }
    }
  }

  function appendObjects(out, objects, data)
  {
    if (data === null) { return }

    findObjects(objects, data)

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
        dt.push(m[l][0])
        out.push(l)
      }
    }
    out[f] = dt.join("")
  }

  function appendSchema(out, objects, data)
  {
    if (data === null || typeof data !== "object") { return }

    if (!Array.isArray(data)) {
      out.push(objectkeys[getObjectKey(data)])
      return
    }

    var objectkeys = {}
    var ol = 0
    for (var k in objects) { objectkeys[k] = ol++ }

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

      k = getObjectKey(v)
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

  function findObjects(objects, data)
  {
    if (data === null || typeof data !== "object") { return }

    if (Array.isArray(data)) {
      for (var i in data) { findObjects(objects, data[i]) }
      return
    }

    var x = getObjectKey(data)
    var m
    if (typeof objects[x] === "undefined") {
      var i = 0
      m = {}
      for (var k in data) {
        i++
        m[k] = [getDatatype(data[k]), []]
      }
      objects[x] = [i, m]
    } else {
      m = objects[x][1]
    }

    for (var k in data) {
      var v = data[k]
      var t = typeof v
      if (t === "object") { continue }
      if (t === "boolean") { v = v ? 1 : 0 }
      m[k][1].push(v)
    }

    for (var k in data) { findObjects(objects, data[k]) }
  }

  function getDatatype(value)
  {
    if (value === null) { return 0 }

    if (typeof value === "boolean") { return 1 }
    if (typeof value === "number")  { return 2 }
    if (typeof value === "string")  { return 3 }
    if (Array.isArray(value))       { return 4 }
    if (typeof value === "object")  { return 5 }
  }

  function getObjectKey(object)
  {
    var a = []
    for (var k in object) { a.push(k, getDatatype(object[k])) }
    return a.join("|")
  }

  function unpackObjects(a, index, objects)
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

  function pack(data)
  {
    var out = []

    var objects = {}
    appendObjects(out, objects, data)

    appendSchema(out, objects, data)
    appendData(out, objects)

    return out.join("|")
  }

  function unpack(str)
  {
    if (typeof str !== "string") { return str }

    // TODO: strings can contain symbol "|", it means we must implement own splitter with handling "\|" and "\\"
    var a = str.split("|")

    var objects = []
    var i = unpackObjects(a, 0, objects)

    console.log(objects)

    return null // TODO
  }

  return {pack: pack, unpack: unpack}
}()

if (typeof module != "undefined" && module.exports) { module.exports = jsonoptpack }
