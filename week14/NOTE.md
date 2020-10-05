### 手势与动画

#### 基本知识

（1） 点击

**start** > end --> **tap**

（2）移动 / 滑动

**start** (> 0.5s **press start** ) > 移动 10px --> **pan start** > move --> **pan** > end -->**pan end**(end 且速度>? **flick**)

（3）长按

**start** > 0.5s --> **press start** > end --> **press end**



#### 鼠标事件 vs 触摸事件

- 事件触发顺序不同：
  - 鼠标事件：mousemove事件可以直接触发
  - 触摸事件：必定先触发touchstart事件，再触发touchmove事件
- 触点数量不同
  - 鼠标事件，触点仅1个
  - 触摸事件，触点有多个。event.touches

触摸事件，系统操作终止触摸事件，触发touchcancel（touchend事件不会触发）。