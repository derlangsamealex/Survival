var game;
var boostmove=1;
var menu1,menu2,menu3,menu3_1,menu3main,colorbox,movebtn,movestick,btnA,btnB,invbtn,inv,control;
window.onload = function() {
  menu1=document.getElementById("startmenu");
  menu2=document.getElementById("createcharactermenu");
  menu3=document.getElementById("gamemenu");
  menu3_1=document.getElementById("subgamemenu1");
  menu3main=document.getElementById("subgamemenumain");
  control=document.getElementById("subgamemenucontrol");
  colorbox=document.getElementById("colorbox");
  movebtn=document.getElementById("movebtn");
  movestick=document.getElementById("movestick");
  invbtn=document.getElementById("inv");
  inv=new DragBox(menu3,0,60,100,15,20,100);
  inv.box.style.display="none";
  inv.createDropBox(menu3,58,76,16,10);
  invbtn.addEventListener("click", function() {
    if(inv.box.style.display=="none") {
      inv.box.style.display="inline";   
    } 
    else {
      inv.box.style.display="none";     
    }
  },false);
  movebtn.addEventListener("touchstart",function() {
    movebtn.addEventListener("touchmove",fcmovebtn,false),
    false});
  movebtn.addEventListener("touchend",function() {
    lvl.player[0].speed=0;
    svgChgProp(movestick,{cx:"50%",cy:"50%"});
  },false);
  btnA=document.getElementById("button1");
  btnA.addEventListener("touchstart",pressbtn,false);
  btnB=document.getElementById("button2");
  btnB.addEventListener("touchstart",pressbtn,false);
  //second menu
  colorbox.onchange = function() {
    document.getElementById("circle").setAttribute('fill', colorbox.value);
  }
}
onkeydown = function(event) {
	switch(event.key) {
		case "ArrowUp":
			lvl.player[0].calcspeed(1);	
			lvl.player[0].calcdirection(0, -1);
		break;
		case "ArrowLeft":
			lvl.player[0].calcspeed(1);	
			lvl.player[0].calcdirection(-1, 0);
		break;
		case "ArrowDown":
			lvl.player[0].calcspeed(1);	
			lvl.player[0].calcdirection(0, 1);
		break;
		case "ArrowRight":
			lvl.player[0].calcspeed(1);	
			lvl.player[0].calcdirection(1, 0);
		break;
		case " ":
			lvl.player[0].shoot();
		break;
	}
}
onkeyup = function() {
	switch(event.key) {
		case "ArrowUp":
			lvl.player[0].calcspeed(0);	
		break;
		case "ArrowLeft":
			lvl.player[0].calcspeed(0);	
		break;
		case "ArrowDown":
			lvl.player[0].calcspeed(0);	
		break;
		case "ArrowRight":
			lvl.player[0].calcspeed(0);	
		break;
	}
}
//-----------after firstmenu----------
function startbtn() {
  menu1.style.display="none";
  menu2.style.display="inline-block";
}
//initialisiert das Spiel
//------- after secondmenu----------
//control player button function
function fcmovebtn(evt) {
  evt.preventDefault();
  if(evt.targetTouches.length==1) {
    let x=evt.targetTouches[0].clientX;
    let y=evt.targetTouches[0].clientY;
    let dx=x-elmntData(this).x;
    let dy=y-elmntData(this).y;
    let da=(Math.sqrt(Math.pow((x-elmntData(this).midx),2)+Math.pow((y-elmntData(this).midy),2))/2)/elmntData(this).rx;
    lvl.player[0].calcspeed(da*boostmove);
    lvl.player[0].calcdirection((x-elmntData(this).midx),(y-elmntData(this).midy));
    svgChgProp(movestick,{cx:dx+"px",cy:dy+"px"});
    if(Math.sqrt(Math.pow((x-elmntData(this).midx),2)+Math.pow((y-elmntData(this).midy),2))>=elmntData(this).rx) {
      this.removeEventListener("touchmove",fcmovebtn,false);
      svgChgProp(movestick,{cx:"50%",cy:"50%"});
      lvl.player[0].speed=0;
    }
  }
}
function pressbtn() {
  this.value=1;
  this.style.borderStyle="inset";
  this.addEventListener("touchmove",btnpressed,false);
  this.addEventListener("touchend",btnreleased,false);
}
function btnpressed(evt) {
  evt.preventDefault();
  if(evt.targetTouches.length==1) {
    let x=evt.targetTouches[0].clientX;
    let y=evt.targetTouches[0].clientY;
    if(Math.sqrt(Math.pow((x-elmntData(this).midx),2)+Math.pow((y-elmntData(this).midy),2))>=elmntData(this).rx) {
      simulateTouch(this,"touchend");
      this.removeEventListener("touchmove",btnpressed,false);
      this.removeEventListener("touchend",btnreleased,false);
    }
  }
}
function btnreleased() {
  this.value=0;
  this.style.borderStyle="outset";
}
function initgame() {
  menu2.style.display="none";
  menu3.style.display="inline-block";
  lvl=new MainObj(menu3main,1000,1000);
  lvl.setPlayer(colorbox.value,1,1);
  //Object for movebutton includes information about the movebutton
  elmntData(movebtn); //I don't know why but without this the program doesn't work
  lvl.start();
}
//main function
//all game animation
function game() {
  btnA.value>=1?btnA.value++:void(0);
  btnB.value>=1?btnB.value++:void(0);
  btnA.value%25===10?lvl.player[0].shoot():void(0);
  btnB.value>0?boostmove=3:boostmove=1;
}
//simulate a click on target element
function simulateClick(target)
{
  let evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: false,
    view: window
  });
  target.dispatchEvent(evt);
}
//simulate a touchEvent on target element of the specific type(touchstart,touchend)
function simulateTouch(target,type)
{
  let evt = new TouchEvent(type, target.targetTouches);
  target.dispatchEvent(evt);
}
//input htmlelement, output an object width htmlelementdata
function elmntData(elmnt) {
  let left=elmnt.getBoundingClientRect().left;
  let top=elmnt.getBoundingClientRect().top;
  let width=elmnt.getBoundingClientRect().width;
  let height=elmnt.getBoundingClientRect().height;
  let rx=width/2;
  let ry=height/2;
  let midx=left+rx;
  let midy=top+ry;
  output={x:left,y:top,width:width,height:height,rx:rx,ry:ry,midx:midx,midy:midy};
  return output;
}