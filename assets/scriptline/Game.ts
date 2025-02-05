import { _decorator, Component, Input, Node } from 'cc'
import { MapTs } from './MapTs'
import { CarTs } from './CarTs'
import { AudioTs } from './AudioTs'
const { ccclass, property } = _decorator

@ccclass('Game')
export class Game extends Component {
    // 地图管理类，用于管理地图
    @property({
        type: MapTs,
    })
    mapManager: MapTs = null

    // 小车管理类，用于管理小车
    @property({
        type: CarTs,
    })
    carManager: CarTs = null

    // UI界面管理
    @property({
        type: Node,
    })
    uiManager: Node = null

    // 音乐管理类
    private audioTs: AudioTs = null

    // UI点击开始游戏触发的事件
    public startGame() {
        console.log('start game')
        // 重置地图管理器
        // this.mapManager.resetMap()
        // 拿到小车管理器，重置小车（根据地图管理器的开始节点位置重置）
        // this.carManager.resetCar(this.mapManager.currentPath)
        // 开始游戏
        this.uiManager.active = false
        this.carManager.canMove()
    }

    onLoad(): void {
        console.log('game on load')
        // 得到地图管理器和小车管理器
        // 重置地图管理器
        this.mapManager.resetMap()
        // 拿到小车管理器，重置小车（根据地图管理器的开始节点位置重置）
        this.carManager.resetCar(this.mapManager.currentPath)
    }
    start() {
        // 绑定屏幕点几开始和结束的事件，根据事件点击开始，小车运动，触摸结束，小车停止运动
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(Input.EventType.TOUCH_END, this.touchEnd, this)
        // 开局就让小车运动
        // this.carManager.canMove()
        // 播放背景音乐
        this.audioTs = AudioTs.inst()
        this.audioTs.playAudio('start3')
        this.audioTs.playMusic('run1')
    }

    touchStart() {
        // console.log('触摸开始')
        this.carManager.canMove()
    }

    touchEnd() {
        // console.log('触摸结束')
        this.carManager.canMove(false)
    }

    update(deltaTime: number) {}
}
