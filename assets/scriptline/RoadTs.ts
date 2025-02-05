import { _decorator, Component, Enum, Node, Vec3 } from 'cc'
const { ccclass, property } = _decorator

// 定义路径点类型：开始，结束，接客，送客，正常等
export enum ROAD_POINT {
    NORMAL = 0,
    START,
    END,
    GREET,
    BYE,
    AI,
}

// 移动类型：直线还是弯道
export enum ROAD_MOVE {
    LINE = 0,
    CURVE,
}

// 为了让在面板上显示出来下来框
Enum(ROAD_POINT)
Enum(ROAD_MOVE)

@ccclass('RoadTs')
export class RoadTs extends Component {
    // 路径点类型
    @property({
        type: ROAD_POINT,
        displayOrder: 1,
    })
    roadPoint: ROAD_POINT = ROAD_POINT.NORMAL

    // 下一个站点,结束点不显示这个属性
    @property({
        type: Node,
        displayOrder: 2,
        visible: function (this: RoadTs) {
            return this.roadPoint != ROAD_POINT.END
        },
    })
    nextPoint: Node = null

    // 移动类型
    @property({
        type: ROAD_MOVE,
        displayOrder: 3,
        visible: function (this: RoadTs) {
            return this.roadPoint != ROAD_POINT.END
        },
    })
    moveType: ROAD_MOVE = ROAD_MOVE.LINE

    // 弯道时顺时针还是逆时针：clockwise顺时针，是弯道的时候才显示，并且最后一个路径点不显示
    @property({
        type: Boolean,
        displayOrder: 4,
        visible: function (this: RoadTs) {
            return (
                this.moveType === ROAD_MOVE.CURVE &&
                this.roadPoint != ROAD_POINT.END
            )
        },
    })
    clockwise: true

    // 接客送客的方向：左边还是右边，接客还是送客点才有
    @property({
        type: Vec3,
        displayOrder: 5,
        visible: function (this: RoadTs) {
            return (
                this.roadPoint === ROAD_POINT.GREET ||
                this.roadPoint === ROAD_POINT.BYE
            )
        },
    })
    direct = new Vec3(1, 0, 0)

    // ai小车的属性：多久一个，延迟多久出现
    @property({
        visible: function (this: RoadTs) {
            return this.roadPoint === ROAD_POINT.AI
        },
    })
    interval = 3

    @property({
        visible: function (this: RoadTs) {
            return this.roadPoint === ROAD_POINT.AI
        },
    })
    delay = 0

    // AI小车的速度
    @property({
        visible: function (this: RoadTs) {
            return this.roadPoint === ROAD_POINT.AI
        },
    })
    speed = 0.1

    // ai小车的类型:201,202
    @property({
        visible: function (this: RoadTs) {
            return this.roadPoint === ROAD_POINT.AI
        },
    })
    aiType = '201'

    start() {}

    update(deltaTime: number) {}
}
