 /* 
 BeeconJS JavaScript Library v0.1.0
 http://beeconjs.com/
 
 Copyright 2015, Dayyoung You
 Dual licensed under the MIT or GPL Version 2 licenses.
 Visit http://beeconjs.com/license 
 */
var Bees = [];
var Bee = function (url, key) {
  this.url = url;
  this.key = key;
  this.BEECODE = null;
  this.buttonList = [];
  Bees.push(this);
}

var BeeButton = function(mark,action) {
  this.mark = mark;
  this.action = action;
}

Bee.prototype.addButton = function(position,mark,action)
{
  this.buttonList[position-1]= new BeeButton(mark,action);
}

function getBeeByBEECODE(BEECODE)
{
  var getBee;
  for(i in Bees)
  {
    if(Bees[i].BEECODE==BEECODE)
    { 
      getBee = Bees[i];
    }
  }
  return getBee;
}

function getFunctionName(ret) {
  //var ret = fun.toString();
  //ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function getFunctionParam(ret) {
  ret = ret.substr('function '.length);
  ret = ret.substr(ret.indexOf('('),ret.indexOf(')'));  
  ret = ret.replace('(','');
  ret = ret.replace(')','');
  return ret;
}

function getFunctionCall(functionName, functionParam) {
  var ret = functionName+"('"+functionParam+"')";
  return ret;
}

function sayBee(BEECODE , sendFunction)
{  
    var functionName = getFunctionName(sendFunction);    
    var functionParam = getFunctionParam(sendFunction);
    var functionCall = getFunctionCall(functionName,functionParam);
    var functionData = String(eval(functionName));
    //var stringFuntion = String(functionData);
    socket.emit('sayBee', {'BEECODE': BEECODE , 'functionCall': functionCall ,'functionData': functionData });
}

//getParams("beecon.js");
// Extract "GET" parameters from a JS include querystring
function getParams(script_name) {
  // Find all script tags
  var scripts = document.getElementsByTagName("script");
  // alert(scripts[5].src);
  
  // Look through them trying to find ourselves
  for(var i=0; i<scripts.length; i++) {
    if(scripts[i].src.indexOf("/" + script_name) > -1) {
      // Get an array of key=value strings of params
      var pa = scripts[i].src.split("?").pop().split("&");

      // Split each key=value into array, the construct js object
      var p = {}; 
      for(var j=0; j<pa.length; j++) {
        var kv = pa[j].split("=");
        p[kv[0]] = kv[1];
      }
      //alert(JSON.stringify(p));
      return p;
    }
  }  
  // No scripts match
  return {};
}
/*
* SERVERSIDE
* not recomend edit this part for good working. 
* structure is so complecated on chain functions.
*/

var socket;
var scriptParam = getParams("beecon");
var BaseUrl = "http://www.beeconjs.com";  
var ServerUrl = "http://www.beeconjs.com";

if(scriptParam.region=="asia")
{
var BaseUrl = "http://183.97.66.155";  
var ServerUrl = "http://183.97.66.155";
}
if(scriptParam.debug)
{
var BaseUrl = "http://192.168.0.38";  
var ServerUrl = "http://192.168.0.38";
}

var BestList = [];
var LIMITTIME = 3000;

$(function() {
  if(scriptParam.region=="asia")
    getBEESERVERList(findBestSever);  
  else    
    createConnection();
});

function findBestSever(BEESERVER)
{
  for(var i in BEESERVER)
  {
    getTimeOut(BEESERVER[i]);
  }

  setTimeout(function(){  
    
  var min = LIMITTIME;      

  jQuery.map(BestList, function (obj) {
    if (obj.time < min)
    {
      min = obj.time;
      ServerUrl = obj.url;
    }
  }); 
  //alert(ServerUrl);
  createConnection();

  try{
    onFindServer();
    }
    catch(e){}

  }, LIMITTIME);  
}

