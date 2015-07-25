#!/usr/bin/env node

var fs = require('fs')
var wlog = require('wlog')

var packages = []

// Recursively find all package.json files and add them to array

var subtree = function(path) {
    var pkgjson = fs.readFileSync(path + "/package.json", "utf-8")
    packages.push(JSON.parse(pkgjson))

    if (fs.existsSync(path + "/node_modules")) {
        // Save installated dependencies for currently processed package to an array
        var dependencies = fs.readdirSync(path + "/node_modules")

        // Remove known non-dependency directories from the list, like npm link directory
        var index = dependencies.indexOf(".bin")
        if (index >= 0) {
            dependencies.splice(index, 1)
        }

        dependencies.forEach(function(item) {
            var next_path = path + "/node_modules/" + item
            if (!fs.existsSync(next_path)) {
                wlog.err("Path not found for " + next_path)
            }
            subtree(next_path)
        })
    }
}

var summary = function() {
    wlog.tag("SUMMARY")
    wlog.note("Total number of dependencies: " + (packages.length - 1))
}

subtree(__dirname)
summary()

