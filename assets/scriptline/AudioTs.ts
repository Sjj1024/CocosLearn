import {
    _decorator,
    AudioClip,
    AudioSource,
    director,
    resources,
    Node,
} from 'cc'
const { ccclass } = _decorator

// 音频管理类，任何组件都可以调用
@ccclass('AudioTs')
export class AudioTs {
    // @en singleton instance
    private static _inst: AudioTs
    public static inst(): AudioTs {
        if (this._inst == null) {
            this._inst = new AudioTs()
        }
        return this._inst
    }

    //@en audioSource component
    //@zh 音频源组件
    private audioSource: AudioSource = null

    constructor() {
        //@en create a node as audioMgr
        //@zh 创建一个节点作为 audioMgr
        let audioMgr = new Node()
        audioMgr.name = '__audioMgr__'
        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr)

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr)

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this.audioSource = audioMgr.addComponent(AudioSource)
    }

    // 播放音效
    public playAudio(audioName: string, volume: number = 1) {
        const path = `audio/sound/${audioName}`
        resources.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error(err)
                return
            }
            this.audioSource.playOneShot(clip, volume)
        })
    }

    // 播放背景音乐
    public playMusic(audioName: string) {
        const path = `audio/music/${audioName}`
        console.log('播放背景音乐', path)
        resources.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error('music err', err)
                return
            }
            this.audioSource.clip = clip
            this.audioSource.loop = true
            this.audioSource.play()
            this.audioSource.volume = 1
        })
    }
}
