Core.root = (function(){
  var public = new GameObject
  public.globalY = public.localY
  public.globalY = public.localY
  return public
})()

function GameObject() {
  return {
    x:0,
    y:0,
    dx:0,
    dy:0,
    localX:function(){
      return this.x
    },
    localY:function(){
      return this.y
    },
    globalX:function(){
      return this.parent.x + this.localX()
    },
    globalY:function(){
      return this.parent.y + this.localY()
    },
    update:function(){},
  }
}

function Player(){
  this.children = []
  var lightSource = new GameObject
  _.extend(lightSource, singleLightSource)

  Core.entities.push(lightSource)
  lightSource.parent = this

  this.x = 200
  this.y = 200
  this.dx = 0
  this.dy = 0
  this.parent = {}
  this.lean = 0.13
  this.mass = 0.5
  this.isGrabbable = false
}

Player.prototype.draw = function(ctx){
    ctx.fillRect(this.x-2,this.y-2,4,4)
    ctx.fillStyle = "#000000"
}

Player.prototype.update = function(){
  // if(Input.isDodging())
    // this.parent = {}

  if(this.isFlying())
    this.flyingUpdate()
  else
    this.swingingUpdate()
  // console.log(this.x)
}

Player.prototype.intersectionVector = function(){
  return {
    x0:this.x,
    y0:this.y,
    x1:this.x - this.dx,
    y1:this.y - this.dy
  }
}

Player.prototype.isFlying = function(){
  return _.isEqual(this.parent, {})// || Input.isDodging()
}

Player.prototype.flyingUpdate = function(){
  this.dy += 0.005*Core.physicsTimeStep
  this.dy *= 0.999

  this.respondToInput()

  this.x += this.dx
  this.y += this.dy

  if(this.x <  0 && this.dx < 0)
    this.x = 640
  if(this.x > 640 )
    this.x = 0
  if(this.y > 480 )
    this.y = 0

  this.tryToGrabAnything()
}

Player.prototype.swingingUpdate = function(){

  this.respondToInput()

  this.x += this.dx
  this.y = this.parent.y
  this.dy = 0

  if(this.x <  0 && this.dx < 0)
    this.x = 640
  if(this.x > 640 )
    this.x = 0
  if(this.y > 480 )
    this.y = 0

  if(this.isDodging()){
    //if(Input.getKey(keys.left) || Input.getKey(keys.right))
    this.dy = -4
    // console.log(this.dx)
    this.parent = {}
  }
  else if(this.x < this.parent.leftX() || this.x > this.parent.rightX()){
    this.parent = {}
  }
}

Player.prototype.isDodging = function(){
  return Input.getKey(keys.dodge)
}

Player.prototype.tryToGrabAnything = function(){
  if(this.isDodging())
    return false

  man = this
  var platforms = _.filter(Core.entities, function(grabbable){ return (grabbable.isGrabbable && !!Physics.collide(man, grabbable)) });
  myFloor = _.max(platforms, function(platform){ return platform.y })
  if(!_.isNumber(myFloor))
    this.parent = myFloor
}

Player.prototype.respondToInput = function(){
  if(Input.getKey(keys.right)){
    this.dx += 0.005 * Core.physicsTimeStep
  }else if(Input.getKey(keys.left)){
    this.dx -= 0.005 * Core.physicsTimeStep
  }else{
    // this.dx *= 0.72
  }
    this.dx *= 0.95

}
