import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

export enum EventName {
    STARTSHA = 'STARTSHA',
    ENDSHA = 'ENDSHA',
    SHOWICON = 'SHOWICON',
    HIDEICON = 'HIDEICON',
}

@ccclass('Consts')
export class Consts extends Component {
    start() {}

    update(deltaTime: number) {}
}
