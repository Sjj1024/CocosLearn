import {
    _decorator,
    Collider,
    Component,
    ITriggerEvent,
    Node,
    ParticleSystemComponent,
    Vec3,
} from 'cc'
import { ROAD_MOVE, RoadTs } from './RoadTs'
import { EventListener } from './EventListener'
import { EventName } from './data/Consts'
import { AudioTs } from './AudioTs'
const { ccclass, property } = _decorator

@ccclass('Car')
export class Car extends Component {
    private currPoint = null
    private pointA = new Vec3()
    private pointB = new Vec3()
    // 是否运行
    private isRun = false
    // 初始速度
    private speed = 0.2
    private offset = new Vec3()
    // 临时
    private tempVec = new Vec3()
    // 弯道运动的起始点旋转角度和中心点坐标
    private wStartRotate = 0
    private wEndPointRotate = 0
    private wCenterPoint = new Vec3()
    // 弯道运动的旋转率（弧度）
    private wRadius = 0
    // 最高速度
    private maxSpeed = 0.1
    // 加速度
    private acceleration = 0.1
    // 尾气离子特效
    private particle = null
    private isMainCar = false
    // 音乐管理类
    private audioTs: AudioTs = null
    // 是否加速道具作用
    private isProp = false
    // 是否减速道具作用
    private isSlow = false
    // 小车编号
    private num = 0

    // 设置小车的入口：entry为小车的开始坐标点节点
    public setEntry(entry: Node, isMainCar = false, num = 0) {
        console.log('car setEntry', entry)
        this.num = num
        this.isMainCar = isMainCar
        // 五辆小车的坐标系不一样，需要调整
        const newPos = new Vec3(
            entry.worldPosition.x + 2 * num,
            entry.worldPosition.y,
            entry.worldPosition.z
        )
        // 将玩家小车的位置重置为开始节点的世界坐标系
        this.node.setWorldPosition(newPos)
        // 获取当前路径节点的实例脚本对象
        this.currPoint = entry.getComponent(RoadTs)
        // 获取当前节点的世界坐标
        this.pointA.set(newPos)
        // 获取下一个站点的世界坐标
        // 五辆小车的下一个路径点不一样，需要调整
        const newNextPos = new Vec3(
            this.currPoint.nextPoint.worldPosition.x + 2 * num,
            this.currPoint.nextPoint.worldPosition.y,
            this.currPoint.nextPoint.worldPosition.z
        )
        this.pointB.set(newNextPos)
        // 根据下一个路径点和当前路径点的位置信息，设置小车的朝向
        const z = this.pointB.z - this.pointA.z
        const x = this.pointB.x - this.pointA.x
        // console.log('设置小车的朝向', z, x)
        if (z !== 0) {
            if (z < 0) {
                this.node.eulerAngles = new Vec3()
            } else {
                this.node.eulerAngles = new Vec3(0, 180, 0)
            }
        } else {
            if (x > 0) {
                this.node.eulerAngles = new Vec3(0, 270, 0)
            } else {
                this.node.eulerAngles = new Vec3(0, 90, 0)
            }
        }
        // 如果是玩家小车，就需要设置尾气离子特效
        if (isMainCar) {
            // this.particle = this.node.getChildByName('gas')
            // // 播放离子特效
            // this.particle.getComponent(ParticleSystemComponent).play()
        }
    }

    public startRun() {
        console.log('startRun')
        this.isRun = true
        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = 0.1
        // this.particle.getComponent(ParticleSystemComponent).play()
    }

    public stopRun() {
        // this.isRun = false
        this.acceleration = -0.2
        EventListener.dispatch(EventName.STARTSHA, this.node)
    }

    start() {
        // const name = this.node.name
        // 这个节点是否可用
        // this.node.active = false
        // 这个组件脚本是否可用
        // this.enabled = false
        // director.loadScene('Game')
        // director.preloadScene('Game')
        // sys.localStorage.setItem('name', 'xoqmvipnfo')
        // 网络请求
        // fetch('http://127.0.0.1:8080')
        //     .then((response: Response) => {
        //         return response.text()
        //     })
        //     .then((value) => {
        //         console.log(value)
        //     })
        // var wsInstance = new WebSocket('wss://echo.websocket.org', [])
        // 播放背景音乐
        this.audioTs = AudioTs.inst()
        // this.audioTs.playMusic('background')

        // 获取刚体组件，检测碰撞事件
        const colider = this.node.getComponent(Collider)
        colider.on('onTriggerEnter', this.onCollisionEnter, this)
    }

