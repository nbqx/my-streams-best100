var stream = require('stream'),
    util = require('util');

util.inherits(MyStringStream,stream.Readable);

function MyStringStream(string,opt){
  var self = this;
  
  stream.Readable.call(self,opt);
  self.string = string;
  self.push(self.string);

};

MyStringStream.prototype._read = function(size){};

module.exports = MyStringStream;

