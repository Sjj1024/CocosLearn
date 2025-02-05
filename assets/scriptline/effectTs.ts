import { _decorator, Component, Node, ParticleSystemComponent } from 'cc'
import { EventListener } from './EventListener'
import { EventName } from './data/Consts'
import { Poolts } from './data/Poolts'
const { ccclass, property } = _decorator

@ccclass('effectTs')
export class effectTs extends Component {
    // 获取特效节点
    @property(Node)
    public shaNode: Node = null!

    // 获取图标节点
    @property(Node)
    public iconNode: Node = null!

    // 跟随节点和当前特效节点
    private followNode: Node | null = null
    // 跟随节点的位置
    private currentSha: Node | null = null

    start() {
        EventListener.on(EventName.STARTSHA, this.startSha, this)
        EventListener.on(EventName.ENDSHA, this.endSha, this)
        EventListener.on(EventName.SHOWICON, this.showIcon, this)
        EventListener.on(EventName.HIDEICON, this.hideIcon, this)
    }

    startSha(...args: any[]) {
        console.log('开始刹车')
        // const followNode = args[0]
        // this.currentSha = Poolts.getNode(this.shaNode, this.node)
        // this.currentSha.setWorldPosition(followNode.worldPosition)
        // ParticleUtils.play(this.currentSha)
    }

    endSha() {
        console.log('结束刹车')
        // const currentSha = this.currentSha
        // this.scheduleOnce(() => {
        //     ParticleUtils.stop(currentSha)
        //     Poolts.putNode(currentSha)
        // }, 0.5)
        // this.currentSha = null
        // this.followNode = null
    }

    showIcon(...args: any[]) {
        console.log('显示金币并播放动画')
        const pos = args[0]
        this.iconNode.setWorldPosition(pos)
        this.iconNode.getComponent(ParticleSystemComponent).play()
    }

    hideIcon() {
        console.log('隐藏金币并停止动画')
        this.iconNode.getComponent(ParticleSystemComponent).stop()
    }

    update(deltaTime: number) {}
}
