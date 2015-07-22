#!/usr/bin/env node

var fs = require('fs')

var packages = []

// Recursively find all package.json files and add them to array

var subtree = function(path) {
    var pkgjson = fs.readFileSync(path + "/package.json", "utf-8")
    packages.push(JSON.parse(pkgjson))

    if (fs.existsSync(path + "/node_modules")) {
        var dependencies = fs.readdirSync(path + "/node_modules")
        dependencies.forEach(function(item) {
            subtree(path + "/node_modules/" + item)
        })
    }
}

subtree(__dirname);

