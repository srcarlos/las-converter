    // Incio del Convertidor las

var well_attr = {
  
  index:0,
  mnem: "",
  units: "",
  data: "",
  description:"",
  type: ""

};

var well = {};

well.v_attr=[];
well.w_attr=[];
well.c_attr=[];
well.p_attr=[];
well.w_data=[];
well.flush_data = function () {
        this.v_attr=[];
        this.w_attr=[];
        this.c_attr=[];
        this.p_attr=[];
        this.w_data=[];
}
well.addsAttr = function (index,mnem,units, data, description, type) {
  var attr = {

    index:index,
    mnem: mnem,
    units: units,
    data: data,
    description:description,
    type: type

  };

  if (type=="V"){
    this.v_attr.push(attr); 
  } else if (type=="W"){
    this.w_attr.push(attr); 
  } else if (type=="C"){
    this.c_attr.push(attr); 
  } else if (type=="P"){
    this.p_attr.push(attr); 
  }
  
}

well.addData = function (data) {

  this.w_data.push(data);
};

well.getData = function () {

  return  this.w_data;
};
well.getAllAttr = function () {

   return  this.v_attr;
};

well.getAttrsByType = function (type) {

  if (type=="V"){
  return  this.v_attr;  
  } else if (type=="W"){
  return  this.w_attr;    
  }else if (type=="C"){
  return  this.c_attr;    
  }else if (type=="P"){
  return  this.p_attr;    
  }
  
};

well.print_version = function () {
  var attr = this.getAllAttr();
  for (var i = 0; i < attr.length; i++) {
    console.log(attr[i]);
  }
};

well.print_section = function (type) {
  //  print in file version
  var attr = this.getAttrsByType(type);
  logs.write('~'+type+'\r\n') ;
  for (var i = 0; i < attr.length; i++) {
  var row = attr[i].mnem+'.    '+attr[i].units+'     '+attr[i].data+':     '+attr[i].description+'\r\n';
  logs.write(row) ;
  }
  logs.end();
}

well.space= function (str,l) {
  var n = str.length;
  var total = parseInt(l - n);
   if (total>0){
      var spaces = "";
      for (var i = 0; i <1; i++) {
          spaces+="\t";
      }
      return spaces;
   }else {
    return "";
   }
}
well.print_file = function (name,res,callback) {
  var sections = ['V', 'W','C','A'];
  var fs = require('fs')
  var logs = fs.createWriteStream( 'files/las/'+name+'.las', {
  //  flags: 'a',
    defaultEncoding: 'utf8'
  })
  for (var s = 0; s < sections.length; s++) {
   if (sections[s]=='A') {
        var data = this.getData(sections[s]);
      logs.write('~' + sections[s] + '\r\n');

      for (var i = 0; i < data.length; i++) {
        var row = "";
        for (var d = 0; d < data[i].length; d++) {
         row+="\t"+data[i][d]+"\t";
       }
        logs.write(row+ '\r\n');
      } 
   }
    if (sections[s]!='A') {
    var attr = this.getAttrsByType(sections[s]);
    logs.write('~' + sections[s] + '\r\n');
    for (var i = 0; i < attr.length; i++) {
    var row = attr[i].mnem+ '\t.';
           row =row + attr[i].units  +'\t\t';
           row =row + attr[i].data  + '\t\t\t\t: ' 
           row =row + attr[i].description + '\r\n';

    logs.write(row);
    }
    }
  }
  well.flush_data();
  logs.end();
  return callback(res);
}
module.exports = well;