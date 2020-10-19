import { createElement } from './framework';
import { Carousel } from './carousel';
import { Timeline, Animation } from './animation';

const imgs = [
    'https://static001.geekbang.org/resource/image/15/b0/153c6456a919c059ab916e885d4d4db0.jpg',
    'https://static001.geekbang.org/resource/image/35/54/35cb65d74b24e70501967b672702ba54.jpg',
    'https://static001.geekbang.org/resource/image/71/41/7121e6eea47da51285c9f844fae64f41.jpg',
    'https://static001.geekbang.org/resource/image/0a/60/0aceeaa0134ae8ebbd520017e8587160.jpg'
]


let a = <Carousel src={imgs} 
     onChange = {event => console.log(event.detail.position)}
     onClick = {event => window.location.href = event.detail.data.url }/>

a.mountTo(document.body);

let t1 = new Timeline();
t1.add(new Animation(
    { set a(v) { console.log(v) } },
    'a',
    0,
    100,
    1000,
    0,
    null,
    null
))

window.t1 = t1