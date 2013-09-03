var Transform = require('stream').Transform,
    util = require('util'),
    colors = require('colors');

util.inherits(ZalgoTransformStream,Transform);

function ZalgoTransformStream(pad){
  var self = this;
  self.pad = pad;
  Transform.call(self);
};

ZalgoTransformStream.prototype._transform = function(chunk,encoding,done){
  var self = this;
  self.text = chunk+'';
  var padding = (Array(self.pad)||Array(2)).join("\n");
  self.push(padding+colors.zalgo(self.text));
  done();
};

module.exports = ZalgoTransformStream;

if(require.main===module){
  var me = require('fs').createReadStream(__filename);
  var zalgo = new ZalgoTransformStream();
  me.pipe(zalgo).pipe(process.stdout);
}