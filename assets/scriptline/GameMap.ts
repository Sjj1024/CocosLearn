import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameMap')
export class GameMap extends Component {
    // 用于管理控制游戏地图，

    // 添加路径的开始点，比如玩家小车配置一个开始路径点，AI小车配置一个开始路径点，只需要配置开始的路径点就可以了，
    @property({
        type: [Node],
    })
    startPoint: Node[] = []

    start() {}

    update(deltaTime: number) {}
}
