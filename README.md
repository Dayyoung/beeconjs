beeconjs
=========
BeeconJS - remote control javascript library

 BeeconJS Java Library v0.0.1
 http://beeconjs.com/
 
 Copyright 2015, Dayyoung You
 Dual licensed under the MIT or GPL Version 2 licenses.
 Visit http://beeconjs.com/license 
 
This is  BeeconJS Javascript Library for web. 

## Installation

		<div class="container"><div class="line"><code><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"http://code.jquery.com/jquery-1.11.1.min.js"</span>&gt;</span><span class="javascript"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></code></div></div>

		<div class="container"><div class="line"><code><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"http://beeconjs.com/socket.io/socket.io.js"</span>&gt;</span><span class="javascript"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></code></div></div>

		<div class="container"><div class="line"><code><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"http://beeconjs.com/lib/beecon-0.1.0.js"</span>&gt;</span><span class="javascript"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></code></div></div>

		<br>
		<div class="container"><div class="line"><code><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"http://beeconjs.com/lib/beecon-0.1.0.js&#63;<font color="red">region=asia</font>"</span>&gt;</span><span class="javascript"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></code></div></div>
		<font color="red">//this is strict option to asia region.</font>

		<br>
		<div class="container"><div class="line"><code><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"http://beeconjs.com/lib/beecon-0.1.0.js&#63;<font color="red">badge=true</font>"</span>&gt;</span><span class="javascript"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></code></div></div>
		<font color="red">//this is badge option to display icon.</font>

## Usage
		

var BeeconBee = new Bee('BeeconJS.com',1);
//inflate Bee.

var BEEIMG = $('#beeImg');
//select image object. 

BeeconBee.addButton(1,"B",function(){  
  BEEIMG.attr('src', "/img/bee1.png");
});
//add button1 to change image. 

BeeconBee.addButton(2,"E",function(){  
  BEEIMG.attr('src', "/img/bee2.png");
});
//add button1 to change image.

BeeconBee.addButton(3,"E",function(){  
  BEEIMG.attr('src', "/img/bee3.png");
});
//add button1 to change image.
	
		
## Features

http://www.beeconjs.com/api

## License

Dual licensed under the MIT or GPL Version 2 licenses.
 
