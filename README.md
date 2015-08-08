# dtv
Dependency Tree Validator

Usage
=====
* Run in directory with ```node_modules``` tree

Planned Categories
==================
* Dependency names must be lower case
* peerDependencies are not allowed as they are not supported in npm 3
* Dependencies may only come from npm registries
* License field not set
* Invalid license
* Version mismatch against existing npm-shrinkwrap.json file
* Run nsp-package to see possible vulnerabilities
* engineStrict is not allowed as it will not be supported in npm 3
* Check that package.json's script fields are not pointing to node_modules
* Check all require statements for not using node_modules as part of the path
