import { _decorator, Component, instantiate, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Poolts')
export class Poolts extends Component {
    // 节点池，用与管理和存储特效节点

    public static pool = new Map<string, Node[]>()

    // 从节点池中获取节点
    public static getNode(preFab: Node, parent: Node): Node {
        let node: Node | null = null
        let nodeNmae = preFab.name
        if (this.pool.has(nodeNmae)) {
            const nodeList = this.pool.get(nodeNmae)!
            if (nodeList.length > 0) {
                node = nodeList.pop()!
            }
        } else {
            node = instantiate(preFab) as Node
        }
        node.setParent(parent)
        return node!
    }

    public static putNode(node: Node) {
        let nodeNmae = node.name
        if (this.pool.has(nodeNmae)) {
            const nodeList = this.pool.get(nodeNmae)!
            nodeList.push(node)
        } else {
            this.pool.set(nodeNmae, [node])
        }
    }

    start() {}

    update(deltaTime: number) {}
}
