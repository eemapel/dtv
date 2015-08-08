#!/usr/bin/env node

var indexer = require('./lib/indexer.js')

indexer.create_index(__dirname)
indexer.summary()

