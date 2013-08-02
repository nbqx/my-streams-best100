var Transform = require('stream').Transform,
    util = require('util');

util.inherits(GenericFilterStream, Transform);

function GenericFilterStream(fn,opt){
  var self = this;
  self.data = [];
  self.fn = fn;
  Transform.call(self,opt);
};

GenericFilterStream.prototype._transform = function(chunk,encoding,done){
  var self = this;
  if(chunk){
    self.data.push(chunk);
  }
  done();
};

GenericFilterStream.prototype._flush= function(done){
  var self = this;
  self.push(self.fn(self.data));
  done();
};

module.exports = GenericFilterStream;

if(require.main === module){
  var fs = require('fs');
  var flt = new GenericFilterStream(function(buf){
    var t = buf+'';
    return t.split('').reverse().join('')
  });
  fs.createReadStream(__filename).pipe(flt).pipe(process.stdout);

  var request = require('superagent');
  
}