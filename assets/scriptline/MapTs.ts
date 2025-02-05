import { _decorator, Component, Node } from 'cc'
import { GameMap } from './GameMap'
const { ccclass, property } = _decorator

@ccclass('MapTs')
export class MapTs extends Component {
    // 获取当前地图的路径节点（开始节点）
    public currentPath: Node[] = []

    // 重置地图管理器：拿到地图管理器下面的第一个地图节点
    public resetMap() {
        console.log('MapTs resetMap')
        // 拿到第一个地图节点后，获取第一个地图节点的地图脚本
        const currMap = this.node.children[0].getComponent(GameMap)
        // 拿到第一个地图脚本的开始坐标节点数组（因为开始坐标节点不止一个，玩家小车和AI小车都有开始坐标节点）
        this.currentPath = currMap.startPoint
        console.log('MapTs currentPath', this.currentPath)
    }

    start() {}

    update(deltaTime: number) {}
}
