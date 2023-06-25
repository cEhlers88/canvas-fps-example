class BaseFpsCounter {
    _currentFps = 0;
    _lastTime = 0;
    type = '';
    get fps(){
        return this._currentFps;
    }
    tick(targetFps){}
    getOption(key){}
    setOption(key, value){}
}

const fpsCounterClasses = {
    simple: class extends BaseFpsCounter {
        _counter = 0;
        type = 'simple';
        tick(targetFps){
            if(Date.now() - this._lastTime > 1000){
                this._currentFps = this._counter;
                this._counter = 0;
                this._lastTime = Date.now();
            }
            this._counter++;
        }
    },
    calculating: class extends BaseFpsCounter{
        _bufferValues = [];
        _smoothOutput = false;
        _lastTargetFps = -1;
        type = 'calculating';
        getOption(key){
            switch (key.toLowerCase()){
                case 'smooth': return this._smoothOutput;
            }
        }
        setOption(key, value) {
            switch (key.toLowerCase()){
                case 'smooth': this._smoothOutput = value; break;
            }
        }

        tick(targetFps){
            const deltaTime = Date.now() - this._lastTime;
            this._lastTime = Date.now();

            if(this._smoothOutput){
                if(this._lastTargetFps !== targetFps){
                    this._bufferValues = [];
                    this._lastTargetFps = targetFps;
                }
                this._bufferValues.unshift(Math.round(1000 / deltaTime));
                if(this._bufferValues.length > 50){
                    this._bufferValues.pop();
                }
                const sum = this._bufferValues.reduce((a, b) => a + b, 0);
                this._currentFps = Math.round(sum / this._bufferValues.length);
            }else{
                this._currentFps = Math.round(1000 / deltaTime);
            }
        }
    }
};
export const getFpsCounter = (type='simple') => {
    return new fpsCounterClasses[type]();
}