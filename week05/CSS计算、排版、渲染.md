[重学前端 > 浏览器原理 > CSS 笔记](https://www.notion.so/CSS-32451d5a804c463792940671b3c80ac3)

## CSS计算

1. 收集CSS规则：遇到style （endTag），添加CSS规则（使用css库解析拿到ast）。假设不考虑body内的style规则。

2. 获取父元素序列：从HTML解析的stack中，获取本元素的所有父元素，按从内到外的顺序匹配计算。

3. 拆分选择器：将复杂选择器拆分成单元素选择器，用循环匹配父元素队列。

4. 匹配元素：根据选择器的类型和元素属性，计算是否与当前元素匹配。

5. 生成computed属性：匹配后应用选择器到元素上，形成computedStyle。

6. 确定规则覆盖关系：根据specificity和后来优先原则覆盖。specificity是四元组，左边优先级高。

   [0,  0,   0,  0]   [inline,  id,  class,   tag]

## CSS排版

使用flex布局完成排版。

1. 收集元素进行（hang）：根据main axis 尺寸，把元素分行。如设置no-wrap，强制分配到一行。
2. 计算主轴：找出带flex的元素，按比例分配主轴剩余尺寸。剩余空间为负，flex 0的等比压缩。
3. 计算交叉轴：根据每一行最高的元素计算行高，根据flex-align、item-align确定元素位置。

## CSS渲染

1. 绘制单个元素：采用npm包images，将元素绘制在一个创建出来的viewport上。（只绘制了尺寸、位置、背景色，grident等属性需要webGL绘制）
2. 绘制dom：递归调用完成所有子元素的绘制。

**实际浏览器中，文字绘制需要依赖字体库，还会对一些图层做合并，toy-browser都忽略了。**

