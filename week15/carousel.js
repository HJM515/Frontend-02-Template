import { Component, CreateElement } from './framework.js';

export class Carousel extends Component{
    constructor() {
        super()
        this.attributes = Object.create(null);
    }
    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel')

        for(let item of this.attributes.src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url(${item})`
            this.root.appendChild(child);
        }

        let children = this.root.children;
        let position = 0;
        this.root.addEventListener('mousedown', (event) => {
            let startX = event.clientX;

            let move = (event) => {
                let x = event.clientX - startX;
                let current = position - ((x - x%500)/500);
                for(let offset of [-1,0,1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos*500 + offset*500 + x%500}px)`;
                }
                // for(let child of children) {
                //     child.style.transition = 'none'
                //     child.style.transform = `translateX(${-500*position + x}px)`
                // }
            };
            
            let up = (event) => {
                let x = event.clientX - startX;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                position = position - Math.round(x/500);
                // let arr = x < 0 ? [-1, 0] : [0 ,1]
                let sign = -Math.sign(Math.round(x/100)-x+250*Math.sign(x))
                for(let offset of [0, sign]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${-pos*500 + offset*500}px)`;
                }
                
            };
            
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);

        })
        // let currentIndex = 0
        // setInterval(() => {
 
        //     let nextIndex = (currentIndex + 1) % children.length;

        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = 'none';
        //     next.style.transform = `translateX(${100 - nextIndex*100}%)`;

        //     setTimeout(() => {
        //         next.style.transition = '';
        //         current.style.transform =  `translateX(${-100 - currentIndex * 100}%)`;
        //         next.style.transform = `translateX(${-nextIndex*100}%)`;
        //         currentIndex = nextIndex
        //     },16)
        // }, 2000)
        return this.root;
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    mountTo(parent) {
        parent.appendChild(this.render())
    }
}