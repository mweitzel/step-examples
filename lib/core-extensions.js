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
