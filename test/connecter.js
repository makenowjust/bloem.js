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

  describe('.Connecter', function () {
    it('can\'t make instance.', function () {
      expect(function test() {
        new bloem.Connecter;
      }).to.throw(Error);
    });

    function clazz() {
      bloem.Connecter.call(this);
    }
    bloem.Connecter.inherits(clazz);

    describe('.inherits', function () {
      it('should inherit bloem.Connecter.', function () {
        expect(clazz.prototype).to.be.an.instanceOf(bloem.Connecter);
      });

      it('should override constructor.', function () {
        expect(clazz.prototype).to.have.property('constructor')
          .and.not.to.equal(bloem.Connecter);
      });

      it('should not be enumerable `constructor\' property.', function () {
        expect(Object.keys(clazz.prototype)).not.to.include('constructor');
      });
    });

    describe('#connect', function () {
      var
      inst;

      beforeEach(function () {
        inst = new clazz();
      });

      it('should not return passed object.', function () {
        var
        uniq = {};

        expect(inst.connect(uniq)).not.to.equal(uniq);
      });

      it('should add target.', function () {
        var
        uniq = {};

        inst.connect(uniq);
        expect(getTargets(inst)).to.have.length(1);
      });

      it('should be added target into head.', function () {
        var
        head = new clazz(),
        inst = head.connect(new clazz());

        expect(getHead(head)).to.equal(head);
      });

      function getTargets(inst) {
        return inst._targets;
      }

      function getHead(inst) {
        return inst._head;
      }
    });

  });

});
