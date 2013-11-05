
Maths = {}

//is really line length
Maths.vectorMagnitude = function(v){
  aSquared = (v.x0 - v.x1) * (v.x0 - v.x1)
  bSquared = (v.y0 - v.y1) * (v.y0 - v.y1)
  return Math.sqrt( aSquared + bSquared ) //c2 = a2 + b2 //magnitude of their vector.. just do that
}

Maths.scaledPoint = function(p, s){
  return {
    x:p.x*s,
    y:p.y*s
  }
}

Maths.pointAdd = function(p0, p1){
  return {
    x:p0.x+p1.x,
    y:p0.y+p1.y
  }
}

Maths.pointSubtract = function(p0, p1){
  return {
    x:p0.x-p1.x,
    y:p0.y-p1.y
  }
}

Maths.crossProd = function(a, b){
  return ((a.x*b.y) - (a.y*b.x))
}

Physics = {}

Physics.collide = function(collider, collidee){
  return Physics.intersectionOf(collider.intersectionVector(), collidee.intersectionVector())
}

Physics.intersectionOf = function(vectorA, vectorB){
  //http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  o = {
    x:vectorB.x0 - vectorA.x0,
    y:vectorB.y0 - vectorA.y0
  }
  s = {
    x:vectorB.x1 - vectorB.x0,
    y:vectorB.y1 - vectorB.y0
  }
  r = {
    x:vectorA.x1 - vectorA.x0,
    y:vectorA.y1 - vectorA.y0
  }
  t = Maths.crossProd(o,s)/Maths.crossProd(r,s)
  u = Maths.crossProd(o,r)/Maths.crossProd(r,s)
  // t =  (q − p) × s / (r × s)
  // u = (q − p) × r / (r × s)
  var toReturn = false
  if( (u <= 1 && u >= 0 ) && (t <= 1 && t >= 0 ) ){
    toReturn = {
      x:vectorA.x0 + t*vectorA.x1,
      y:vectorA.y0 + t*vectorA.y1
    }  //p + t*r // or.. toReturn = q + r*s
  }
  // p + t r = q + u s

  return toReturn

}

singleLightSource = {
  draw:function(ctx){
    my_gradient = ctx.createRadialGradient(this.globalX(), this.globalY(), 15, this.globalX(), this.globalY(), 250)
    my_gradient.addColorStop(0, 'rgba(0,0,0,0)');
    my_gradient.addColorStop(1, 'black');
    ctx.fillStyle = my_gradient
    ctx.fillRect(0,0,640,480)

    for (var i=0; i < Core.entities.length - 1; i++) {
      current = Core.entities[i]
      vector = {
        x0:this.globalX(),
        y0:this.globalY(),
        x1:current.x,
        y1:current.y,
      }

      if(!_.isEqual(current, this)){// && Maths.vectorMagnitude(vector) < 100){
        ctx.beginPath()
        farMiddle = Maths.pointAdd(Maths.pointSubtract(current, this), current)
        ctx.fillStyle = 'rgba(0,0,0,1)'

        myLight = {x:this.globalX(),y:this.globalY() - 1}

        itsLeft = {x:current.leftX(), y:current.y}
        itsRight = {x:current.rightX(), y:current.y}


        directionVector = Maths.pointSubtract(itsLeft, myLight)
        scaledDirectionVector = Maths.scaledPoint(directionVector, 10000000)
        farLeft = Maths.pointAdd(scaledDirectionVector, itsLeft)

        directionVector = Maths.pointSubtract(itsRight, myLight)
        scaledDirectionVector = Maths.scaledPoint(directionVector, 10000000)
        farRight = Maths.pointAdd(scaledDirectionVector, itsRight)


        ctx.moveTo(itsLeft.x, itsLeft.y)
        ctx.lineTo(farLeft.x, farLeft.y)

        ctx.lineTo(farRight.x, farRight.y)
        ctx.lineTo(itsRight.x, itsRight.y)

        ctx.fill()
      }
      ctx.fillStyle = "#FF00cc"
    }
  }
}

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
