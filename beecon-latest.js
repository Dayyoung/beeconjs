 /* 
 BeeconJS JavaScript Library v0.1.3
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
  this.data = null;
}

var BeeButton = function(mark,action) {
  this.mark = mark;
  this.action = action;
}

Bee.prototype.addButton = function(position,mark,action)
{
  this.buttonList[position-1]= new BeeButton(mark,action);
}

Bee.prototype.addData = function(data)
{
  this.data= data;
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

function sayBeeCallback(BEECODE , sendFunction)
{  
    var functionName = getFunctionName(sendFunction);    
    var functionParam = getFunctionParam(sendFunction);
    var functionCall = getFunctionCall(functionName,functionParam);
    socket.emit('sayBeeCallback', {'BEECODE' : BEECODE , 'functionCall': functionCall});
}

function clickBee(BEECODE,postion)
{    
    socket.emit('clickBee', { 'click' : postion  , 'BEECODE' : BEECODE});
}

function heyBee(BEECODE,hey)
{    
    socket.emit('heyBee', { 'hey' : hey  , 'BEECODE' : BEECODE});
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
var scriptParam = getParams("beecon-");
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
  {
    if(!scriptParam.bee)
      createConnection();
    else
      createConnectionByBee();
  }
    
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
  if(!scriptParam.bee)
    createConnection();
  else
    createConnectionByBee();
      
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
          error:function(request,status,error){alert('fail to load!1');} 
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
          error:function(request,status,error){alert('fail to load!2');} 
  });
}

function getBEECODE(initBee)
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
                 initBee(data.result.BEECODE);              
          },
          error:function(request,status,error){alert('fail to load3!');} 
  });
}

function getBEECODEList(BEECODE1,getBee)
{
var BEECODEList = [];  

$.ajax({
        url     : ServerUrl+""+'/getBEECODEList',
        dataType : 'jsonp',
        jsonp : 'callback',
        data    : {'BEECODE': BEECODE1 },
        type    : 'get',
        timeout: 5000,
        success : function(data) {     
               getBee(data.result.BeeList);
        },
        error:function(request,status,error){alert('fail to load!4');} 
});
}

function popupPhone(url) {
  newwindow=window.open(url,'name','height=600,width=350');
  if (window.focus) {newwindow.focus()}
  return false;
} 

function createConnection(BEECODE){

socket = io.connect(ServerUrl,{'forceNew':true });

socket.on('connect', function (data) {  

    try{  
      serverOn(ServerUrl);
    }
    catch(e){}
    
    var initBee = function (BEECODE)
    {
      try{
        onRecivedBeecode(BEECODE);
      }
      catch(e){}
      
      for(var i  in Bees)
      {
        Bees[i].BEECODE = BEECODE+""+Bees[i].key;
        socket.emit('makeBee', {'roomName': Bees[i].BEECODE , "roomTitle" : Bees[i].url , "master":true}); 
  
        if(scriptParam.badge)
        {
          var TopMargin = 250 + (100*i);
          var goUrl = ServerUrl+"/bee/"+Bees[i].BEECODE;
          $(document.body).append('<div onclick=popupPhone("'+goUrl+'") style="width:70px;height:70px;margin-top:'+TopMargin+'px;position: fixed;right:0;" ><center><img style="width:60px;height:55px;" src="'+ServerUrl+'/img/beebanner.png"></img><br><font color="red" size="1">'+Bees[i].url+'</font></center></div>');
        }
      }
    };

  if(BEECODE)
    initBee(BEECODE);
  else
    getBEECODE(initBee);
  
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
      socket.emit('initBee', {'TOBEE': data.TOBEE, 'BEECODE': data.BEECODE , 'Bee' : Bee });
  });
  
  socket.on('disconnect', function (data) {  
  try{  
    serverOff();
  }
  catch(e){}
  });
});

}

  
function createConnectionByBee(BEECODE)
{
  
  socket = io.connect(ServerUrl , {'forceNew':true });

  socket.on('connect', function (data) {


    try{  
      serverOn(ServerUrl);
    }
    catch(e){}

    try{
      onSearchBee();
    }
    catch(e){}
    
    var initBee = function (BEECODE)
    {
      try{
        onRecivedBeecode(BEECODE);
      }
      catch(e){}
      
       var getBee = function(BEECODEList){
        
        if(BEECODEList.length==0)
        {
          try{
          onNoBee();
          }
          catch(e){}      
        }
        
        for(var i in BEECODEList)
        {  
          var BEECODEItem = BEECODEList[i].split("/");
          socket.emit('getBee', { 'TOBEE' : socket.io.engine.id , 'FROMBEE' : BEECODEItem[1] , 'BEECODE' : BEECODEItem[0]}); 
        }      
      };  
      getBEECODEList(BEECODE,getBee);
    };

    if(BEECODE)
      initBee(BEECODE);
    else
      getBEECODE(initBee);

    socket.on('initBee', function (data) {
      
        try{
        onFindBee(data.Bee);
        }
        catch(e){}
        var Bee = data.Bee; 
        
    });      

    socket.on('sayBee', function (data) {     
      var functionCall = data.functionCall;                
      var functionData = data.functionData;
      functionData = functionData.replace("_BEECODE_" , data.BEECODE);

      eval(functionData);
      eval(functionCall);
    });

    socket.on('clickBee', function (data) {
    
      //For IE
      var BEECODE = data.BEECODE;
      var click = parseInt(data.click);
    
      try{
        onClickedBee(BEECODE,click);
        }
        catch(e){}
    });    

    socket.on('heyBee', function (data) {
    
      var BEECODE = data.BEECODE;
      var hey = data.hey;
    
      try{
        onHeyBee(BEECODE,hey);
        }
        catch(e){}
    });    
    
    socket.on('disconnect', function (data) {
      try{  
        serverOff();
      }
      catch(e){}
      });    
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