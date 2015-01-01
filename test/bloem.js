// Copyright 2014 TSUYUSATO Kitsune 
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License. 

'use strict';

var
expect = require('chai').expect;

var
bloem = require('..');

describe('bloem', function () {

  describe('.use', function () {
    var
    mixin = {
      __test: true,
    };

    afterEach(function () {
      Object.keys(mixin).forEach(function (key) {
        delete bloem[key];
        delete bloem.Pomp.prototype[key];
        delete bloem.Hoos.prototype[key];
      });
    });

    it('should return itself.', function () {
      expect(bloem.use({})).to.equal(bloem);
    });

    it('should mix specified object to Pump and Hoos.', function () {
      bloem.use(mixin);
      expect(bloem.Pomp.prototype).to.have.property('__test');
      expect(bloem.Hoos.prototype).to.have.property('__test');
    });

    it('should mix specified object to Pump and Hoos and bloem, setting `extendBloemFlag\'.', function () {
      bloem.use(mixin, true);
      expect(bloem).to.have.property('__test', true);
    });
  });

  describe('.wrapIter', function () {
    function twoArgumentsFunction(a, b) { }
    function oneArgumentsFunction(a) {
      if (typeof a === 'object') {
        throw a;
      }
      return a;
    }
    var
    wrappedFunction = bloem.wrapIter(oneArgumentsFunction);

    it('should return same object, if passed two arguments function object, on default.', function () {
      expect(bloem.wrapIter(twoArgumentsFunction)).to.equal(twoArgumentsFunction);
    });

    it('should return wrapped function, if passed one arguments function object, on default.', function () {
      expect(wrappedFunction).not.to.equal(oneArgumentsFunction);
    });

    it('should wrap function, call `next\' with null and return value.', function () {
      wrappedFunction('test', function next(error, data) {
        expect(error).to.be.null;
        expect(data).to.equal('test');
      });
    });

    it('should wrap function, call `next\' with thrown exception, when threw exception in passed function', function () {
      var
      error = {};
      wrappedFunction(error, function next(thrown) {
        expect(thrown).to.equal(error);
      });
    });

    it('should return same object, if passed function object that\'s length is same or greater then `baseLength\'.', function () {
      expect(bloem.wrapIter(oneArgumentsFunction, 0)).to.equal(oneArgumentsFunction);
    });

    it('should return wrapped, if passed function object that\'s length is less than `baseLength\'.', function () {
      expect(bloem.wrapIter(twoArgumentsFunction, 2)).not.to.equal(twoArgumentsFunction);
    });
  });

});