    onCollisionEnter(event: ITriggerEvent) {
        console.log('onCollisionEnter')
        const name = event.otherCollider.node.name
        if (name === 'bottle') {
            console.log('吃到加速道具，开始加速')
            // 播放碰撞的声音
            this.audioTs.playAudio('speedup2')
            // console.log(event)
            // 让另一个物体消失
            event.otherCollider.node.destroy()
            this.isProp = true
            // 设置最大速度
            this.maxSpeed = 0.3
            // 播放加速尾气
            this.particle = this.node.getChildByName('gas')
            // 播放离子特效
            this.particle.getComponent(ParticleSystemComponent).play()
        } else {
            // 播放碰撞的声音
            console.log('碰到了泥潭，开始减速')
            this.isSlow = true
            this.acceleration = -0.1
            // 播放碰撞的声音
            this.audioTs.playAudio('stop')
            // 将尾气颜色改为黑色
            // 播放加速尾气
            // 播放加速尾气
            this.particle = this.node.getChildByName('down')
            // 播放离子特效
            this.particle.getComponent(ParticleSystemComponent).play()
        }
    }

    update(deltaTime: number) {
        // console.log('update')
        const wPos = this.node.worldPosition
        this.offset.set(wPos)
        if (this.isRun && this.currPoint) {
            // console.log('update run')
            // 设置加速度
            this.speed += this.acceleration * deltaTime
            // 是否加速道具作用
            if (this.isProp) {
                console.log('加速道具开始加速', this.speed, this.maxSpeed)
                // 说明小车已经达到最大的道具速速，开始减速
                if (this.speed >= this.maxSpeed) {
                    console.log('加速到最高速度了,开始减速')
                    // this.speed = this.maxSpeed
                    this.maxSpeed = 0.1
                    // 开始减速
                    this.acceleration = -0.2
                }
                // 当速度减到正常速度后，就停止道具作用，并切把当前速度设置为0.2
                if (this.speed <= this.maxSpeed && this.acceleration < 0) {
                    this.speed = this.maxSpeed
                    this.isProp = false
                    this.acceleration = 0.2
                    console.log('加速到最高速度后减速到正常速度了，停用道具')
                    // // 播放离子特效
                    this.particle.getComponent(ParticleSystemComponent).stop()
                }
            }
            // 减速道具作用
            if (this.isSlow) {
                console.log('减速道具开始减速', this.speed, this.maxSpeed)
                if (this.speed < 0.0001) {
                    console.log('小车减速道具到0了，开始恢复速度')
                    this.acceleration = 0.1
                    this.isSlow = false
                    this.speed = 0.002
                    // // 播放离子特效
                    this.particle.getComponent(ParticleSystemComponent).stop()
                }
            }
            // 小车自己停止运动，不是道具影响
            if (!this.isProp && !this.isSlow) {
                if (this.speed > this.maxSpeed) {
                    this.speed = this.maxSpeed
                }
                // 如果速度小于0.001，说明小车已经停止了
                if (this.speed < 0.001) {
                    console.log('如果速度小于0.001，说明小车已经停止了')
                    this.isRun = false
                    EventListener.dispatch(EventName.ENDSHA)
                    // this.particle.getComponent(ParticleSystemComponent).stop()
                }
            }
            // console.log('update run', this.speed)
            // 根据下个点和小车的朝向，让小车运动
            // 判断是直线运动还是弯道
            if (this.currPoint.moveType === ROAD_MOVE.CURVE) {
                // 弯道运动
                // 计算得到需要旋转的角度
                const offsetRotate = this.wEndPointRotate - this.wStartRotate
                console.log('弯道运动', offsetRotate)
                // 将旋转角度转为正指处理
                const currentRotate = this.conversion(this.node.eulerAngles.y)
                // console.log(
                //     'currentRotate',
                //     currentRotate,
                //     this.wStartRotate,
                //     this.wEndPointRotate
                // )
                // 计算下一个点需要旋转的角度
                // 速度快点可以弥补旋转角度的误差
                let nextRotate =
                    currentRotate -
                    this.wStartRotate +
                    this.speed *
                        this.wRadius *
                        (this.wEndPointRotate > this.wStartRotate ? 1 : -1)
                // 如果下一个点的旋转值大于偏移值
                // console.log(
                //     '如果下一个点的旋转值大于偏移值',
                //     nextRotate,
                //     offsetRotate,
                //     Math.abs(this.wEndPointRotate - currentRotate)
                // )
                let target = 0
                if (Math.abs(this.wEndPointRotate - currentRotate) <= 3) {
                    nextRotate = offsetRotate
                    target = this.wEndPointRotate
                } else {
                    target = Math.trunc(this.wStartRotate + nextRotate)
                }
                // console.log('target---', this.wStartRotate, nextRotate, target)
                // 计算旋转偏移角度
                this.tempVec.set(0, target, 0)
                // console.log('this.tempVec 旋转角度', this.tempVec)
                // this.node.setRotationFromEuler(this.tempVec)
                this.node.eulerAngles = this.tempVec
                // 计算小车在x和z轴需要的偏移
                // const sin = Math.sin((nextRotate * Math.PI) / 180)
                // const cos = Math.cos((nextRotate * Math.PI) / 180)
                // const xLength = this.pointA.x - this.wCenterPoint.x
                // const zLength = this.pointA.z - this.wCenterPoint.z
                // const xpos = xLength * cos + zLength * sin + this.wCenterPoint.x
                // const zpos =
                //     -xLength * sin + zLength * cos + this.wCenterPoint.z
                // // console.log('xpos', xpos, 'zpos', zpos)
                // this.offset.set(xpos, 0, zpos)
                // 或者使用Cocos封装的Api
                Vec3.rotateY(
                    this.offset,
                    this.pointA,
                    this.wCenterPoint,
                    (nextRotate * Math.PI) / 180
                )
            } else {
                // 直线运动逻辑处理，小车朝向的方向
                const z = this.pointB.z - this.pointA.z
                if (z !== 0) {
                    if (z > 0) {
                        console.log('说明是z轴正方向')
                        this.node.eulerAngles = new Vec3(0, 180, 0)
                        this.offset.z += this.speed
                        if (this.offset.z > this.pointB.z) {
                            this.offset.z = this.pointB.z
                        }
                    } else {
                        console.log('说明是z轴负方向')
                        this.node.eulerAngles = new Vec3(0, 0, 0)
                        this.offset.z -= this.speed
                        if (this.offset.z < this.pointB.z) {
                            this.offset.z = this.pointB.z
                        }
                    }
                } else {
                    const x = this.pointB.x - this.pointA.x
                    if (x > 0) {
                        console.log('说明是x轴正方向')
                        this.node.eulerAngles = new Vec3(0, 270, 0)
                        this.offset.x += this.speed
                        if (this.offset.x > this.pointB.x) {
                            this.offset.x = this.pointB.x
                        }
                    } else {
                        console.log('说明是x轴负方向')
                        this.node.eulerAngles = new Vec3(0, 90, 0)
                        this.offset.x -= this.speed
                        if (this.offset.x < this.pointB.x) {
                            this.offset.x = this.pointB.x
                        }
                    }
                }
            }
            // 设置小车的位置
            this.node.setWorldPosition(this.offset)
            // 判断是否到达了某个站点
            Vec3.subtract(this.tempVec, this.pointB, this.offset)
            // console.log('距离.....', this.tempVec.length())
            if (this.tempVec.length() <= 0.14) {
                this.arrival()
            }
        }
    }

