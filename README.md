#bloem.js [![Build Status](https://travis-ci.org/MakeNowJust/bloem.js.svg?branch=master)](https://travis-ci.org/MakeNowJust/bloem.js) [![Coverage Status](https://coveralls.io/repos/MakeNowJust/bloem.js/badge.png?branch=master)](https://coveralls.io/r/MakeNowJust/bloem.js?branch=master)

Processing events and actions like Gardening in JavaScript.

##bloem?

__bloem__ means _flower_ in Dutch.  So, this library provide gradening like programming.


##Let's install!

```console
$ npm install bloem.js
```

bower support coming soon.

##First example

```javascript
var
fs = require('fs'),
bloem = require('bloem.js');

// you have an array pomp.
var
pomp = bloem.fromArray([1,2,3,4,5]);

// you connect this pomp to filename maker hoos, results type is hoos.
var
filenameMaker = bloem.map(function filenameMaker(n) {
  return 'file' + n + '.txt';
}),
hoos = pomp.connect(filenameMaker);

// you connect this hoos to file reader hoos, it is async hoos.
var
fileReader = bloem.map(function fileReader(filename, next) {
  fs.readFile(filename, 'utf8', next);
});
hoos = hoos.connect(fileReader);

// you connect this hoos to parsing number hoos and calcing sum hoos.
var
parseNum = bloem.map(function parseNum(s) {
  return parseInt(s, 10);
}),
calcSum = bloem.reduce(function calcSum(sum, s) {
  return sum + s;
}, 0);
hoos = hoos.connect(parseNum).connect(calcSum);

// you connect this hoos to logger tuin.
var
logger = bloem.forEach(function logger(s) {
  console.log(s);
}),
tuin = hoos.connect(logger);

// final, outputs is:
//   1
//   3
//   7
//   15
//   31
// so logger tuin display results reactively.
```

##TODO

  - [ ] make a document
  - [ ] covers all api with tests
  - [x] start CI test
  - [ ] start a browser test


##License

```
Copyright 2014-2015 TSUYUSATO Kitsune 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
lim itations under the License. 
```