function getBEESERVERList(findBestSever)
{
  try{
    onSearchServer();
    }
    catch(e){}

  var BEESERVER = 0;
  $.ajax({
          url     : BaseUrl+""+'/getBEESERVERList',
          data    : {},
          type    : 'post',
          timeout: 5000,
          dataType : 'jsonp',
          jsonp : 'callback',
          success : function(data) {
                 BEESERVER=data.result.BeeServerList;      
                 findBestSever(BEESERVER);            
          },
          error:function(request,status,error){alert('fail to load!');} 
  });
  return BEESERVER;
}

function getTimeOut(TestUrl)
{
  var nowTime= new Date().getTime();
  $.ajax({
          url     : TestUrl+""+'/getBEESERVERList',
          type    : 'post',
          timeout: 5000,
          dataType : 'jsonp',
          jsonp : 'callback',
          success : function(data) {
                var time = new Date().getTime()-nowTime;   
                //console.log(TestUrl+ ">>>"+time);
                BestList.push({url:TestUrl,time:time});       
          },
          error:function(request,status,error){alert('fail to load!');} 
  });
}

function getBEECODE(initBee,position)
{
  $.ajax({
          url     : ServerUrl+""+'/getBEECODE',
          data    : {},
          dataType : 'jsonp',
          jsonp : 'callback',
          type    : 'post',
          timeout: 5000,
          success : function(data) {
                 //alert(data.result.BEECODE);  
                 initBee(data.result.BEECODE,position);              
          },
          error:function(request,status,error){alert('fail to load!');} 
  });
}

function popupPhone(url) {
  newwindow=window.open(url,'name','height=600,width=350');
  if (window.focus) {newwindow.focus()}
  return false;
} 

function createConnection(){

socket = io.connect(ServerUrl,{'forceNew':true });

socket.on('connect', function (data) {         

  try{  
    serverOn(ServerUrl);
  }
  catch(e){}
  
  for(var i  in Bees)
  {
    var initBee = function (BEECODE,position)
    {  
      try{
        onRecivedBeecode(BEECODE);
        }
        catch(e){}
      Bees[position].BEECODE = BEECODE+""+Bees[position].key;
      socket.emit('makeBee', {'roomName': Bees[position].BEECODE , "roomTitle" : Bees[position].url , "master":true}); 

      if(scriptParam.badge)
      {
        var TopMargin = 250 + (100*position);
        var goUrl = ServerUrl+"/bee/"+Bees[position].BEECODE;
        $(document.body).append('<div onclick=popupPhone("'+goUrl+'") style="width:70px;height:70px;margin-top:'+TopMargin+'px;position: fixed;right:0;" ><center><img style="width:60px;height:55px;" src="'+ServerUrl+'/img/beebanner.png"></img><br><font color="red" size="1">'+Bees[position].url+'</font></center></div>');
      }
    };
    getBEECODE(initBee,i);
  }

});
  socket.on('disconnect', function (data) {  
  try{  
    serverOff();
  }
  catch(e){}
});

socket.on('clickBee', function (data) {

  //For IE
  var BEECODE = data.BEECODE;
  var click = parseInt(data.click);

  var MyBee = getBeeByBEECODE(BEECODE);
  
  try{
     MyBee.buttonList[click-1].action();
  }
  catch(e){}

});

socket.on('sayBeeCallback', function (data) {
  eval(data.functionCall);
});

socket.on('getBee', function (data) {   

    try{
       OnGetBee();
    }
    catch(e){}
    var Bee = getBeeByBEECODE(data.BEECODE);
    //var buttonList = Bee.buttonList;
    //alert(JSON.stringify(Bee));
    socket.emit('initBEE', {'TOBEE': data.TOBEE, 'BEECODE': data.BEECODE , 'Bee' : Bee });
});
}

/*
For ChromeCast
For Ebook
For MusicBoard
For Cafeteria
For Education
For JukeBox

Many Bees in One Screen
Can Delete Bee.
Add Bee
*/