    arrival() {
        console.log('到达某个站点了.........', this.num, this.pointB)
        // 判断如果下个站点是弯道，就按喇叭
        this.pointA.set(this.pointB)
        // 显示金币播放动画
        // EventListener.dispatch(EventName.SHOWICON, this.node.worldPosition)
        // 到达某个站点了
        // 判断是否到达了终点
        if (this.currPoint.nextPoint) {
            this.currPoint = this.currPoint.nextPoint.getComponent(RoadTs)
            // 五辆小车的下一个路径点不一样，需要调整
            // const newNextPos = new Vec3(
            //     this.currPoint.nextPoint.worldPosition.x + 2 * this.num,
            //     this.currPoint.nextPoint.worldPosition.y,
            //     this.currPoint.nextPoint.worldPosition.z
            // )
            // this.pointB.set(this.currPoint.nextPoint.worldPosition)
            // console.log(
            //     'this.currPoint.nextPoint.moveType',
            //     this.currPoint.moveType
            // )

            // 判断下一个点是直线还是弯道
            if (this.currPoint.moveType === ROAD_MOVE.CURVE) {
                // 再判断是顺时针还是逆时针
                // this.pointB.set(this.currPoint.nextPoint.worldPosition)
                // this.audioTs.playAudio('tooting2')
                console.log('arrival---下一站弯道........')
                if (this.currPoint.clockwise) {
                    // 顺时针,得到旋转角度，并计算中心点
                    this.wStartRotate = this.conversion(this.node.eulerAngles.y)
                    // console.log('顺时针', this.wStartRotate)
                    // 结束点的y轴角度
                    this.wEndPointRotate = this.wStartRotate - 90
                    let newNextPos = new Vec3()
                    if (
                        this.wEndPointRotate === 270 ||
                        this.wEndPointRotate === 90
                    ) {
                        console.log('改变z轴坐标')
                        // 五辆小车的下一个路径点不一样，需要调整
                        newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z +
                                2 * this.num
                        )
                    } else {
                        console.log('改变x轴坐标')
                        // 五辆小车的下一个路径点不一样，需要调整
                        newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x +
                                2 * this.num,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z
                        )
                    }
                    this.pointB.set(newNextPos)

                    // 找到中心点坐标（如果b点的z轴小于a点的z轴并且b点的x轴大于a点的x轴）
                    // 或者B点的z轴大于a点的z轴 并且 b点的x轴小于a点的x轴
                    if (
                        (this.pointB.z < this.pointA.z &&
                            this.pointB.x > this.pointA.x) ||
                        (this.pointB.z > this.pointA.z &&
                            this.pointB.x < this.pointA.x)
                    ) {
                        // 中心点就取b点的x，z轴取a点的z轴
                        this.wCenterPoint.set(this.pointB.x, 0, this.pointA.z)
                    } else {
                        // 否则，中心点就取a点的x，z轴取b点的z轴
                        this.wCenterPoint.set(this.pointA.x, 0, this.pointB.z)
                    }
                } else {
                    // 逆时针
                    this.wStartRotate = this.conversion(this.node.eulerAngles.y)
                    // console.log('逆时针', this.wStartRotate)
                    this.wEndPointRotate = this.wStartRotate + 90

                    // 五辆小车的下一个路径点不一样，需要调整
                    const newNextPos = new Vec3(
                        this.currPoint.nextPoint.worldPosition.x,
                        this.currPoint.nextPoint.worldPosition.y,
                        this.currPoint.nextPoint.worldPosition.z + 2 * this.num
                    )
                    this.pointB.set(newNextPos)
                    // 如果b点的z轴大于a点的z轴 并且 b点的x轴大于a点的x轴
                    // 或者b点的z轴小于a点的z轴 并且 b点的x轴小于a点的x轴
                    if (
                        (this.pointB.z > this.pointA.z &&
                            this.pointB.x > this.pointA.x) ||
                        (this.pointB.z < this.pointA.z &&
                            this.pointB.x < this.pointA.x)
                    ) {
                        this.wCenterPoint.set(this.pointB.x, 0, this.pointA.z)
                    } else {
                        this.wCenterPoint.set(this.pointA.x, 0, this.pointB.z)
                    }
                }
                // 计算旋转半径
                Vec3.subtract(this.tempVec, this.pointA, this.wCenterPoint)
                const r = this.tempVec.length()
                console.log('旋转半径', this.num, r)
                // 计算旋转率：1度等于多少弧度
                this.wRadius = 360 / (2 * Math.PI * r)
            } else {
                console.log('下一站直线运动')
                const z =
                    this.currPoint.nextPoint.worldPosition.z +
                    2 * this.num -
                    this.pointA.z
                if (z !== 0) {
                    if (z > 0) {
                        console.log('下一站直线运动,说明是z轴正方向')
                        const newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x +
                                2 * this.num,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z
                        )
                        this.pointB.set(newNextPos)
                    } else {
                        console.log('下一站直线运动,说明是z轴负方向')
                        const newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x +
                                2 * this.num,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z
                        )
                        this.pointB.set(newNextPos)
                    }
                } else {
                    const x =
                        this.currPoint.nextPoint.worldPosition.x - this.pointA.x
                    if (x > 0) {
                        console.log('下一站直线运动,说明是x轴正方向')
                        const newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z +
                                2 * this.num
                        )
                        this.pointB.set(newNextPos)
                    } else {
                        console.log('下一站直线运动,说明是x轴负方向')
                        const newNextPos = new Vec3(
                            this.currPoint.nextPoint.worldPosition.x,
                            this.currPoint.nextPoint.worldPosition.y,
                            this.currPoint.nextPoint.worldPosition.z -
                                2 * this.num
                        )
                        this.pointB.set(newNextPos)
                    }
                }
                // 五辆小车的下一个路径点不一样，需要调整
                // const newNextPos = new Vec3(
                //     this.currPoint.nextPoint.worldPosition.x + 2 * this.num,
                //     this.currPoint.nextPoint.worldPosition.y,
                //     this.currPoint.nextPoint.worldPosition.z
                // )
                // this.pointB.set(newNextPos)
            }
        } else {
            console.log('到达终点了')
            this.isRun = false
            // this.currPoint = null
        }
    }

    // 方便计算，将旋转角度同意转为正数
    conversion(value: number) {
        // let a = Math.trunc(value)
        let a = value
        if (a <= 0) {
            a = 360 + a
        }
        return a
    }
}
