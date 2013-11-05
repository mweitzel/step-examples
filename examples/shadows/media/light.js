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
    }
  }
}
