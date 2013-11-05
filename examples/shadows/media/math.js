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
