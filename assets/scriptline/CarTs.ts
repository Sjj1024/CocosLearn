import { _decorator, Component, Node } from 'cc'
import { Car } from './Car'
const { ccclass, property } = _decorator

@ccclass('CarTs')
export class CarTs extends Component {
    // 添加属性和小车关联：玩家小车还是AI小车
    @property({
        type: [Car],
    })
    mainCars: Car[] = []

    // 重置小车的位置
    public resetCar(points: Node[]) {
        console.log('carts reset car', points)
        // 拿到开始路径节点
        if (points.length <= 0) {
            console.warn('there is no points in this map')
            return
        }
        // 根据开始路径节点的第一个节点，为玩家小车的开始节点
        this.createCar(points[0])
    }

    // 创建小车节点和重置小车位置
    public createCar(point: Node) {
        // 将玩家小车的第一个路径点为节点，设置玩家小车的入口
        this.mainCars.forEach((car, num) => {
            car.setEntry(point, true, num)
        })
    }

    // 控制小车运动是否
    public canMove(isRun = true) {
        if (isRun) {
            this.mainCars.forEach((car) => {
                car.startRun()
            })
        } else {
            this.mainCars.forEach((car) => {
                car.stopRun()
            })
        }
    }

    start() {}

    update(deltaTime: number) {}
}
