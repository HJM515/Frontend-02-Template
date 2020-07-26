## 浏览器原理-状态机

[有限状态机扩展笔记](https://www.notion.so/FSM-1c231af96ca24950b5b3aee96e0157f9)

有限状态机，关键字`机`，状态是对`机`的描述。❓❓`疑问：有限是什么意思呢？` ✔

> 有限状态机可以将复杂的逻辑简化未有限个稳定状态。有限状态机是一个闭环系统，可以用有限的状态处理无尽的事务。

- 每个状态都是一个机器
  - 机器可计算、存储、输出  ❓❓`存储操作应该算一个有副作用的操作吧？这点与纯函数不同`
  - 机器可接受的输入具有一致性
  - 机器本身无状态，类似纯函数
- 每个机器都知道下一个状态，每个机器的下一个状态（分两种）：
  1. 固定不变（Moore状态机）
  2. 根据输入确定（Mealy状态机）

```
JS简单实现Mealy状态机
// 状态机（函数state）、输入（参数input）、下一个状态（返回next函数）
function state(input) {
	//... //计算处理逻辑
	return next;
}
```

### 纯函数

相同的参数返回结果也相同，执行无副作用。

- 不依赖、不访问函数外的状态
- 不修改以参数形式传入的对象
- 不发HTTP请求，不保留用户输入（I/O）

```
练习：不使用正则表达式，纯JS逻辑实现在一个字符串中找到字符‘ab’
1. 我的思路，循环遍历，第i个字符为a，第i+1个字符为b，就找到了。
2. 老师的思路，循环遍历，使用foundA状态标识
function match(string) {
	let foundA = false;
	for(let w of string) {
		if(w === 'a') 
			foundA = true;
		else if(foundA & w === 'b')
			return true;
		else
			foundA = false;
	}
	return false;
}
```

## 浏览器原理-HTTP请求

[HTTP(重学前端)笔记](https://www.notion.so/HTTP-5a28220cdc1a487ab1abf48a385c34bd)

### TCP/IP基础知识

- 流：TCP层数据传输是流
- 端口：计算机的网卡通过端口把接受到的数据分给各个应用
- require('net')：node包
- 包：数据包
- IP地址：IP通过地址，唯一性，确实包从哪儿到哪儿
- libnet：底层C++库，负责构造、发送IP包
- libcap：底层C++库，负责抓取网卡的IP包（使用交换机组网，可以抓到不属于自己的IP包）

### HTTP请求、响应实现

1. HTTP请求类 Requset，接收options配置项，其中Content-Type会影响body格式，必须有（设置默认值），影响body格式
2. Request 的 send 方法（promise），使用net建立TCP连接，发送请求，监听连接返回的数据
3. ResponseParser类， 解析收到的数据（响应行、响应头、空行、响应体）。（状态机✔）
4. TrunkedBodyParser类，以此为例，解析响应体。（状态机✔）

到此，实现了发送HTTP请求，并接收响应。下一步，构建HTML解析器，利用响应体构建DOM树。

## HTML解析

1. parserHMTL函数，HTML文本为参数，返回DOM树。
2. HTML状态，[HTML标准](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state)规定了约80种状态，toy-browser使用其中十几种
3. 解析开始、结束、自封闭标签，tagOpen, endTagOpen, tagName, selfClosingStartTag
4. 创建元素，在状态迁移前，加入业务逻辑，在标签结束状态提交标签token
5. 处理属性，属性值分为单引号、双引号、无引号，属性结束时加到标签token上。
6. 构建DOM树，使用栈
   - 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
   - 自封闭节点入栈后立即出栈
   - 任何元素的父元素是它入栈前的栈顶
7. 文本节点，多个合并