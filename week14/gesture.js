export class Dispatcher {constructor(el) {
    this.el = el;
  }

  dispatch(type, properties) {
    let event = new Event(type);
    // 拷贝事件参数
    for (let name in properties) {
      event[name] = properties[name];
    }
    console.log(event)
    this.el.dispatchEvent(event);
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  start(point, context) {
    (context.startX = point.clientX), (context.startY = point.clientY);
    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];

    // 默认是 tap 点击事件
    context.isPan = false;
    context.isTap = true;
    context.isPress = false;

    // > 500ms，长按事件
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;

      this.dispatcher.dispatch("press", {});
    }, 500);
  }

  move(point, context) {
    const { clientX, clientY } = point;

    let dx = clientX - context.startX,
      dy = clientY - context.startY;

    const properties = {
      clientX,
      clientY,
      startX: context.startX,
      startY: context.startY,
      isVertical: context.isVertical,
    };

    // 移动距离超 10px, pan 事件
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch("panstart", properties);

      clearTimeout(context.handler);
    }

    if (context.isPan) {
      this.dispatcher.dispatch("pan", properties);
    }

    // 记录移动经过的点 (间隔 500ms)
    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});
    }

    // 计算平均速度
    let v = 0,
      s;
    if (context.points.length < 1) {
      v = 0;
    } else {
      context.points = context.points.filter(
        (point) => Date.now() - point.t < 500
        );
      s = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2
      );
      v = s / (Date.now() - context.points[0].t);
    }

    // 速度超过 1.5，快速滑动
    context.isFlick = v > 1.5;
    const { clientX, clientY } = point;
    const properties = {
      clientX,
      clientY,
      startX: context.startX,
      startY: context.startY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
    };
    context.isFlick
      ? this.dispatcher.dispatch("panend", {
          ...properties,
          velocity: v,
        })
      : null;

    if (context.isPan) {
      this.dispatcher.dispatch("flick", properties);
    }
  }

  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch("cancel", {});
  }
}

export class Listener {
  constructor(el, recognizer) {
    let isListeningMouse = false;

    el.addEventListener("mousedown", (event) => {
     // 左键 button: 0, buttons: 1
     // 中键 button: 1, buttons: 4
     // 右键 button: 2, buttons: 2
     // 侧下键 button: 3, buttons: 8
     // 侧上键 button: 4, buttons: 16
      let context = Object.create(null);
      let contexts = new Map();
      contexts.set(`mouse${1 << event.button}`, context);

      recognizer.start(event, context);
      
      const mousemove = (event) => {
        let button = 1;
        
        // 这一段没太懂？？？
        while (button <= event.buttons) {
          if (button & event.buttons) {
            // order of buttons & button property is not same
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            let context = contexts.get(`mouse${key}`);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };

      const mouseup = (event) => {
        let context = contexts.get(`mouse${1 << event.button}`);
        recognizer.end(event, context);
        contexts.delete(`mouse${1 << event.button}`);

        if (event.buttons === 0) {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
          isListeningMouse = false;
        }
      };

      if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
      }
    });

    el.addEventListener("touchstart", (event) => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });

    el.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });

    el.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });

    el.addEventListener("touchcancel", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

export function enableGesture(el) {
  new Listener(el, new Recognizer(new Dispatcher(el)));
}
