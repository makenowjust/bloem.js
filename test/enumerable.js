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
          if (i >= data.length) {
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
          if (i >= data.length) {
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
          if (i >= data.length) {
            done();
          }
        });
        pomp.connect(map).connect(tuin);
      });
    });

    describe('#filter', function () {
      it('should return a hoos.', function () {
        expect(bloem.filter(function () { })).to.be.an.instanceof(bloem.Hoos);
      });

      it('should be called by each values excepting error.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        error = ['error'],
        pomp = bloem.Pomp(),
        filter = bloem.filter(function (result) {
          expect(result).to.equal(data[i++]);
          if (i >= data.length) {
            done();
          }
          return result;
        });
        pomp.connect(filter);
        pomp.send(data[0]);
        pomp.raise(error);
        pomp.send(data[1]);
      });

      it('should apply and filter each results.', function (done) {
        var
        pomp = bloem.fromArray([0, 1]),
        filter = bloem.filter(function (i) {
          return i === 1;
        }),
        tuin = bloem.Tuin(function (error, result) {
          expect(error).to.be.null;
          expect(result).to.equal(1);
          done();
        });
        pomp.connect(filter).connect(tuin);
      });

      it('should call as async.', function (done) {
        var
        pomp = bloem.fromArray([0, 1]),
        err = ['error'], i = 0,
        filter = bloem.filter(function (i, next) {
          setTimeout(function () {
            if (i === 0) {
              next(err);
            } else {
              next(null, true);
            }
          }, 0);
        }),
        tuin = bloem.Tuin(function (error, result) {
          if (i++ === 0) {
            expect(error).to.equal(err);
          } else {
            expect(error).to.be.null;
            expect(result).to.equal(1);
            done();
          }
        });
        pomp.connect(filter).connect(tuin);
      });
    });

    describe('#reduce', function () {
      it('should return a hoos.', function () {
        expect(bloem.reduce(function () { })).to.be.an.instanceof(bloem.Hoos);
      });

      it('should be called by each values excepting error.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        error = ['error'],
        pomp = bloem.Pomp(),
        reduce = bloem.reduce(function (_, result) {
          expect(result).to.equal(data[i++]);
          if (i >= data.length) {
            done();
          }
          return result;
        });
        pomp.connect(reduce);
        pomp.send(data[0]);
        pomp.raise(error);
        pomp.send(data[1]);
      });

      it('default `init\' is `undefine\'.', function (done) {
        var
        data = ['test'],
        pomp = bloem.Pomp(),
        reduce = bloem.reduce(function (init) {
          expect(init).to.be.undefined;
          done();
          return init;
        });
        pomp.connect(reduce);
        pomp.send(data);
      });

      it('should apply and reduce each results.', function (done) {
        var
        pomp = bloem.fromArray([2, 4]), results = [2, 6], i = 0,
        reduce = bloem.reduce(function (sum, i) {
          return sum + i;
        }, 0),
        tuin = bloem.Tuin(function (error, result) {
          expect(error).to.be.null;
          expect(result).to.equal(results[i++]);
          if (i >= results.length) {
            done();
          }
        });
        pomp.connect(reduce).connect(tuin);
      });

      it('should call as async.', function (done) {
        var
        pomp = bloem.fromArray([0, 4]), results = [0, 4], i = 0,
        err = ['error'], i = 0,
        reduce = bloem.reduce(function (sum, i, next) {
          setTimeout(function () {
            if (i === 0) {
              next(err);
            } else {
              next(null, sum + i);
            }
          }, 0);
        }, 0),
        tuin = bloem.Tuin(function (error, result) {
          if (i++ === 0) {
            expect(error).to.equal(err);
          } else {
            expect(error).to.be.null;
            expect(result).to.equal(results[i-1]);
            done();
          }
        });
        pomp.connect(reduce).connect(tuin);
      });
    });

    describe('#forEach', function () {
      it('should return a tuin.', function () {
        expect(bloem.forEach(function () { })).to.be.an.instanceof(bloem.Tuin);
      });

      it('should apply each values.', function (done) {
        var
        pomp = bloem.fromArray([0, 1]), i = 0,
        forEach = bloem.forEach(function (data) {
          expect(data).to.equal(i++);
          if (i >= 2) {
            done();
          }
        });
        pomp.connect(forEach);
      });

      it('should ignore raised error.', function (done) {
        var
        error = ['error'],
        pomp = bloem.Pomp(), i = 0,
        forEach = bloem.forEach(function (data) {
          expect(data).to.equal(i++);
          if (i >= 2) {
            done();
          }
        });
        pomp.connect(forEach);
        pomp.send(0);
        pomp.raise(error);
        pomp.send(1);
      });
    });

    describe('#flatMap', function () {
      it('should return a hoos.', function () {
        expect(bloem.flatMap(function () { })).to.be.an.instanceof(bloem.Hoos);
      });

      it('should be called by each values excepting error.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        error = ['error'],
        pomp = bloem.Pomp(),
        flatMap = bloem.flatMap(function (result) {
          expect(result).to.equal(data[i++]);
          if (i >= data.length) {
            done();
          }
          return new bloem.Pomp();
        });
        pomp.connect(flatMap);
        pomp.send(data[0]);
        pomp.raise(error);
        pomp.send(data[1]);
      });

      it('should apply and return each values.', function (done) {
        var
        data = [['test1'], ['test2']], i = 0,
        pomp = bloem.fromArray([0, 1]),
        flatMap = bloem.flatMap(function (i) {
          return new bloem.Pomp().send(data[i]);
        }),
        tuin = bloem.Tuin(function (error, result) {
          expect(error).to.be.null;
          expect(result).to.equal(data[i++]);
          if (i >= data.length) {
            done();
          }
        });
        pomp.connect(flatMap).connect(tuin);
      });

      it('should call as async.', function (done) {
        var
        err = ['error'], i = 0,
        pomp = bloem.fromArray([0, 1]),
        flatMap = bloem.flatMap(function (i, next) {
          setTimeout(function () {
            if (i === 0) {
              next(err);
            } else {
              next(null, new bloem.Pomp().send(i));
            }
          }, 0);
        }),
        tuin = bloem.Tuin(function (error, result) {
          if (i++ === 0) {
            expect(error).to.equal(err);
          } else {
            expect(error).to.be.null;
            expect(result).to.equal(1);
            done();
          }
        });
        pomp.connect(flatMap).connect(tuin);
      });
    });
  });

});
