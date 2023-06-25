import {getFpsCounter} from "./getFpsCounter";
import {createCtxBuffer} from "./createCtxBuffer";
export default class Application {
    animX = [0,0];
    animDir = [1,1];
    canvas = null;
    ctx = null;
    ctxBuffer = null;
    fpsCounter = null;
    lastUpdateTime = 0;
    targetFps = 20;
    useBuffer = true;
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.fpsCounter = getFpsCounter('simple');
    }
    start() {
        this.lastUpdateTime = Date.now();
        const _loop = () => {
            this
                .update()
                .draw()
            ;
            const deltaTime = Date.now() - this.lastUpdateTime;
            const targetDeltaTime = 1000/this.targetFps;
            const delay = Math.max(0, targetDeltaTime - deltaTime);
            this.lastUpdateTime = Date.now() + delay;

            setTimeout(() => {
                // this.lastUpdateTime = Date.now(); // ! Führt an dieser Stelle zu einer größeren Abweichung zur Ziel-FPS
                requestAnimationFrame(_loop);
            }, delay);
        }
        _loop();
    }
    update() {
        this.fpsCounter.tick(this.targetFps);
        [0,1].map(i=>{
            this.animX[i] += this.animDir[i];
            if(this.animX[i] >= 30){
                this.animDir[i] = -1;
            }
            if(this.animX[i] <= 0){
                this.animDir[i] = 1;
            }
        });
        return this;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.ctxBuffer===null){
            this.ctxBuffer = createCtxBuffer(this.canvas.width, this.canvas.height);
            this._drawRectDummies(this.ctxBuffer);
        }
        this.ctx.drawImage(this.ctxBuffer.canvas, 0, 0, this.canvas.width, this.canvas.height/2, this.animX[0], 0, this.canvas.width, this.canvas.height);
        //this.ctx.drawImage(this.ctxBuffer.canvas, 0, this.canvas.height/2, this.canvas.width, this.canvas.height/2, this.animX[1], this.canvas.height/2, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';
        this.ctx.font = '12px Tahoma';
        this.ctx.fillText(`FPS Current: ${this.fpsCounter.fps}`, 10, 15);
        this.ctx.fillText('FPS Target: '+this.targetFps, 10, 30);
        this.ctx.fillText('Using Buffer: '+(this.useBuffer?'Yes':'No'), 10, 45);

        return this;
    }
    setFpsCounterType(type){
        this.fpsCounter = getFpsCounter(type);
    }
    _drawRectDummies(ctx, count = 100){
        let x = 0;
        let y = 0;
        for(let i = 0; i < count; i++) {
            x++;
            this._drawRectDummy(ctx, x , y, 10, 40);

            if(x >= 10){
                y ++;
                x = 0;
            }
        }
    }
    _drawRectDummy(ctx, x, y, offsetX, offsetY){
        const width = 20;
        const height = 15;
        const startX = (x-1)*width+x*5+offsetX;
        const startY = y*height+y*5+offsetY;

        [
            {color:'red', blur:2, space:0},
            {color:'blue', blur:4, space:2},
            {color:'yellow', blur:2, space:6},
        ].map(def=>{
            ctx.fillStyle = def.color;
            ctx.filter = 'blur('+def.blur+'px)';
            ctx.fillRect(startX+def.space, startY+def.space, width/3-2*def.space, height-2*def.space);
            ctx.fillRect(startX+def.space, startY+def.space, width-2*def.space, height/3-2*def.space);
            ctx.fillRect(startX+2*(width/3)+def.space, startY+def.space, width/3-2*def.space, height-2*def.space);
            ctx.fillRect(startX+def.space, startY+2*(height/3)+def.space, width-2*def.space, height/3-2*def.space);
            ctx.filter = 'none';
        });

    }
}