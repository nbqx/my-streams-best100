var fs = require('fs'),
    should = require('should');
var MyStreams = require('../index');

var MyStringStream = MyStreams.MyStringStream;
var output = __dirname+'/output.txt';

describe("MyStringStream",function(){
  var ss = new MyStringStream("これはテストです");
  
  it('MyStringStreamはReadableStream',function(done){
    ss.readable.should.be.true
    done();
  });

  it('ssはMyStringStreamのinstance',function(done){
    ss.should.be.an.instanceof(MyStringStream);
    done();
  });

  it('stringプロパティは`これはテストです`',function(done){
    ss.string.should.eql('これはテストです');
    done();
  });

  it('Writableに書きこめる',function(done){
    var f = fs.createWriteStream(output);
    ss.pipe(f);
    done();
  });

  after(function(done){
    fs.unlink(output,done);
  });
});

var IconvTransformStream = MyStreams.IconvTransformStream;
describe('IconvTransformStream',function(){
  var cp932 = fs.createReadStream(__dirname+'/cp932.txt');
  var iconv = new IconvTransformStream('CP932','UTF-8');
  
  it('IconvTransformStreamはTransformStream',function(done){
    iconv.should.have.property('_transformState')
    done();
  });

  it('CP932からUTF-8へ変換',function(done){
    var f = fs.createWriteStream(output);
    cp932.pipe(iconv).pipe(f);

    fs.readFile(output,'utf-8',function(err,data){
      var txt = ''+data;
      txt.should.be.eql('これはCP932のテキストです');
      done();
    });
    
  });

  after(function(done){
    fs.unlink(output,done);
  });

});

var MarkdownTransformStream = MyStreams.MarkdownTransformStream;
describe('MarkdownTransformStream',function(){
  var ss = new MyStringStream('# これはテストです');
  var md = new MarkdownTransformStream();

  it('MarkdownTransformStreamはTransformStream',function(done){
    md.should.have.property('_transformState')
    done();
  });

  it('markdownを変換できるよ',function(done){
    var f = fs.createWriteStream(output);
    ss.pipe(md).pipe(f);

    fs.readFile(output,function(err,data){
      var html = ''+data;
      html.should.be.eql("<h1>これはテストです</h1>");
      done();
    });
    
  });

  after(function(done){
    fs.unlink(output,done);
  });

});

var MecapiTransformStream = MyStreams.MecapiTransformStream;
describe('MecapiTransformStream',function(){
  var mecapi = new MecapiTransformStream();

  it('MecapiTransformStreamはTransformStream',function(done){
    mecapi.should.have.property('_transformState')
    done();
  });

  // TODO: 
  // it('スペース区切りの分かちがき文字列がもどる - MyStringStream',function(done){
  //   var f = fs.createWriteStream(output);
  //   var ss = new MyStringStream("これはテキストです");

  //   f.on('finish',function(){
  //     fs.readFile(this.path,function(err,data){
  //       var t = ''+data;
  //       t.should.be.eql("これ は テキスト です");
  //       done();
  //     })
  //   });

  //   ss.pipe(mecapi).pipe(f);
  // });

  it('スペース区切りの分かちがき文字列がもどる - fs.createReadStream',function(done){
    var f = fs.createWriteStream(output);

    f.on('finish',function(){
      fs.readFile(this.path,function(err,data){
        var t = ''+data;
        t.should.be.eql("これ は テキスト です");
        done();
      })
    });

    var rs = fs.createReadStream(__dirname+'/utf-8.txt')
    rs.pipe(mecapi).pipe(f);
  });

  after(function(done){
    fs.unlink(output,done);
  });
});