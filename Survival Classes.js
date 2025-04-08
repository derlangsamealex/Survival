class Myfunction { 
  static getnumbers(string) {
    let output=[];
    let j=0;
    for(var i=0;i<string.length;i++) {
      output[j]="";
      while (!isNaN(string.charAt(i))||string.charAt(i)=="-"&&string.charAt(i)!=" "&&i<string.length) {
        output[j]+=string.charAt(i);
        i++;
      }  
      if (output[j]!=="") {
        output[j]=parseInt(output[j]);
        j++;
      }
    }
    return output;
  }
}      
function Menu(parent) {
  this.parent=parent;
  this.button=[];
  this.dragBox=[];
  this.addButton=function(obj) {
    this.button.push(new Button(this.parent,obj));
  }
  this.addDragBox=function(left,top,width,height,fieldwidth,fieldheight) {
    this.dragBox.push(new DragBox(this.parent,left,top,width,height,fieldwidth,fieldheight));
  }
  this.addMoveStick=function(left,top,fieldRad,fiedRad) {
    this.moveStick=new MoveStick(this.parent,left,top,fieldRad,fiedRad);
  }
}
function DragBox(parent,left,top,width,height,fieldwidth,fieldheight) {
  this.img=[];
  this.dropBox=[];
  this.button=[];
  this.parent=parent;
  this.box=document.createElement("div");
  this.box.style.color="white";
  this.box.style.position="absolute";
  this.box.style.left=left+"px";
  this.box.style.top=top+"px";
  this.box.style.width=width+"px";
  this.box.style.height=height+"px";
  this.box.style.border="1px solid";  
  this.box.style.overflow="hidden";    
  this.parent.appendChild(this.box);
  this.picked=false;
  this.handleEvent = function(evt) { 
    if(this.picked) {
      switch(event.type) {
        case "touchmove":
          if(evt.targetTouches.length==1&&(evt.targetTouches[0].clientX<=width+left+1&&evt.targetTouches[0].clientX>=left+1)&&(evt.targetTouches[0].clientY<=height+top+1&&evt.targetTouches[0].clientY>=top+1)) {
            this.box.scrollLeft=this.box.scrollLeft+(this.touchPosX-evt.targetTouches[0].clientX);
            this.touchPosX=evt.targetTouches[0].clientX;
          }
          else {
            this.picked=false;
          }
        break;
      }
    }
    else {
      switch(event.type) {
        case "touchstart":
          this.touchPosX=evt.targetTouches[0].clientX;
          this.picked=true;
        break;
      }    
    }
  }
  this.box.addEventListener("touchmove",this,false);
  this.box.addEventListener("touchstart",this,false);
  this.add=function(src) {
    this.img.push(new DragElmnt(this,this.img.length,0,fieldwidth,fieldheight,src));  
  }  
  this.createDropBox=function(x,y,width,height) {
    this.dropBox.push(new DropBox(this.parent,x,y,width,height));
  }
  this.addDropBox=function(element) {
    this.dropBox.push(element);
  }
  this.addButton=function(obj) {
    this.dropBox.push(new Button(this.parent,obj));
  }
}
function DropBox(parent,left,top,width,height) {
  this.box=document.createElement("div");
  this.box.style.color="white";
  this.box.style.left=left+"px";
  this.box.style.top=top+"px";
  this.box.style.width=width+"px";
  this.box.style.height=height+"px";
  this.box.style.position="absolute";
  this.box.style.border="1px solid";  
  parent.appendChild(this.box);
  this.img=document.createElement("img");
  this.box.appendChild(this.img);
  return this.box;
}
function DragElmnt(dragbox,xpos,ypos,fieldwidth,fieldheight,src) {  
  this.xpos=xpos;
  this.ypos=ypos;
  this.dragBox=dragbox;
  this.picked=false;
  this.dropped=false;
  this.pressedTouch=undefined;
  this.img=document.createElement("img");
  this.img.src=src;  
  this.img.style.color="white";
  this.img.style.left=xpos*fieldwidth+"px";
  this.img.style.top=ypos*fieldheight+"px";
  this.img.style.width=fieldwidth+"px";
  this.img.style.height=fieldheight+"px";
  this.img.style.position="absolute";
  this.img.style.border="1px solid";
  this.dragBox.box.appendChild(this.img);
  this.handleEvent = function(evt) {
    if(this.picked) {
      switch(event.type) {
        case "touchmove":
          this.touchposX=evt.targetTouches[0].clientX;
          this.touchposY=evt.targetTouches[0].clientY;
          this.clone.style.left=this.touchposX-this.clone.clientWidth/2+"px";
          this.clone.style.top=this.touchposY-this.clone.clientHeight/2+"px";
          break;
        case "touchend":
          this.dropimg();
          break;
      }  
    } 
    else {
      switch(event.type) {
        case "touchstart":
          this.pressedTouch=evt.targetTouches[0].identifier;
          this.timeout=setTimeout(this.pickimg.bind(this),100);
          this.touchposX=evt.targetTouches[0].clientX;
          this.touchposY=evt.targetTouches[0].clientY;
          break;
        case "touchmove":
          if(evt.targetTouches.length==1) {
            if(evt.targetTouches[0].clientX<=this.touchposX-2||evt.targetTouches[0].clientX>=this.touchposX+2||evt.targetTouches[0].clientY<=this.touchposY-2||evt.targetTouches[0].clientY>=this.touchposY+2) {
              clearTimeout(this.timeout);     
            }

          }
          break;
        case "touchend":
          if(evt.targetTouches.length==1&&evt.changedTouches.length==1) {
            clearTimeout(this.timeout);
          }
          break;
      }
    }
  };
  this.img.addEventListener('touchstart',this,false);
  this.img.addEventListener("touchmove",this,false);
  this.img.addEventListener("touchend",this,false);
  this.pickimg=function() {
    this.clone=this.img.cloneNode(true);
    this.clone.style.color="orange";
    this.picked=true;
    this.dropped=false;
    document.body.appendChild(this.clone);
    this.clone.style.zIndex=999999;
    this.clone.style.left=this.img.offsetLeft-dragbox.box.scrollLeft+"px";
  }
  this.dropimg=function() {
    for(let obj of this.dragBox.dropBox) {
      this.clone.style.color="white";  

      if(this.touchposX>=obj.offsetLeft&&this.touchposX<=obj.offsetLeft+obj.clientWidth&&this.touchposY>=obj.offsetTop&&this.touchposY<=obj.offsetTop+obj.clientHeight) {
        obj.removeChild(obj.children[0]);
        obj.appendChild(this.clone);
        this.clone.style.left=0;
        this.clone.style.top=0;
        this.clone.style.width=obj.clientWidth+"px";
        this.clone.style.height=obj.clientHeight+"px";
        this.clone.style.border=0; 
        this.dropped=true;
        break;
      }
      else if(!this.dropped) {
        document.body.removeChild(this.clone);
        this.dropped=true;
      }
    }
    this.picked=false;
  }
}
function Button(parent,obj) {
  this.pressed=false;
  this.button=document.createElement("div");
  parent.appendChild(this.button); 
  for(let prop in obj) {
    this.button.style[prop]=obj[prop];
  }
  this.button.style.textAlign="center";
  this.btnBorder=parseInt(this.button.style.border);
  this.btnRad=this.button.clientWidth/2+this.btnBorder;  
  this.btnX=this.button.offsetLeft+this.btnRad;
  this.btnY=this.button.offsetTop+this.btnRad;
  this.button.style.fontSize=this.button.clientWidth/2*1.7+"px";
  this.pressedTouch=undefined;
  this.button.style.overflow="hidden";
  this.img=document.createElement("img");
  this.button.appendChild(this.img); 
  this.handleEvent = function(evt) {
    let x,y; 
    if(this.pressed) {
      switch(event.type) {
        case "touchmove":
          for(let targetTouch of evt.changedTouches) {
            if(targetTouch.identifier==this.pressedTouch) {  

              x=targetTouch.clientX;
              y=targetTouch.clientY;
              if(Math.sqrt((x-this.btnX)**2+(y-this.btnY)**2)>=this.btnRad) {
                this.pressedTouch=undefined;
                this.btnreleased();
              }
            }
          }
          break;
        case "touchend":
          for(let targetTouch of evt.changedTouches) {
            if(targetTouch.identifier==this.pressedTouch) {  
              this.pressedTouch=undefined;
              this.btnreleased();
            }
          }
          break;
        case "touchcancel":
          console.log("cancel");
      }  
    } 
    else {
      switch(event.type) {
        case "touchstart":
          evt.preventDefault(); 
          this.pressedTouch=evt.targetTouches[0].identifier;
          this.btnpressed();
          break;
        case "touchmove":
          for(let targetTouch of evt.touches) {
            x=targetTouch.clientX;
            y=targetTouch.clientY;
            if(Math.sqrt((x-this.btnX)**2+(y-this.btnY)**2)<this.btnRad) {
              this.pressedTouch=targetTouch.identifier;
              this.btnpressed();
            }
          }
          break;
      }
    }
  };
  this.button.addEventListener('touchstart',this,false);
  addEventListener("touchmove",this,false);    
  addEventListener("touchend",this,false);
  this.btnreleased=function() {
    this.pressed=false;
    this.button.style.borderStyle="inset";      
  }
  this.btnpressed=function(evt) {
    this.pressed=true;
    this.button.style.borderStyle="outset"; 
  }
  return this.button;
}
function MoveStick(parent,left,top,fieldRad,stickRad) {
  this.pressed=false;
  this.left=left+parent.offsetLeft;
  this.top=top+parent.offsetTop;
  this.fr=fieldRad;
  this.sr=stickRad;
  this.direction=0;
  this.svg=new SvgElement("svg",{
    width:fieldRad*2,
    height:fieldRad*2
  })
  cssChgProp(this.svg,{
    position:"absolute", 
    left:left+"px",
    top:top+"px"
  });
  parent.appendChild(this.svg);
  this.field=new SvgElement("circle",{
    cx:"50%",
    cy:"50%",
    r:"50%",
    fill:"#444444"
  }) 
  this.stick=new SvgElement("circle",{
    cx:"50%",
    cy:"50%",
    r:stickRad/fieldRad*50+"%",
    fill:"#888888"
  })
  this.svg.appendChild(this.field); 
  this.svg.appendChild(this.stick);
  this.pressedTouch=undefined;
  this.handleEvent = function(evt) {
    let clientX,clientY; 
    if(this.pressed) {
      switch(event.type) {
        case "touchmove":
          for(let targetTouch of evt.changedTouches) {
            if(targetTouch.identifier==this.pressedTouch) {  
              clientX=targetTouch.clientX;
              clientY=targetTouch.clientY;
              if(Math.sqrt((clientX-this.left-this.fr)**2+(clientY-this.top-this.fr)**2)<this.fr-this.sr) {
                this.moveStick((clientX-this.left)/this.fr*50,(clientY-this.top)/this.fr*50);
              }
              else if(Math.sqrt((clientX-this.left-this.fr)**2+(clientY-this.top-this.fr)**2)<this.fr) {
                this.direction=calcDirection(clientX-this.left-this.fr,clientY-this.top-this.fr);
                this.moveStick(Math.sin(this.direction)*(this.fr-this.sr)/this.fr*50+50,Math.cos(this.direction)*(this.fr-this.sr)/this.fr*50+50);
              }
              else {
                this.moveStick(50,50);
                this.pressedTouch=undefined;
                this.pressed=false;
              }
            }
          }
          break;
        case "touchend":
          for(let targetTouch of evt.changedTouches) {
            if(targetTouch.identifier==this.pressedTouch) {  
              this.moveStick(50,50);
              this.pressedTouch=undefined;
              this.pressed=false;
            }
          }
          break;
      }  
    } 
    else {
      switch(event.type) {
        case "touchstart":
          evt.preventDefault(); 
          this.pressedTouch=evt.targetTouches[0].identifier;
          clientX=evt.targetTouches[0].clientX;
          clientY=evt.targetTouches[0].clientY;
          this.moveStick((clientX-this.left)/this.fr*50,(clientY-this.top)/this.fr*50);
          this.pressed=true;;
          break;
        case "touchmove":
          for(let targetTouch of evt.touches) {
            clientX=targetTouch.clientX;
            clientY=targetTouch.clientY;
            if(Math.sqrt((clientX-this.left-this.fr)**2+(clientY-this.top-this.fr)**2)<this.sr) {
              this.pressedTouch=targetTouch.identifier;
              this.moveStick((clientX-this.left)/this.fr*50,(clientY-this.top)/this.fr*50);
              this.pressed=true;
            }
          }
          break;
      }
    }
  };
  this.stick.addEventListener('touchstart',this,false);
  addEventListener("touchmove",this,false);    
  addEventListener("touchend",this,false); 
  this.moveStick=function(x,y) {
    this.direction=calcDirection(x-50,y-50);
    this.delta=Math.sqrt((x-50)**2+(y-50)**2)/(this.fr-this.sr)*2;
    //textarea.value=this.direction/Math.PI*180+":\n"+this.delta;
    svgChgProp(this.stick,{
      cx:x+"%",
      cy:y+"%"
    })
  }
}
function CanElement(width,height) {
  canvas=document.createElement("canvas");
  canvas.width=width;
  canvas.height=height;
  canvas.style.width=width+"px";
  canvas.style.height=height+"px";
  canvas.style.position="absolute";
  return canvas;
}
//create a svg element with the properties discribed in the obj
//the string stands for specific svg element(circle,point,etc)
function SvgElement(str,obj) {
  var output=document.createElementNS("http://www.w3.org/2000/svg",str);
  for(prop in obj) {
    output.setAttribute(prop, obj[prop]);
  }
  return output;
}
//change resp. give properties to target Svgelement
function svgChgProp(target,obj) {
  for(prop in obj) {
    target.setAttribute(prop, obj[prop]);
  }
}
function MainObj(parent,width,height) {
  this.enemy=[];
  this.player=[];
  this.item=[];
  this.runningTime=0;
  this.parent=parent;
  this.width=width;
  this.height=height;
  this.design=new CanElement(this.width,this.height);
  this.wall=new CanElement(this.width,this.height);
  this.wall.style.display="none";
  parent.appendChild(this.wall);
  parent.appendChild(this.design);
  this.designCtx=this.design.getContext("2d");
  this.wallCtx=this.wall.getContext("2d");
  this.spawnEnemy=function(string,x,y) {
    this.enemy[this.enemy.length]=new Enemy(this,string);
    this.enemy[this.enemy.length-1].position(x,y);
  }
  this.setPlayer=function(color,x,y) {
    this.player[this.player.length]=new Player(this,20,20,color);
    this.player[this.player.length-1].position(x,y);  //x,y (xy <1 causes bugs)
  }
  this.setPlayerButton=function() {
    //this.player[0]=
  }
  this.buildLvl=function(obj) {
    for(let i in obj) {

    }
  }
  this.dropItem=function(string,x,y) {
    this.item[this.item.length]=new Item(this,string);
    this.item[this.item.length-1].position(x,y);
  }
  this.start=function() {
    this.t=setInterval(this.run.bind(this),20); 
  }
  this.run=function() {
    this.runningTime++;
    for(let obj of this.player) {
      obj.move();
    }
    for(let obj of this.enemy) {
      if(!obj.dead) {
        obj.move();   
      }
    }
    //enemy spawn
    if(this.enemy.length<=50&&this.runningTime%50===0) {
      let x,y,a=0;
      do {
        a++;
        x=(Math.random()*(this.width-50)).toFixed();
        y=(Math.random()*(this.height-50)).toFixed();
      } while (this.wallCtx.getImageData(x-50,y-50,100,100).data.includes(1)||a==100);
      this.spawnEnemy("zombie",parseInt(x),parseInt(y));
    }
  }
}
class Source {
  constructor(world,width,height) {
    this.width=width;
    this.height=height;
    this.rad=this.width/2;
    this.world=world;
    this.parent=world.parent;
    this.wall=world.wallCtx;
    this.svg=new SvgElement("svg",{
      "width":this.width,
      "height":this.height
    });
    this.parent.appendChild(this.svg);
    this.svg.style.position="absolute";
  }
  position(x=0,y=0) {
    this.xpos=x;
    this.ypos=y;
    this.svg.style.left=this.xpos.toFixed()+"px";
    this.svg.style.top=this.ypos.toFixed()+"px";
    this.midx=this.xpos+this.rad;
    this.midy=this.ypos+this.rad;
  }
  calcdirection(dx,dy) {
    if(dx>=0&&dy>=0) {
      this.direction=Math.atan(Math.abs(dx/dy));
    }
    if(dx>=0&&dy<0) {
      this.direction=Math.PI-Math.atan(Math.abs(dx/dy));
    }
    if(dx<0&&dy<0) {
      this.direction=Math.PI+Math.atan(Math.abs(dx/dy));
    }
    if(dx<0&&dy>=0) {
      this.direction=2*Math.PI-Math.atan(Math.abs(dx/dy));
    }
  }
  move() {
    this.dx=Math.sin(this.direction)*this.speed;
    this.dy=Math.cos(this.direction)*this.speed;
    this.position(this.xpos+this.dx,this.ypos+this.dy);
  }
  touchborder() {
    let istouched=false;
    if(this.xpos<0||this.ypos<0||this.xpos+this.width>this.world.width||this.ypos+this.height>this.world.height) {
      istouched=true;
    }
    return istouched;
  }
  //proves if something touches something and returns true
  touch() {
    let istouched=false;
    istouched=this.proofedges();
    //istouched===false?istouched=touchobj.proofinnerrect(touchobj.innerrect()):void(0);
    return istouched;
  }
  touchwall()
  {
    let istouched=false;
    istouched=this.touchborder();
    istouched?void(0):istouched=this.touch();
    return istouched;
  }
  proofedges() {
    let output=false;
    let edges=this.edges();
    for(let arr of edges) {
       if(this.wall.getImageData(Math.floor(arr[0]),Math.floor(arr[1]),1,1).data[0]==1) {
        output=true;
        break;
      }
    }
    return output;
  }
  proofinnerrect(arr) {
  let output=false;
    if(this.wall.getImageData(Math.floor(arr[0]),Math.floor(arr[1]),Math.floor(arr[2]),Math.floor(arr[3])).data.includes(1)) {
      output=true;
    }
    return output;
  }
}
class Player extends Source {
  constructor(world,width,height,color) {
    super(world,width,height);
    this.speed=0;
    this.direction=0;
    this.counter=0;
    this.btn=[];
    this.btn["A"]=0;
    this.btn["B"]=0;
    this.btn[0]=0;
    this.item=[];
    this.weapon="chainLightning";
    this.shots=[];
    this.width=width;
    this.height=height;
    this.color=color;
    this.svg.style.zIndex=12;
    this.circle=new SvgElement("circle",{
      cx:"50%",
      cy:"50%",
      r:"49%",
      stroke:"black",
      strokeWidth:1,
      fill:this.color
    });
    this.eye1=new SvgElement("circle",{
      cx:(Math.sin(this.direction)*25-Math.sin(this.direction+Math.PI/2)*15+50)+"%",
      cy:(Math.cos(this.direction)*25-Math.cos(this.direction+Math.PI/2)*15+50)+"%",
      r:"10%",
      stroke:"black",
      strokeWidth:1,
      fill:"white"
    });
    this.eye2=new SvgElement("circle",{
      cx:(Math.sin(this.direction)*25+Math.sin(this.direction-Math.PI/2)*15+50)+"%",
      cy:(Math.cos(this.direction)*25+Math.cos(this.direction-Math.PI/2)*15+50)+"%",
      r:"10%",
      stroke:"black",
      strokeWidth:1,
      fill:"white"
    });
    this.svg.appendChild(this.circle);
    this.svg.appendChild(this.eye1);
    this.svg.appendChild(this.eye2);
    this.hp=200;
  }
  //provable points to stop at walls and things
  edges() {
    output=[];
    for(let i=0;i<=7;i++) {
      output[i]=[];
      output[i].push(this.midx+this.rad*Math.sin(Math.PI/4*i)); //x-coordinate
      output[i].push(this.midy+this.rad*Math.cos(Math.PI/4*i)); //y-coordinate
    }
    return output;
  }
  //provable area to stop at walls resp.
  innerrect() {
    output=[];
    let delta=this.rad*Math.sin(Math.PI/4);
    output[0]=this.midx-delta; //left-side
    output[1]=this.midy-delta; //top-side
    output[2]=delta; //width
    output[3]=delta; //height
    return output;
  }
  move() {
    super.move();
    this.button();
    svgChgProp(this.eye1,{
      "cx":(Math.sin(this.direction)*25-Math.sin(this.direction+Math.PI/2)*15+50)+"%",
      "cy":(Math.cos(this.direction)*25-Math.cos(this.direction+Math.PI/2)*15+50)+"%"
    });
    svgChgProp(this.eye2,{
      "cx":(Math.sin(this.direction)*25+Math.sin(this.direction+Math.PI/2)*15+50)+"%",
      "cy":(Math.cos(this.direction)*25+Math.cos(this.direction+Math.PI/2)*15+50)+"%"
    });
    this.parent.scrollLeft=this.xpos.toFixed()-this.parent.getBoundingClientRect().width/2;
    this.parent.scrollTop=this.ypos.toFixed()-this.parent.getBoundingClientRect().height/2;
    this.touchwall();
    switch (this.weapon) {
      case "pew":
        this.moveshots();
      break;
      case "chainLightning":
        this.movebeam();
      break;
    }
    this.gather();
  }
  button() {
    for(let arr of this.btn) {
      btnA.value>=1?btnA.value++:void(0);
      btnB.value>=1?btnB.value++:void(0);
      btnA.value%25===10?lvl.player[0].shoot():void(0);
      btnB.value>0?boostmove=3:boostmove=1;  
    }
  }
  calcspeed(speed) {
    this.speed=(speed*4).toFixed();
  }
  touchwall() {
    super.touchwall()?this.position(this.xpos-this.dx*2,this.ypos-this.dy*2):void(0);
  }
  shoot() {
    switch (this.weapon) {
      case "pew":
        if(this.shots.length<10) {
          this.shots[this.shots.length]=new Pew(this.world,this.midx,this.midy,this.direction);
        }
      break;
      case "lazer":
        alert("lazer");
      break;
      case "chainLightning":
        this.shots[this.shots.length]=new ChainLightning(this.world,this.midx,this.midy);
      break;
    }
  }
  moveshots() {
    for(let i in this.shots) {
      if(this.shots[i].move()) {
        this.parent.removeChild(this.shots[i].svg);
        this.shots[i]=this.shots[this.shots.length-1];
        this.shots.pop();
      }
    }
  }
  movebeam() {
   for(let i in this.shots) {
      if(this.shots[i].move(this.midx,this.midy)) {
        this.shots[i].vanish();
        this.shots[i]=this.shots[this.shots.length-1];
        this.shots.pop();
      }
    }
  }
  gather() {
    for(let i in this.world.item) {
      let obj=this.world.item[i];
      if(Math.sqrt(Math.pow(obj.midx-this.midx,2)+Math.pow(obj.midy-this.midy,2))<=obj.rad) {
        this.item[obj.gathered()]++;
        //++this.item[obj.gathered()]>=1?
        inv.add(obj.src);
        this.world.item[i]=this.world.item[this.world.item.length-1];
        this.world.item.pop();
      }
    }
  }
}
class Enemy extends Source {
  constructor(world,species) {
    switch(species) {
      case "zombie":
        super(world,50,50);
        this.speed=0;
        this.direction=1;
        this.counter=50;
        this.count=1;
        this.species=species;
        this.svg.style.zIndex=12;
        this.circle=new SvgElement("ellipse",{
          "cx":"50%",
          "cy":"50%",
          "rx":"49%",
          "ry":"49%",
          "stroke":"black",
          "stroke-width":1,
          "fill":"green"
        });
        this.hp=100;
        this.sightrange=100;
        this.followrange=200;
        this.hitrange=10;
      break;
    }
    this.svg.appendChild(this.circle);
    this.follow=false;
  }
  move() {
    this.counter==100?this.count=-1:void(0);
    this.counter==0?this.count=1:void(0);
    this.counter+=this.count;
    this.dead=false;
    for(let victim of this.world.player) {
      if(this.follow) {
        switch(this.species) {
        case "zombie":
          svgChgProp(this.circle,{fill:"red"});
          this.speed=0.9;
          break;
        }
        this.calcdirection(victim.midx-this.midx,victim.midy-this.midy);
        Math.sqrt(Math.pow(victim.midx-this.midx,2)+Math.pow(victim.midy-this.midy,2))>=this.followrange?this.follow=false:this.follow=true;
        Math.sqrt(Math.pow(victim.midx-this.midx,2)+Math.pow(victim.midy-this.midy,2))<=this.hitrange?this.kill():void(0);
      }
      else {
        Math.sqrt(Math.pow(victim.midx-this.midx,2)+Math.pow(victim.midy-this.midy,2))<=this.sightrange?this.follow=true:this.follow=false;
        switch(this.species) {
        case "zombie":
          svgChgProp(this.circle,{fill:"green"});
          if(this.counter==50) {
            this.speed=Math.floor(Math.random()*2)/4;
            this.direction=Math.random()*Math.PI*2;
          }
          break;
        }
      }
      if(this.hp<=0) {
        this.die();
      }
    }
    switch(this.species) {
    case "zombie":
      this.rx=50-this.counter/4;
      this.ry=25+this.counter/4;
      svgChgProp(this.circle,{
        rx:this.rx+"%",
        ry:this.ry+"%"
      });
      break;
    }
    super.move();
    this.touchwall();
  }
  touchwall() {
    if(super.touchwall()) {
      this.position(this.xpos-this.dx,this.ypos-this.dy);
      this.direction=Math.PI*2-this.direction;
    }
  }
  //provable points to stop at walls and things
  edges() {
    output=[];
    for(let i=0;i<=15;i++) {
      output[i]=[];
      output[i].push(this.midx+this.rx*this.rad/100*Math.sin(Math.PI/16*i)); //x-coordinate
      output[i].push(this.midy+this.ry*this.rad/100*Math.cos(Math.PI/16*i)); //y-coordinate
    }
    return output;
  }
  //provable area to stop at walls resp.
  innerrect() {
    output=[];
    let dx=this.rx*Math.sin(Math.PI/4);
    let dy=this.ry*Math.sin(Math.PI/4);
    output[0]=this.midx-dx; //left-side
    output[1]=this.midy-dy; //top-side
    output[2]=dx; //width
    output[3]=dy; //height
    return output;
  }
  die() {
    this.dead=true;
    this.parent.removeChild(this.svg);
    this.dropLoot();
  }
  kill() {
    alert("game over");
  }
  dropLoot() {
    if(Math.random()>=0.5) {
      this.world.dropItem("timestop",this.xpos,this.ypos);
    }
  }
}
class Shots extends Source {

}
class Pew extends Source {
  constructor(world,x,y,direction) {
    super(world,5,5);
    this.direction=direction;
    this.speed=5;
    this.circle=new SvgElement("circle",{
      "cx":"50%",
      "cy":"50%",
      "r":"49%",
      "stroke-width":1,
      "fill":"purple"
    });
    this.svg.appendChild(this.circle);
    super.position(x-this.width/2,y-this.height/2);
    this.svg.style.zIndex=12;
  }
  move() {
    let output=false;
    super.move();
    output=this.wall();
    this.world.enemy.length>0&&!output?output=this.hit(this.world.enemy):void(0);
    return output;
  }
  wall() {
    if(super.wall()) {
      return true;
    }
  }
  hit() {
    for(let obj of this.world.enemy) {
      if(Math.sqrt(Math.pow(obj.midx-this.midx,2)+Math.pow(obj.midy-this.midy,2))<=obj.rad) {
        obj.hp-=10;
        return true;
      }
    }
  }
  //provable points to stop at walls and things
  edges() {
    output=[];
    for(let i=0;i<=7;i++) {
      output[i]=[];
      output[i].push(this.midx+this.rad*Math.sin(Math.PI/4*i)); //x-coordinate
      output[i].push(this.midy+this.rad*Math.cos(Math.PI/4*i)); //y-coordinate
    }
    return output;
  }
}
class ChainLightning extends Source {
  constructor(world,x,y) {
    super(world,world.width,world.height);
    this.hitvic=[]; // index of victims are hit
    this.line=[];
    this.t=15;  //time active
    if(this.world.enemy.length>=0) {
      for(let i=0;i<3;i++) {
        this.target={midx:999999,midy:999999}
        for(let j in this.world.enemy) {
          if(this.hitvic.includes(parseInt(j))||this.world.enemy[j].dead) {
            continue;
          }
          let tardist=Math.sqrt(Math.pow(this.target.midx-x,2)+Math.pow(this.target.midy-y,2));
          let dist=Math.sqrt(Math.pow(this.world.enemy[j].midx-x,2)+Math.pow(this.world.enemy[j].midy-y,2));
          tardist>dist?this.target=this.world.enemy[j]:void(0);
        }
        if(Math.sqrt(Math.pow(this.target.midx-x,2)+Math.pow(this.target.midy-y,2))<=350) {
          for(let k=0;k<=0;k++) {
            this.line[this.line.length]=new SvgElement("polyline",{
              "points":x+","+y+" "+this.target.midx+","+this.target.midy,
              "stroke":"lightblue",
              "fill":"none",
              "stroke-width":"2px"
            });
            this.svg.appendChild(this.line[this.line.length-1]);
          }
          this.hit(this.target);
          x=this.target.midx;
          y=this.target.midy;
          if(this.target.hp>0) {
          this.hitvic.push(parseInt(this.world.enemy.indexOf(this.target)));
          }
        }
      }
    }
  }
  hit(victim) {
    victim.follow=true;
    victim.hp-=20;
  }
  move(x,y) {
    let j=0;
    this.t--;
    for(let i of this.hitvic) {
      svgChgProp(this.line[j++],{
        points:x+","+y+" "+this.world.enemy[i].midx+","+this.world.enemy[i].midy
      });
      x=this.world.enemy[i].midx;
      y=this.world.enemy[i].midy;
    }
    if(this.t===0) {
      return true;
    }
  }
  vanish() {
    for(let line of this.line) {
      this.svg.removeChild(line);
    }
  }
}
class Item extends Source {
  constructor(world,item) {
    super(world,20,20);
    this.item=item;
    switch(item) {
      case "timestop":
        this.src="";
        this.circle=new SvgElement("circle",{
          "cx":"50%",
          "cy":"50%",
          "r":"49%",
          "stroke":"black",
          "stroke-width":1,
          "fill":"blue"
        });
        this.svg.appendChild(this.circle);
      break;   
    }
  }
  gathered() {
    this.svg.removeChild(this.circle);
    return this.item;
  }
  activate() {
    switch(item) {
      case "timestop":
        
      break;
    }
  }
}