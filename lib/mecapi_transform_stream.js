var Transform = require('stream').Transform,
    util = require('util');

var request = require('superagent');

util.inherits(MecapiTransformStream,Transform);

function MecapiTransformStream(){
  var self = this;
  self.base_url = "http://yapi.ta2o.net/apis/mecapi.cgi";
  self.buf = [];
  Transform.call(this);
};

MecapiTransformStream.prototype._transform = function(chunk,encoding,done){
  var self = this;
  self.text = chunk+'';

  request.get('http://yapi.ta2o.net/apis/mecapi.cgi').query({
    sentence: self.text,
    response: "surface+pos",
    filter: "",
    format: "json"
  }).end(function(r){

    r.on('data',function(data){
      self.buf.push(data);
    });
    
    r.on('end',function(){
      var data = JSON.parse(self.buf+'');
      var txt = data.map(function(o){return o.surface}).join(" ");
      self.push(txt);
      done();
    });
  });

};

module.exports = MecapiTransformStream;

if(require.main === module){
  var MyStringStream = require('./my_string_stream');
  var t = new MyStringStream("これはテストだよ");
  var mecapi = new MecapiTransformStream();
  t.pipe(mecapi).pipe(process.stdout);
}