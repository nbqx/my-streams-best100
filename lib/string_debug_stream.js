var Writable = require('stream').Writable,
    util = require('util');

util.inherits(StringDebugStream, Writable);

function StringDebugStream(opt){
  Writable.call(this,opt);
};

StringDebugStream.prototype._write = function(data,encoding,done){
  var obj_mode = this._writableState.objectMode
  if(obj_mode){
    console.log(JSON.stringify(data));
  }else{
    console.log(data+'');
  }
  done();
};

module.exports = StringDebugStream;

if(require.main === module){
  var fs = require('fs');
  var r = fs.createReadStream(__filename);
  var d = new StringDebugStream();
  r.pipe(d);
}