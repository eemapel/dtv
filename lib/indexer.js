// indexer.js
var exports = module.exports = {}

var fs = require('fs')
var wlog = require('wlog')

var packages = []
var installed = 0
var non_prods = 0

var get_production_dependencies = function(pkgjson) {
    var deps = []

    // Check if there are production dependencies..
    if (pkgjson.dependencies) {
        for (var attr in pkgjson.dependencies) {
            // ..and add them to array
            deps.push(attr)
        }
    }

    return deps
}

// Recursively find all package.json files and add them to array
var subtree = function(path, prod) {
    if (!fs.existsSync(path + "/package.json")) {
        wlog.err("package.json not found at: " + path)
    }

    var data = fs.readFileSync(path + "/package.json", "utf-8")
    var pkgjson = JSON.parse(data)
    var prod_deps = get_production_dependencies(pkgjson)
    packages.push(pkgjson)

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
            var next_prod = prod

            if (!fs.existsSync(next_path)) {
                wlog.err("Path not found for " + next_path)
            }

            // Set next_prod false if this isn't production dependency anymore
            if (prod_deps.indexOf(item) < 0) {
                next_prod = false
            }

            subtree(next_path, next_prod)
        })

        // Increase installed dependencies count
        installed += dependencies.length
    }

    // For each non-production dependency, increase counter too
    if (prod === false) {
        non_prods++
    }
}

exports.create_index = function(path) {
    // First folder with production dependency lookup set to true
    subtree(path, true)
}

exports.summary = function() {
    wlog.tag("SUMMARY")
    wlog.note("Total number of production dependencies recorded : " + (packages.length - 1))
    wlog.note("Total number of installed dependencies           : " + installed)
    wlog.note("Total number of non-production dependencies      : " + non_prods)
}

