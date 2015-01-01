// Copyright 2014-2015 TSUYUSATO Kitsune 
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
chai = require('chai'),
expect = chai.expect;

var
bloem = require('..');

describe('bloem', function () {

  describe('.Enumerable', function () {
    it('is a object.', function () {
      expect(bloem.Enumerable).to.be.an.instanceof(Object);
    });

    describe('#map', function () {
      it('should return a hoos.', function () {
        expect(bloem.map(function () { })).to.be.an.instanceof(bloem.Hoos);
      });

      it('should be called by each values excepting error.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        error = ['error'],
        pomp = bloem.Pomp(),
        map = bloem.map(function (result) {
          expect(result).to.equal(data[i++]);
          if (i === data.length) {
            done();
          }
          return result;
        });
        pomp.connect(map);
        pomp.send(data[0]);
        pomp.raise(error);
        pomp.send(data[1]);
      });

      it('should apply and return each values.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        pomp = bloem.fromArray([0, 1]),
        map = bloem.map(function (i) {
          return data[i];
        }),
        tuin = bloem.Tuin(function (error, result) {
          expect(error).to.be.null;
          expect(result).to.equal(data[i++]);
          if (i === data.length) {
            done();
          }
        });
        pomp.connect(map).connect(tuin);
      });

      it('should call as async.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        pomp = bloem.fromArray([0, 1]),
        map = bloem.map(function (i, next) {
          setTimeout(function () {
            next(null, data[i]);
          }, 0);
        }),
        tuin = bloem.Tuin(function (error, result) {
          expect(error).to.be.null;
          expect(result).to.equal(data[i++]);
          if (i === data.length) {
            done();
          }
        });
        pomp.connect(map).connect(tuin);
      });
    });

  });

});
