import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

interface EventData {
    func: Function
    target: any
}

interface EventList {
    [eventName: string]: EventData[]
}

@ccclass('EventListener')
export class EventListener extends Component {
    // 添加属性用于存储事件名称和事件的映射关系
    public static handler: EventList = {}

    // 绑定事件
    public static on(eventName: string, callback: Function, target: any) {
        if (!this.handler[eventName]) {
            this.handler[eventName] = []
        }
        this.handler[eventName].push({
            func: callback,
            target: target,
        })
    }

    // 取消监听
    public static off(eventName: string, callback: Function, target: any) {
        if (!this.handler[eventName]) {
            return
        }
        const eventList = this.handler[eventName]
        for (let i = 0; i < eventList.length; i++) {
            const event = eventList[i]
            if (event.func === callback && event.target === target) {
                eventList.splice(i, 1)
                break
            }
        }
    }

    // 事件派发
    public static dispatch(eventName: string, ...args: any[]) {
        if (!this.handler[eventName]) {
            return
        }
        const eventList = this.handler[eventName]
        for (let i = 0; i < eventList.length; i++) {
            const event = eventList[i]
            event.func.apply(event.target, args)
        }
    }

    // 事件监听和派发机制
    start() {}

    update(deltaTime: number) {}
}
