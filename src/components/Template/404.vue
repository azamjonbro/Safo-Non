<template>
    <div class="ag-page-404 d-flex column gap24 a-center">
      <h2  class="not-found">Sahifa mavjud emas</h2>
      <div class="ag-toaster-wrap">
        <div class="ag-toaster">
          <div class="ag-toaster_back"></div>
          <div class="ag-toaster_front">
            <div ref="lever" class="ag-toaster_lever"></div>
          </div>
          <div class="ag-toaster_toast-handler">
            <div class="ag-toaster_shadow"></div>
            <div ref="toast" class="ag-toaster_toast js-ag-hide"></div>
          </div>
        </div>
        <canvas ref="canvas" class="ag-canvas-404" width="300" height="210"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  class Smoke {
    constructor(x, y, maxLifeTime) {
      this.x = x;
      this.y = y;
      this.size = 1;
      this.startSize = 60;
      this.endSize = 69;
      this.angle = Math.random() * 359;
      this.startLife = Date.now();
      this.lifeTime = 0;
      this.maxLifeTime = maxLifeTime;
      this.velY = -1 - Math.random() * 0.5;
      this.velX = Math.random() * 6 - 3;
    }
  
    update() {
      this.lifeTime = Date.now() - this.startLife;
      const lifePerc = (this.lifeTime / this.maxLifeTime) * 100;
      this.size = this.startSize + (this.endSize - this.startSize) * lifePerc * 0.01;
      this.alpha = Math.max(1 - lifePerc * 0.01, 0);
      this.x += this.velX;
      this.y += this.velY;
    }
  }
  
  export default {
    data() {
      return {
        canvas: null,
        ctx: null,
        parts: [],
        minSpawnTime: 100,
        lastTime: Date.now(),
        maxLifeTime: 6000,
        emitterX: 150,
        emitterY: 200,
        smokeImage: new Image(),
      };
    },
    mounted() {
      this.$refs.lever.style.top = "30px";
      this.$refs.toast.classList.remove("js-ag-hide");
      this.$refs.toast.classList.add("js-ag-animated", "js-ag-bounce-in-up");
  
      this.canvas = this.$refs.canvas;
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
        this.smokeImage.src = "https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/smoke.png";
        this.smokeImage.onload = () => {
          this.render();
        };
      }
    },
    methods: {
      spawn() {
        if (Date.now() > this.lastTime + this.minSpawnTime) {
          this.lastTime = Date.now();
          this.parts.push(new Smoke(this.emitterX, this.emitterY, this.maxLifeTime));
        }
      },
      render() {
        if (!this.canvas || !this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.parts = this.parts.filter(part => part.y >= 0 && part.lifeTime <= this.maxLifeTime);
        this.parts.forEach(part => {
          part.update();
          this.ctx.save();
          this.ctx.translate(part.x, part.y);
          this.ctx.rotate((part.angle * Math.PI) / 400);
          this.ctx.globalAlpha = part.alpha;
          this.ctx.drawImage(this.smokeImage, -part.size / 2, -part.size / 2, part.size, part.size);
          this.ctx.restore();
        });
        
        this.spawn();
        requestAnimationFrame(this.render);
      }
    }
  };
  </script>
  
  <style>
  .ag-format-container {
    margin-top: 30px;
    width: 1142px;
    margin: 0 auto;
    
  }
  
  .js-ag-hide {
    display: none;
  }
  
  .ag-canvas-404_img {
    display: none;
  }
  .ag-canvas-404 {
    opacity: .7;
    filter: alpha(opacity=80);
  
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
  }
  
  .ag-toaster-wrap {
    display: table;
    margin: 0 auto;
    padding: 200px 0 0;
    position: relative;
  }
  .ag-toaster {
    width: 340px;
    height: 217px;
    position: relative;
  }
  .ag-toaster_toast-handler {
    width: 155px;
    height: 200px;
    margin-left: 85px;
    padding-top: 60px;
  
    overflow: hidden;
  
    z-index: 1;
    position: absolute;
    top: -150px;
  }
  .ag-toaster_shadow {
    width: 100%;
    height: 9px;
    background: url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/sprite-toaster.png) -340px -195px no-repeat;
    position: absolute;
    top: 100px;
    left: 0;
    bottom: 91px;
    display: none;
  }
  .ag-toaster_toast {
    width: 159px;
    height: 171px;
    background: url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/sprite-toaster.png) -340px 0 no-repeat;
  
    z-index: -1;
    position: relative;
  }
  .ag-toaster_front {
    width: 340px;
    height: 217px;
    background: url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/sprite-toaster.png) 0 -18px no-repeat;
  
    z-index: 2;
    position: relative;
  }
  .ag-toaster_lever {
    width: 22px;
    height: 21px;
    background: url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/sprite-toaster.png) -340px -171px no-repeat;
  
    position: absolute;
    top: 75px;
    right: 12px;
  }
  .ag-toaster_back {
    width: 340px;
    height: 18px;
    background: url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/sprite-toaster.png) no-repeat;
  
    z-index: -3;
    position: relative;
  }
  
  @-webkit-keyframes an-bounce-in-up {
    0% {
      opacity: 0;
  
      -webkit-transform: translateY(2000px);
      transform: translateY(2000px);
    }
    60% {
      opacity: 1;
  
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    80% {
      -webkit-transform: translateY(5px);
      transform: translateY(5px);
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }
  
  @-moz-keyframes an-bounce-in-up {
    0% {
      opacity: 0;
  
      -moz-transform: translateY(2000px);
      transform: translateY(2000px);
    }
    60% {
      opacity: 1;
  
      -moz-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    80% {
      -moz-transform: translateY(5px);
      transform: translateY(5px);
    }
    100% {
      -moz-transform: translateY(0);
      transform: translateY(0);
    }
  }
  
  @-ms-keyframes an-bounce-in-up {
    0% {
      opacity: 0;
      filter: alpha(opacity=0);
  
      -ms-transform: translateY(2000px);
      transform: translateY(2000px);
    }
    60% {
      opacity: 1;
      filter: alpha(opacity=100);
  
      -ms-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    80% {
      -ms-transform: translateY(5px);
      transform: translateY(5px);
    }
    100% {
      -ms-transform: translateY(0);
      transform: translateY(0);
    }
  }
  
  @-o-keyframes an-bounce-in-up {
    0% {
      opacity: 0;
  
      -o-transform: translateY(2000px);
      transform: translateY(2000px);
    }
    60% {
      opacity: 1;
  
      -o-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    80% {
      -o-transform: translateY(5px);
      transform: translateY(5px);
    }
    100% {
      -o-transform: translateY(0);
      transform: translateY(0);
    }
  }
  
  @keyframes an-bounce-in-up {
    0% {
      opacity: 0;
      filter: alpha(opacity=0);
      -webkit-transform: translateY(2000px);
      -moz-transform: translateY(2000px);
      -ms-transform: translateY(2000px);
      -o-transform: translateY(2000px);
      transform: translateY(2000px);
    }
    60% {
      opacity: 1;
      filter: alpha(opacity=100);
      -webkit-transform: translateY(-20px);
      -moz-transform: translateY(-20px);
      -ms-transform: translateY(-20px);
      -o-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    80% {
      -webkit-transform: translateY(5px);
      -moz-transform: translateY(5px);
      -ms-transform: translateY(5px);
      -o-transform: translateY(5px);
      transform: translateY(5px);
    }
    100% {
      -webkit-transform: translateY(0);
      -moz-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }
  }
  
  .js-ag-animated {
    -webkit-animation-duration: .6s;
    -moz-animation-duration: .6s;
    -ms-animation-duration: .6s;
    -o-animation-duration: .6s;
    animation-duration: .6s;
  
    -webkit-animation-fill-mode: both;
    -moz-animation-fill-mode: both;
    -ms-animation-fill-mode: both;
    -o-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .js-ag-bounce-in-up {
    -webkit-animation-name: an-bounce-in-up;
    -moz-animation-name: an-bounce-in-up;
    -ms-animation-name: an-bounce-in-up;
    -o-animation-name: an-bounce-in-up;
    animation-name: an-bounce-in-up;
  }
  
  @media only screen and (max-width: 767px) {
    .ag-format-container {
      width: 96%;
    }
  
  }
  
  @media only screen and (max-width: 639px) {
  
  }
  
  @media only screen and (max-width: 479px) {
  
  }
  
  @media (min-width: 768px) and (max-width: 979px) {
    .ag-format-container {
      width: 750px;
    }
  
  }
  
  @media (min-width: 980px) and (max-width: 1161px) {
    .ag-format-container {
      width: 960px;
    }
  
  }
  
  </style>
  