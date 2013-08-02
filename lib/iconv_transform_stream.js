var Iconv = require('iconv').Iconv,
    Transform = require('stream').Transform,
    util = require('util');

util.inherits(IconvTransformStream,Transform);

function IconvTransformStream(from,to){
  var self = this;
  self.iconv = new Iconv(from,to);
  Transform.call(this);
};

IconvTransformStream.prototype._transform = function(chunk,encoding,done){
  var self = this;
  var buf = new Buffer(chunk,'binary');
  var converted = self.iconv.convert(buf);
  self.push(converted);
  done();
};

module.exports = IconvTransformStream;

if(require.main===module){
  var fs = require('fs');
  var inp = fs.createReadStream('cp932.txt');
  var out = fs.createWriteStream('utf-8.txt');

  var cnv = new IconvTransformStream('CP932','UTF-8');

  inp.pipe(cnv).pipe(out);
}