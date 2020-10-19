import { Timeline, Animation} from './animation.js';
import { ease, easeIn } from './ease.js';

let t = new Timeline();
let animation = new Animation(
    document.getElementById('box1').style,
    'transform',
    0, 500, 2000, 0, easeIn,
    v => `translateX(${v}px)`
)

t.add(animation);
t.start();

document.getElementById('box2').style.transition = 'transform ease-in 2s';
document.getElementById('box2').style.transform = 'translateX(500px)';

document.getElementById('start').addEventListener('click', () => {
    t.start();
})

document.getElementById('pause').addEventListener('click', () => {
    t.pause();
})

document.getElementById('resume').addEventListener('click', () => {
    t.resume();
})

document.getElementById('reset').addEventListener('click', () => {
    t.reset();
})