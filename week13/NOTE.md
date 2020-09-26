### 帧处理

```
方案一：
setInterval(() => {}, 16);
不推荐，可能发生积压。

方案二：
let tick = {
	setTimeout(tick, 16);
}
相对来说更安全。

方案三：
let tick = () => {
	requestAnimationFrame(tick);
}
申请浏览器执行下一帧时进行处理。跟着浏览器的帧率走，更丝滑。
```



### 动画

1. 属性动画
2. 帧动画

### JS时间线动画

1. 定义Animation类，属性包括 作用对象，属性名，开始值、结束值、时间、延迟时间、时间函数、属性值模板。方法receive，接受时间，改变属性。
2. 定义TimeLine类，拥有开始、暂停、恢复、重置等方法。使用requestAnimationFrame完成tick帧处理。

