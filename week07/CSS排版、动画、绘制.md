学习笔记

[重学前端 - CSS笔记](https://www.notion.so/CSS-6fd8289308784188af74e886eeeea2c4)

CSS的属性实在是太多了，所以本想利用https://time.geekbang.org/column/article/93110获取的数据，格式化后使用G6的脑图展示，但G6数据一多就会报错（不知道是数据的原因，还是G6的原因）。

```js
var standards = Array.prototype.slice.call(document.querySelectorAll("#container li[data-tag~=css] h2:not(.Retired):not(.GroupNote)"));
var css_properties = []

var iframe = document.createElement('iframe');
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happen(element, event) {
  return new Promise(resolve => {
      var handler = () => {
          resolve();
          element.removeEventListener(event, handler);
      }
      element.addEventListener(event, handler);
  })
}

async function start(){
  var output = []
  for(var standard of standards) {
    console.log(standard.children[0].href);
    iframe.src = standard.children[0].href;
    await happen(iframe, "load");
    var properties = Array.prototype.map.call(iframe.contentWindow.document.querySelectorAll(".propdef [data-dfn-type=property]"), e => e.childNodes[0].textContent);
    console.log("start -> properties", properties)
    if(properties.length) {
      css_properties.push({
        id: standard.children[0].textContent,
        children: properties.map(property => ({id: property}))
      })
    }
  }
}
start();
```