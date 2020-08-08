学习笔记

## CSS语法

https://www.w3.org/TR/CSS21/grammar.html#q25.0

CSS2.1产生式

```
[ CHARSET_SYM STRING ';' ]?
[S|CDO|CDC]* [ import [ CDO S* | CDC S* ]* ]*
[ [ ruleset | media | page ] [ CDO S* | CDC S* ]* ]*

[], 组的概念
?, 0个或1个
|, 或
*, 0个或多个
CDO CDC, HTML注释的起点和终点（早年CSS兼容考虑，旧的浏览器将CSS理解为HTML注释，把新的CSS文本理解为CSS规则。现代浏览器都完全支持CSS。）
```

### CSS总体结构

- @charset （基本不用）
- @import
- rules：@media、@page、rule

### @规则

- @media
- @keyframes
- @fontface (iconfont利用了这个特性)
- @import
- @namespace 
- @support  检查环境特性
- @counter-style  定义列表项表现
- @page  分页媒体访问网页的表现设置
- @charset

### CSS规则  

- Selector
  - selector_group
  - selector：>、<sp>、+、-
  - simple_selector：type、*、· 、#、[ ]、: 、:: 、:not()
- Declaration
  - Key：variables、properties
  - Value：calc、number、length...

```
Array.prototype.slice.call(document.querySelector('#container').children).filter(e => {
	return e.getAttribute('data-tag').match(/css/)
}).map(e => {
	return { name: e.children[1].innerText, url: e.children[1].children[0].href }
})
```

#### CSS变量
```
:root {
  --main-color: #0c6;
}
.class{
  color: var(--main-color);
}
```

#### CSS函数

- calc()
- max()、min()
- clamp()  给一个值限定一个范围，超过范围使用范围的最大或最小值 （请问，有什么用呢？）
- toggle()  规则选中多于一个元素时生效，会在几个值之间来回切换
- attr()  目前仅对伪元素生效
- ... css3 tranform 变换引入了很多函数
```
<p data-foo="hello">world</p>
p:before{ content: attr(data-foo) ""; }
渲染结果：hello world
```

## CSS 选择器

### 简单选择器

- *
- div svg|a 单竖线，命名空间分隔符；svg需要使用@namespace声明；svg与html重叠的标签只有a（应用较少，完备性考虑）
- .cls
- #id
- [attr=value]
- :hover
- ::before

### 复合选择器

- <简单选择器> <简单选择器> <简单选择器> ...
- 注意 * 、div必须写在最前面，伪类、伪元素必须写在最后面

### 复杂选择器

- <复合选择器> <sp> <复合选择器> 
- <复合选择器> ">" <复合选择器>
- <复合选择器> "~" <复合选择器>  后继
- <复合选择器> "+" <复合选择器>  直接后继
- <复合选择器> "||" <复合选择器>  （Selector Level4，table中选中某一列）

### 选择器优先级

https://www.w3.org/TR/selectors-3/#specificity
https://www.w3.org/TR/selectors-4/#specificity-rules

四元组：[ inline, id, class, tagName]

```
#id div.a#id  [0, 2, 1, 1]
优先级 S = 0 * N^3 + 2 * N^2 + 1 * N + 1
取 N = 1000000, S = 2000001000001
IE6, 为节省内存，取N 256，256个class相当于一个id。 现在大部分浏览器取的6536或者更大。
```

### 伪类

- 链接、行为

  - :any-link 任何超链接
  - :link  未访问过的超链接 （使用后无法访问文字颜色之外的属性，因为可通过js获取属性改变而确定用户访问过的链接，存在安全性问题  ）
  - :visited 访问过的超链接（同上）
  - :active  超链接
  - :hover  最开始只有超链接有效，现在很多元素都支持hover伪类
  - :focus  最开始只有超链接有效，所有可获得焦点的元素
  - :target  给作为锚点的a标签使用

- 树结构

  - :empty
  - :nth-child()  可传入 even、odd、an+b...
  - :nth-last-child() 参照同上，匹配顺序从后往前
  - :first-child  :last-child  :only-child

  其中，:empty、:nth-last-child()、 :last-child  :only-child 对计算时机有影响，破坏回溯原则，目前浏览器通过hack实现。

- 逻辑型

  - :not() 伪类  只支持复合选择器，不支持复杂选择器
  - :where  :has  （CSS Level4）

### ::first-letter

#### 生效前提

1. `display`： `block`, `inline-block`, `table-cell`, `list-item`或者`table-caption` 

   （仅限定设置::first-letter的display）

2. 标点符号，在::first-letter看来是辅助字符。如 `？？` ，不生效。 `？？一二 ` ，`？？一`选中生效。

3. 字符前不能有图片或inline-table之类的元素。

#### 生效的CSS属性

1. font..
2. background..
3. margin..
4. padding..
5. border..
6. `color`, `text-decoration`, `text-transform`, `letter-spacing`, `word-spacing`(合适情境下), `line-height`, `float`, `vertical-align`

#### 实用案例

价格单位样式修改：

```css
.price:first-letter {
    margin-right: 5px;
    font-size: xx-large;
    vertical-align: -2px;
}
```

### ::first-line

#### 生效前提

`display`为如下值的些元素`block`, `inline-block`, `table-cell`或`table-caption`.  （限定设置::first-line的display，以及首行元素的display）。

#### 生效的CSS属性

1. font..
2. background..
3. `color`, `word-spacing`, `letter-spacing`, `text-decoration`, `text-transform`, 和`line-height`.

