var Transform = require('stream').Transform,
    util = require('util'),
    markdown = require('markdown').markdown;

util.inherits(MarkdownTransformStream,Transform);

function MarkdownTransformStream(){
  this.converted = '';
  Transform.call(this);
};

MarkdownTransformStream.prototype._transform = function(chunk,encoding,done){
  var self = this;
  self.converted = markdown.toHTML(chunk+'');
  self.push(new Buffer(self.converted, 'utf8'));
  done();
};

MarkdownTransformStream.prototype.toString = function(){
  return this.converted
};

module.exports = MarkdownTransformStream;

if(require.main===module){
  var MyStringStream = require('./my_string_stream');
  var ss = new MyStringStream("# 見出し");
  var md = new MarkdownTransformStream();
  ss.pipe(md).pipe(process.stdout); // => <h1>見出し</h1>
}
