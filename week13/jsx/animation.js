const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick_handler');
const ANIMATIONS = Symbol('animations');
const ANIMATION_START_TIME = Symbol('animation_start_time');
const PAUSE_START = Symbol('pause_start');
const PAUSE_TIME = Symbol('pause_time');
const STATE_INIT = Symbol('init');
const STATE_START = Symbol('start');
const STATE_PAUSE =Symbol('pause');

export class Timeline{
    constructor() {
        this[ANIMATIONS] = new Set();
        this[ANIMATION_START_TIME] = new Map();
        this.state = STATE_INIT;
    }
    // get rate() {}
    // set rate() {}
    add(animation, startTime) {
        startTime = startTime || Date.now();
        this[ANIMATIONS].add(animation);
        this[ANIMATION_START_TIME].set(animation, startTime);
    }
    start() {
        if (this.state !== STATE_INIT) return;
        this.state = STATE_START;

        const startTime = Date.now();
        this[PAUSE_TIME] = 0;

        this[TICK] = () => {
            const now = Date.now();
            for(let animation of this[ANIMATIONS]) {
                let t;
                const startTimeMax = Math.max(this[ANIMATION_START_TIME].get(animation), startTime);
                t = now - startTimeMax - this[PAUSE_TIME] - animation.delay;

                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }

                if(t > 0) 
                    animation.receive(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }

        this[TICK]();
    }
    pause() {
        if(this.state !== STATE_START) return;
        this.state = STATE_PAUSE;

        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if(this.state !== STATE_PAUSE) return;
        this.state = STATE_START;

        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }
    reset() {
        this.pause();
        this.state = Date.now();
        this[PAUSE_TIME] = 0;
        this[PAUSE_START] = 0;
        this[ANIMATIONS] = new Set();
        this[ANIMATION_START_TIME] = new Map();
        this[TICK_HANDLER] = null;
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFn, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        console.log("Animation -> constructor -> timingFn", timingFn)
        this.timingFn = timingFn || (v => v);
        // template 属性值模板，可兼容translateX(20px)等CSS属性值
        this.template = template || (v => v);
    }
    receive(time) {
        const range = this.endValue - this.startValue;
        const progress = this.timingFn(time / this.duration);
        console.log("Animation -> receive -> progress", progress,time / this.duration)
        this.object[this.property] = this.template(this.startValue + progress * range);
    }
}