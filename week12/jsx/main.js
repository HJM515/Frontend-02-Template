function createElement(type, attributes, ...children) {
    const el = document.createElement(type);
    for(let name in attributes) {
        el.setAttribute(name, attributes[name]);
    }
    for(let child of children) {
        if(typeof child === 'string') {
            child = document.createTextNode(child);
        }
        el.appendChild(child);
    }
    return el;
}

let a = <div id="box">
    Hello world
    <div style="background:green;">div tag</div>
    <span>span tag</span>
</div>;

document.body.appendChild(a);

