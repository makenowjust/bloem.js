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
expect = require('chai').expect;

var
bloem = require('..');

describe('bloem', function () {

  describe('.Pomp', function () {
    var
    pomp;

    beforeEach(function () {
      pomp = new bloem.Pomp();
    });
    
    it('should return new instance without `new\'', function () {
      expect(bloem.Pomp()).to.be.an.instanceOf(bloem.Pomp);
    });

    it('should call `connect\' method.', function () {
      expect(pomp).to.respondTo('connect');
    });

    describe('#sendAndRaiseSync', function () {
      var
      tuins, n = 10;

      beforeEach(function () {
        var
        i, tuin;
        tuins = [];

        for (i = 0; i < n; i++) {
          tuin = new bloem.Tuin(function handler(error, data) {
            this.results.push({
              error: error,
              data: data,
            });
          });
          tuin.results = [];
          tuins.push(tuin);
        }
      });

      it('should return itself.', function () {
        expect(pomp.sendAndRaiseSync(null, null)).to.equal(pomp);
      });

      it('should call `onData\' methods of each targets.', function () {
        var
        error = ['error'], data = ['data'];
        tuins.forEach(pomp.connect.bind(pomp));

        pomp.sendAndRaiseSync(error, data);
        tuins.forEach(function loop(tuin) {
          expect(tuin.results[0]).to.have.keys(['error', 'data']);
          expect(tuin.results[0].error).to.equal(error);
          expect(tuin.results[0].data).to.equal(data);
        });
      });
    });

    describe('#sendAndRaise', function () {
      var
      tuin;

      beforeEach(function () {
        tuin = new bloem.Tuin(function handler(error, data) {
          this.handle(error, data);
        });
        tuin.handle = console.log;
      });

      it('should return itself.', function () {
        expect(pomp.sendAndRaise(null, null)).to.equal(pomp);
      });

      it('should call `onDate\' after tick.', function (done) {
        var
        count = 1,
        error1 = ['error1'], data1 = ['data1'],
        error2 = ['error2'], data2 = ['data2'],
        error3 = ['error3'], data3 = ['data3'];
        pomp.connect(tuin);
        tuin.handle = function (error, data) {
          try {
            switch (count++) {
            case 1:
              expect(error).to.equal(error1);
              expect(data).to.equal(data1);
              break;
            case 2:
              expect(error).to.equal(error2);
              expect(data).to.equal(data2);
              break;
            case 3:
              expect(error).to.equal(error3);
              expect(data).to.equal(data3);
              done();
              break;
            default:
              throw Error('too many call!');
            }
          } catch (e) {
            tuin.handle = null;
            throw e;
          }
        };

        pomp.sendAndRaise(error2, data2);
        pomp.sendAndRaiseSync(error1, data1);
        pomp.sendAndRaise(error3, data3);
      });
    });
  });

});
