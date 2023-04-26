class WebPlatform {
    constructor() {
        this.navigateActive = false;
        let canvas = document.getElementById("layaCanvas");
        canvas && canvas.addEventListener("mouseup", () => {
            if (this.navigateActive) {
                this.navigateActive = false;
                YYGSDK.navigate(this._screenName, this._buttonName, this._gameId);
            }
        });
        canvas && canvas.addEventListener("touchend", () => {
            if (this.navigateActive) {
                this.navigateActive = false;
                YYGSDK.navigate(this._screenName, this._buttonName, this._gameId);
            }
        });
        this._prompt = new Prompt();
        this._prompt.init();
    }
    navigate(screenName, buttonName, gameId) {
        if (this.navigateActive === false) {
            this.navigateActive = true;
            this._screenName = screenName;
            this._buttonName = buttonName;
            this._gameId = gameId;
        }
    }
    showInterstitial(complete) {
        let needresume = false
        if (!Laya.SoundManager.muted) {
            needresume = true;
            Laya.SoundManager.muted = true;
        }
        YYGSDK.showInterstitial(() => {
            if (needresume) {
                Laya.SoundManager.muted = false;
            }
            complete && complete();
        });
    }
    getStorageSync(key) {
        let v = Laya.LocalStorage.getItem(key);
        return JSON.parse(v);
    }
    setStorageSync(key, value) {
        return Laya.LocalStorage.setItem(key, JSON.stringify(value));
    }
    showReward(success, failure) {
        let needresume = false
        if (!Laya.SoundManager.muted) {
            needresume = true;
            Laya.SoundManager.muted = true;
        }
        YYGSDK.adsManager.request(YYG.TYPE.REWARD, YYG.EventHandler.create(this, () => {
            if (needresume) {
                Laya.SoundManager.muted = false;
            }
            success && success();
        }), YYG.EventHandler.create(this, (event) => {
            if (needresume) {
                Laya.SoundManager.muted = false;
            }
            if (failure) {
                failure();
            } else {
                if (event == YYG.Event.AD_SKIPPED) {
                    this._prompt.prompt("Failed to get the reward, please watch the ads to the end.")
                }
            }
        }));
    }

    prompt(txt) {
        this._prompt.prompt(txt)
    }

    getForgames() {
        let forgames = YYGSDK.forgames;
        forgames.sort(function(a, b) {
            return Math.random() - 0.5;
        });
        return forgames;
    }
    showLoading(title) {}
    hideLoading() {}
}

// class platform {
//     static _init_() {
//         this._platform = new WebPlatform();
//     }
//     static getInstance() {
//         if (!this._platform) {
//             this._init_();
//         }
//         return this._platform;
//     }
// }
// platform._platform = null;
// window["platform"] = platform;


class Prompt {
    init() {
        this.bgSprite = new Laya.Image("common/img_infoBase.png"),
            this.bgSprite.width = Laya.stage.width - 40,
            this.bgSprite.height = 30,
            this.bgSprite.anchorX = .5,
            this.bgSprite.anchorY = .5,
            this.bgSprite.x = Laya.stage.width / 2,
            this.bgSprite.y = Laya.stage.height / 3,
            this.textOffx = 30,
            this.textOffy = 15,

            this.tipText = new Laya.Label(),
            this.bgSprite.addChild(this.tipText),
            this.tipText.width = this.bgSprite.width - 2 * this.textOffx,
            this.tipText.fontSize = 28,
            this.tipText.align = "center",
            this.tipText.color = "#ffffff",
            this.tipText.wordWrap = true;
        this.tipText.y = this.textOffy,
            this.bgSprite.zOrder = 2e3,
            Laya.stage.addChild(this.bgSprite),
            this.timeLine = new Laya.TimeLine(),
            this.timeLine.addLabel("scale", 0).to(this.bgSprite, {
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 1
            }, 100, null, 0).addLabel("back", 0).to(this.bgSprite, {
                scaleX: 1,
                scaleY: 1,
                alpha: 1
            }, 100, null, 0).addLabel("show", 0).to(this.bgSprite, {
                alpha: 1
            }, 1e3, null, 0).addLabel("hide", 0).to(this.bgSprite, {
                alpha: 0
            }, 1e3, null, 0), this.timeLine.on(Laya.Event.COMPLETE, this, this.onComplete),
            this.mouseThrough = !0;
        this.onComplete();
    }

    onComplete() {
        this.bgSprite.alpha = 0;
        this.visible = !1, this.mouseThrough = !0;
    }
    removeRes() {
        this.timeLine.destroy();
    }

    prompt(e) {
        this.tipText.text = e, this.tipText.x = this.textOffx, this.bgSprite.height = 50 + this.textOffx,
            this.timeLine.play(0, !1), this.visible = !0;
    }
    resize() {
        this.bgSprite && (this.bgSprite.width = Laya.stage.width - 40, this.bgSprite.height = this.tipText.contextHeight + this.textOffx,
            this.bgSprite.x = Laya.stage.width / 2, this.bgSprite.y = Laya.stage.height / 8,
            this.tipText && (this.tipText.style.width = this.bgSprite.width - 2 * this.textOffx));
    }
}





! function() {
    "use strict";
    class e {
        constructor() {}
        static init() {
            Laya.ClassUtils.regClass;
        }
    }
    e.width = 720, e.height = 1280, e.scaleMode = "fixedwidth", e.screenMode = "vertical",
        e.alignV = "top", e.alignH = "left", e.startScene = "Loading.scene", e.sceneRoot = "",
        e.debug = !1, e.stat = !1, e.physicsDebug = !1, e.exportSceneToJson = !1, e.init();
    class t {
        static open(e, t = !0, i) {
            if (this.list.length > 0 && this.list[this.list.length - 1].name == e.name) return;
            if (this.uiLayer || (this.uiLayer = new Laya.Sprite(), this.uiLayer.size(Laya.stage.width, Laya.stage.height),
                    Laya.stage.addChild(this.uiLayer)), t)
                for (; this.list.length > 0;) {
                    let e = this.list.shift();
                    e && e.close();
                }
            let s = new e();
            s.name = e.name, s.size(Laya.stage.width, Laya.stage.height), s.autoDestroyAtClosed = !0,
                this.uiLayer.addChild(s), this.list.push(s), s.onOpened(i);
        }
        static close(e) {
            for (let t = this.list.length - 1; t >= 0; t--)
                if (e.name == this.list[t].name) {
                    this.list.splice(t, 1)[0].close();
                    break;
                }
        }
    }
    t.list = [];
    var i, s = Laya.ClassUtils.regClass;
    ! function(e) {
        class t extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(t.uiView);
            }
        }
        t.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280
            },
            compId: 2,
            child: [{
                type: "Image",
                props: {
                    top: 0,
                    skin: "ui/loading_color.png",
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                compId: 4
            }, {
                type: "Box",
                props: {
                    x: 24,
                    centerY: 0
                },
                compId: 18,
                child: [{
                    type: "Image",
                    props: {
                        y: 274,
                        x: 2,
                        width: 670,
                        skin: "ui/50r15.png",
                        sizeGrid: "10,10,10,10",
                        height: 822
                    },
                    compId: 26,
                    child: [{
                        type: "List",
                        props: {
                            y: 12,
                            x: 14,
                            width: 665,
                            var: "list",
                            spaceY: 20,
                            spaceX: 20,
                            repeatY: 3,
                            repeatX: 3,
                            height: 793
                        },
                        compId: 12,
                        child: [{
                            type: "Box",
                            props: {
                                x: 0,
                                width: 200,
                                skin: "ui/adframe.png",
                                sizeGrid: "20,20,20,20",
                                renderType: "render",
                                height: 150,
                                alpha: 1
                            },
                            compId: 7,
                            child: [{
                                type: "Image",
                                props: {
                                    y: 5,
                                    width: 200,
                                    name: "thumb",
                                    left: 5,
                                    height: 150
                                },
                                compId: 9,
                                child: [{
                                    type: "Image",
                                    props: {
                                        y: 0,
                                        x: 0,
                                        width: 200,
                                        skin: "ui/mask_0.png",
                                        sizeGrid: "20,20,10,20",
                                        renderType: "mask",
                                        name: "mask",
                                        height: 150
                                    },
                                    compId: 16
                                }]
                            }]
                        }]
                    }]
                }, {
                    type: "Image",
                    props: {
                        y: 35,
                        x: 2,
                        width: 660,
                        skin: "ui/50r15.png",
                        sizeGrid: "16,16,16,16",
                        height: 179
                    },
                    compId: 24,
                    child: [{
                        type: "List",
                        props: {
                            y: 13,
                            x: 8,
                            width: 642,
                            var: "list1",
                            spaceX: -2,
                            repeatY: 1,
                            height: 160
                        },
                        compId: 19,
                        child: [{
                            type: "Box",
                            props: {
                                y: 1,
                                x: 0,
                                renderType: "render"
                            },
                            compId: 20,
                            child: [{
                                type: "Image",
                                props: {
                                    y: 0,
                                    x: 5,
                                    width: 120,
                                    skin: "ui/shop_color.png",
                                    name: "icon",
                                    height: 120,
                                    sizeGrid: "2,2,2,2"
                                },
                                compId: 21
                            }, {
                                type: "Text",
                                props: {
                                    y: 125,
                                    x: 0,
                                    width: 130,
                                    valign: "middle",
                                    text: "冲鸭彩虹屁",
                                    name: "title",
                                    height: 30,
                                    fontSize: 22,
                                    color: "#000000",
                                    align: "center",
                                    runtime: "laya.display.Text"
                                },
                                compId: 22
                            }]
                        }]
                    }]
                }, {
                    type: "Text",
                    props: {
                        text: "好友在玩",
                        fontSize: 30,
                        color: "#f9c700",
                        bold: !0,
                        runtime: "laya.display.Text"
                    },
                    compId: 17
                }, {
                    type: "Text",
                    props: {
                        y: 242,
                        x: 0,
                        text: "热门推荐",
                        fontSize: 30,
                        color: "#f9f900",
                        bold: !0,
                        runtime: "laya.display.Text"
                    },
                    compId: 25
                }, {
                    type: "Button",
                    props: {
                        y: 1106,
                        x: 238,
                        var: "back",
                        stateNum: 1,
                        skin: "ui/ranking_continue.png",
                        centerX: 0
                    },
                    compId: 5
                }]
            }],
            loadList: ["ui/loading_color.png", "ui/50r15.png", "ui/adframe.png", "ui/mask_0.png", "ui/shop_color.png", "ui/ranking_continue.png"],
            loadList3D: []
        }, e.CnxhUI = t, s("ui.CnxhUI", t);

        class i extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(i.uiView);
            }
        }
        i.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280
            },
            compId: 2,
            child: [{
                type: "Image",
                props: {
                    var: "bg",
                    top: 0,
                    skin: "ui/8x8_blck.png",
                    sizeGrid: "2,2,2,2",
                    right: 0,
                    left: 0,
                    bottom: -5,
                    alpha: .6
                },
                compId: 47
            }, {
                type: "Box",
                props: {
                    x: 191,
                    var: "complete",
                    bottom: 240
                },
                compId: 22,
                child: [{
                    type: "Button",
                    props: {
                        var: "normalGet",
                        stateNum: 1,
                        skin: "ui/settlement_receive_btn.png"
                    },
                    compId: 18
                }, {
                    type: "Button",
                    props: {
                        y: 130,
                        var: "videGit",
                        stateNum: 1,
                        skin: "ui/settlement_receive_x3_btn.png"
                    },
                    compId: 19
                }]
            }, {
                type: "Box",
                props: {
                    x: 191,
                    var: "failed",
                    bottom: 240
                },
                compId: 23,
                child: [{
                    type: "Button",
                    props: {
                        var: "retry",
                        stateNum: 1,
                        skin: "ui/settlement_again_btn.png",
                        labelSize: 30
                    },
                    compId: 12
                }, {
                    type: "Button",
                    props: {
                        y: 130,
                        var: "videoRelife",
                        stateNum: 1,
                        skin: "ui/over_resurrection_btn.png"
                    },
                    compId: 11
                }]
            }, {
                type: "Sprite",
                props: {
                    y: 40,
                    x: 20,
                    var: "goldBox"
                },
                compId: 36,
                child: [{
                    type: "Sprite",
                    props: {
                        width: 50,
                        var: "imgGold",
                        texture: "ui/shop_golod.png",
                        height: 50
                    },
                    compId: 37
                }, {
                    type: "FontClip",
                    props: {
                        y: 10,
                        x: 50,
                        width: 248,
                        var: "gold",
                        value: "200",
                        spaceX: -6,
                        skin: "ui/nub.png",
                        sheet: "0123456789+",
                        scaleY: .8,
                        scaleX: .8,
                        height: 51,
                        align: "left"
                    },
                    compId: 38
                }]
            }, {
                type: "Image",
                props: {
                    x: 20,
                    width: 680,
                    var: "mzsad",
                    skin: "ui/adframe.png",
                    sizeGrid: "26,26,26,26",
                    height: 421,
                    centerY: -63
                },
                compId: 46,
                child: [{
                    type: "List",
                    props: {
                        y: 20,
                        x: 15,
                        width: 650,
                        var: "list",
                        spaceY: 10,
                        spaceX: 5,
                        repeatY: 3,
                        repeatX: 4,
                        height: 360
                    },
                    compId: 40,
                    child: [{
                        type: "Box",
                        props: {
                            y: 0,
                            x: 0,
                            width: 160,
                            renderType: "render",
                            height: 120,
                            alpha: 1
                        },
                        compId: 41,
                        child: [{
                            type: "Image",
                            props: {
                                top: 0,
                                right: 0,
                                name: "thumb",
                                left: 0,
                                height: 120
                            },
                            compId: 42,
                            child: []
                        }]
                    }]
                }, {
                    type: "Box",
                    props: {
                        width: 682,
                        var: "points1",
                        height: 812,
                        centerY: 7,
                        centerX: -34
                    },
                    compId: 70,
                    child: [{
                        type: "Box",
                        props: {
                            y: 616,
                            x: 47,
                            width: 100,
                            height: 100
                        },
                        compId: 71
                    }, {
                        type: "Box",
                        props: {
                            y: 620,
                            x: 542,
                            width: 100,
                            height: 100
                        },
                        compId: 72
                    }, {
                        type: "Box",
                        props: {
                            y: 11,
                            x: 47,
                            width: 100,
                            height: 100
                        },
                        compId: 73
                    }, {
                        type: "Box",
                        props: {
                            y: 11,
                            x: 542,
                            width: 100,
                            height: 100
                        },
                        compId: 74
                    }]
                }]
            }, {
                type: "ProgressBar",
                props: {
                    y: 70,
                    x: 138,
                    var: "levelProgress",
                    value: 1,
                    skin: "ui/progress_level.png",
                    centerX: 0
                },
                compId: 8,
                child: [{
                    type: "Text",
                    props: {
                        y: 12,
                        x: 139,
                        width: 167,
                        var: "levelNum",
                        text: "第 90 关",
                        height: 40,
                        fontSize: 40,
                        color: "#ffffff",
                        align: "center",
                        runtime: "laya.display.Text"
                    },
                    compId: 9
                }]
            }, {
                type: "Text",
                props: {
                    y: 240,
                    x: 179,
                    width: 364,
                    var: "info",
                    text: "50%完成",
                    height: 66,
                    fontSize: 66,
                    color: "#81ff86",
                    align: "center",
                    runtime: "laya.display.Text"
                },
                compId: 10
            }, {
                type: "Image",
                props: {
                    y: 252,
                    x: -1,
                    var: "award",
                    skin: "ui/settlement_color01.png"
                },
                compId: 17,
                child: [{
                    type: "Sprite",
                    props: {
                        y: 20.5,
                        x: 395,
                        width: 50,
                        var: "goldImg",
                        texture: "ui/shop_golod.png",
                        height: 50
                    },
                    compId: 15
                }, {
                    type: "Text",
                    props: {
                        y: 20,
                        x: 220,
                        width: 163,
                        var: "getGoldNum",
                        text: "+100",
                        height: 50,
                        fontSize: 50,
                        align: "right",
                        runtime: "laya.display.Text"
                    },
                    compId: 16
                }]
            }, {
                type: "Box",
                props: {
                    var: "tuijian",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                compId: 51,
                child: [{
                        type: "Image",
                        props: {
                            width: 660,
                            skin: "ui/50r15.png",
                            height: 489,
                            centerY: 13,
                            centerX: 0,
                            sizeGrid: "16,16,16,16"
                        },
                        compId: 52,
                        child: [{
                            type: "List",
                            props: {
                                y: 43.5,
                                x: 15.5,
                                width: 629,
                                var: "hlist0",
                                spaceX: 10,
                                repeatY: 1,
                                height: 201
                            },
                            compId: 55,
                            child: [{
                                type: "Sprite",
                                props: {
                                    width: 150,
                                    renderType: "render",
                                    height: 195
                                },
                                compId: 56,
                                child: [{
                                    type: "Image",
                                    props: {
                                        y: 0,
                                        x: 5,
                                        width: 140,
                                        skin: "ui/shop_return.png",
                                        name: "icon",
                                        height: 140
                                    },
                                    compId: 57
                                }, {
                                    type: "Text",
                                    props: {
                                        y: 143,
                                        x: 0,
                                        width: 150,
                                        valign: "middle",
                                        text: "线条冲刺",
                                        name: "title",
                                        height: 52,
                                        fontSize: 28,
                                        color: "#585858",
                                        align: "center",
                                        runtime: "laya.display.Text"
                                    },
                                    compId: 58
                                }]
                            }]
                        }, {
                            type: "List",
                            props: {
                                y: 276,
                                x: 15.5,
                                width: 629,
                                var: "hlist1",
                                spaceX: 10,
                                repeatY: 1,
                                height: 201
                            },
                            compId: 59,
                            child: [{
                                type: "Sprite",
                                props: {
                                    width: 150,
                                    renderType: "render",
                                    height: 195
                                },
                                compId: 60,
                                child: [{
                                    type: "Image",
                                    props: {
                                        y: 0,
                                        x: 5,
                                        width: 140,
                                        skin: "ui/shop_return.png",
                                        name: "icon",
                                        height: 140
                                    },
                                    compId: 61
                                }, {
                                    type: "Text",
                                    props: {
                                        y: 143,
                                        x: 0,
                                        width: 150,
                                        valign: "middle",
                                        text: "线条冲刺",
                                        name: "title",
                                        height: 52,
                                        fontSize: 28,
                                        color: "#585858",
                                        align: "center",
                                        runtime: "laya.display.Text"
                                    },
                                    compId: 62
                                }]
                            }]
                        }]
                    },
                    {
                        type: "Button",
                        props: {
                            var: "tjskip",
                            stateNum: 1,
                            skin: "ui/skip.png",
                            centerX: 0,
                            bottom: 280
                        },
                        compId: 63
                    }, {
                        type: "Box",
                        props: {
                            width: 682,
                            var: "points0",
                            height: 812,
                            centerY: -7,
                            centerX: -21
                        },
                        compId: 65,
                        child: [{
                            type: "Box",
                            props: {
                                y: 674,
                                x: 47,
                                width: 100,
                                height: 100
                            },
                            compId: 66
                        }, {
                            type: "Box",
                            props: {
                                y: 678,
                                x: 542,
                                width: 100,
                                height: 100
                            },
                            compId: 67
                        }, {
                            type: "Box",
                            props: {
                                y: 11,
                                x: 47,
                                width: 100,
                                height: 100
                            },
                            compId: 68
                        }, {
                            type: "Box",
                            props: {
                                y: 11,
                                x: 542,
                                width: 100,
                                height: 100
                            },
                            compId: 69
                        }]
                    }
                ]
            }],
            loadList: ["ui/8x8_blck.png", "ui/settlement_receive_btn.png", "ui/settlement_receive_x3_btn.png", "ui/settlement_again_btn.png", "ui/over_resurrection_btn.png", "ui/shop_golod.png", "ui/nub.png", "ui/adframe.png", "ui/end_colour_0.png", "ui/mask_0.png", "ui/progress_level.png", "ui/settlement_color01.png", "ui/50r15.png", "ui/shop_return.png", "ui/skip.png"],
            loadList3D: []
        }, e.GameUI = i, s("ui.GameUI", i);
        class a extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(a.uiView);
            }
        }
        a.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280
            },
            compId: 2,
            child: [{
                type: "Button",
                props: {
                    var: "start",
                    top: 0,
                    stateNum: 1,
                    skin: "ui/8x8.png",
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                compId: 19
            }, {
                type: "Box",
                props: {
                    centerX: -1,
                    bottom: 281
                },
                compId: 15,
                child: [{
                    type: "Button",
                    props: {
                        y: -8,
                        centerX: 0,
                        width: 150,
                        var: "skin",
                        stateNum: 1,
                        skin: "ui/hong_shop_btn.png",
                        height: 148
                    },
                    compId: 29
                }]
            }, {
                type: "Sprite",
                props: {
                    y: 59,
                    x: 20,
                    var: "goldBox"
                },
                compId: 14,
                child: [{
                    type: "Sprite",
                    props: {
                        y: 0,
                        x: 0,
                        width: 50,
                        texture: "ui/shop_golod.png",
                        height: 50
                    },
                    compId: 10
                }, {
                    type: "FontClip",
                    props: {
                        y: 10,
                        x: 50,
                        width: 248,
                        var: "gold",
                        value: "200",
                        spaceX: -6,
                        skin: "ui/nub.png",
                        sheet: "0123456789+",
                        scaleY: .8,
                        scaleX: .8,
                        height: 51,
                        align: "left"
                    },
                    compId: 13
                }]
            }, {
                type: "ProgressBar",
                props: {
                    y: 199,
                    var: "levelProgress",
                    value: 1,
                    skin: "ui/progress_level.png",
                    centerX: 0
                },
                compId: 16,
                child: [{
                    type: "Text",
                    props: {
                        y: 12,
                        x: 139,
                        width: 167,
                        var: "levelNum",
                        text: "第 90 关",
                        height: 40,
                        fontSize: 40,
                        color: "#ffffff",
                        align: "center",
                        runtime: "laya.display.Text"
                    },
                    compId: 17
                }]
            }, {
                type: "Box",
                props: {
                    x: 639,
                    var: "settingBox",
                    bottom: 412
                },
                compId: 27,
                child: []
            }, {
                type: "Image",
                props: {
                    skin: "ui/hong_start_btn.png",
                    centerX: 0,
                    bottom: 521
                },
                compId: 30
            }, {
                type: "Button",
                props: {
                    x: 0,
                    var: "cnxh",
                    stateNum: 1,
                    skin: "ui/cnxh.png",
                    bottom: 331
                },
                compId: 31
            }, {
                type: "Image",
                props: {
                    width: 760,
                    var: "zsad",
                    skin: "ui/end_colour_0.png",
                    sizeGrid: "8,8,8,8",
                    height: 210,
                    centerX: 0,
                    bottom: -4
                },
                compId: 33,
                child: [{
                    type: "List",
                    props: {
                        y: 16,
                        x: 30,
                        width: 700,
                        var: "list",
                        spaceX: 12,
                        repeatY: 1,
                        height: 167
                    },
                    compId: 32,
                    child: [{
                        type: "Box",
                        props: {
                            y: 1,
                            x: 0,
                            renderType: "render"
                        },
                        compId: 36,
                        child: [{
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 130,
                                name: "icon",
                                height: 130
                            },
                            compId: 34
                        }, {
                            type: "Text",
                            props: {
                                y: 137,
                                x: 0,
                                width: 130,
                                valign: "middle",
                                text: "冲鸭彩虹屁",
                                name: "title",
                                height: 30,
                                fontSize: 22,
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 35
                        }]
                    }]
                }]
            }],
            loadList: ["ui/8x8.png", "ui/hong_ranking_btn.png", "ui/hong_shop_btn.png", "ui/hong_share_btn.png", "ui/shop_golod.png", "ui/nub.png", "ui/progress_level.png", "ui/home_shock_btn.png", "ui/home_voice_btn.png", "ui/hong_start_btn.png", "ui/cnxh.png", "ui/end_colour_0.png"],
            loadList3D: []
        }, e.HomeUI = a, s("ui.HomeUI", a);
        class n extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(n.uiView);
            }
        }
        n.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280,
                autoDestroyAtClosed: !0
            },
            compId: 2,
            child: [{
                    type: "Image",
                    props: {
                        top: 0,
                        skin: "ui/loading_color.png",
                        right: 0,
                        left: 0,
                        bottom: 0
                    },
                    compId: 9
                },
                {
                    type: "Box",
                    props: {
                        x: 120,
                        centerY: -206
                    },
                    compId: 10,
                    child: [{
                            type: "Sprite",
                            props: {
                                y: 0,
                                x: 0,
                                texture: "ui/loading_logo2.png"
                            },
                            compId: 6
                        },
                        {
                            type: "ProgressBar",
                            props: {
                                y: 263,
                                x: 52,
                                var: "progress",
                                value: 0,
                                skin: "ui/progress_loading.png",
                                centerX: 0
                            },
                            compId: 5
                        }, {
                            type: "Text",
                            props: {
                                y: 223,
                                x: 191,
                                width: 98,
                                var: "pv",
                                text: "0%",
                                height: 32,
                                fontSize: 32,
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 17
                        }
                    ]
                }, {
                    type: "Image",
                    props: {
                        var: "tips_bg",
                        top: 0,
                        skin: "ui/8x8_blck.png",
                        sizeGrid: "2,2,2,2",
                        right: 0,
                        left: 0,
                        bottom: 0,
                        alpha: .5
                    },
                    compId: 14
                },
                {
                    type: "Box",
                    props: {
                        var: "tips",
                        centerY: 150,
                        centerX: 0
                    },
                    compId: 16,
                    child: [{
                        type: "Image",
                        props: {
                            width: 560,
                            skin: "ui/shop_color02.png",
                            sizeGrid: "16,16,16,16",
                            height: 332,
                            alpha: .6
                        },
                        compId: 12
                    }, {
                        type: "Text",
                        props: {
                            y: 92,
                            x: 20,
                            width: 495,
                            var: "tipMsg",
                            text: " 网络连接失败，点击确定重试",
                            height: 32,
                            fontSize: 32,
                            color: "#ffffff",
                            align: "center",
                            runtime: "laya.display.Text"
                        },
                        compId: 13
                    }]
                }, {
                    type: "Text",
                    props: {
                        y: 10,
                        x: 10,
                        var: "v",
                        text: "0.0.1",
                        fontSize: 28,
                        color: "#ffffff",
                        runtime: "laya.display.Text"
                    },
                    compId: 19
                }
            ],
            loadList: ["ui/loading_color.png", "ui/loading_logo2.png", "ui/progress_loading.png", "ui/8x8_blck.png", "ui/shop_color02.png"],
            loadList3D: []
        }, e.LoadingUI = n, s("ui.LoadingUI", n);
        class r extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(r.uiView);
            }
        }
        r.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280
            },
            compId: 2,
            child: [{
                type: "Image",
                props: {
                    top: 0,
                    skin: "ui/8x8_blck.png",
                    sizeGrid: "2,2,2,2",
                    right: 0,
                    left: 0,
                    bottom: 0,
                    alpha: .8
                },
                compId: 5
            }, {
                type: "Button",
                props: {
                    y: 80,
                    x: 0,
                    var: "back",
                    stateNum: 1,
                    skin: "ui/shop_return.png"
                },
                compId: 3
            }, {
                type: "WXOpenDataViewer",
                props: {
                    y: 285,
                    x: 60,
                    width: 600,
                    iconSign: "wx",
                    height: 800,
                    runtime: "laya.ui.WXOpenDataViewer"
                },
                compId: 4
            }],
            loadList: ["ui/8x8_blck.png", "ui/shop_return.png"],
            loadList3D: []
        }, e.RankUI = r, s("ui.RankUI", r);
        class o extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren(), this.createView(o.uiView);
            }
        }
        o.uiView = {
            type: "View",
            props: {
                width: 720,
                height: 1280
            },
            compId: 2,
            child: [{
                type: "Image",
                props: {
                    var: "bg",
                    top: 0,
                    skin: "ui/shop_color.png",
                    sizeGrid: "2,2,2,2",
                    right: 0,
                    left: 0,
                    bottom: 0,
                    alpha: 1
                },
                compId: 11
            }, {
                type: "Button",
                props: {
                    y: 50.5,
                    x: 0,
                    var: "back",
                    stateNum: 1,
                    skin: "ui/shop_return.png"
                },
                compId: 3
            }, {
                type: "Sprite",
                props: {
                    y: 81,
                    x: 176,
                    var: "goldBox"
                },
                compId: 34,
                child: [{
                    type: "Sprite",
                    props: {
                        y: 0,
                        x: 0,
                        width: 50,
                        var: "goldImg",
                        texture: "ui/shop_golod.png",
                        height: 50
                    },
                    compId: 35
                }, {
                    type: "FontClip",
                    props: {
                        y: 10,
                        x: 50,
                        width: 248,
                        var: "gold",
                        value: "200",
                        spaceX: -6,
                        skin: "ui/nub.png",
                        sheet: "0123456789+",
                        scaleY: .8,
                        scaleX: .8,
                        height: 51,
                        align: "left"
                    },
                    compId: 36
                }]
            }, {
                type: "Box",
                props: {
                    width: 720,
                    var: "scenePos",
                    height: 720,
                    centerY: -2,
                    centerX: 0
                },
                compId: 37,
                child: [{
                    type: "Sprite",
                    props: {
                        y: 416,
                        x: 110,
                        width: 500,
                        var: "shadow",
                        texture: "ui/shop_color01.png",
                        rotation: -14,
                        height: 151
                    },
                    compId: 33
                }, {
                    type: "Button",
                    props: {
                        y: 269,
                        x: 10,
                        var: "mleft",
                        stateNum: 1,
                        skin: "ui/shop_left_btn.png"
                    },
                    compId: 38
                }, {
                    type: "Button",
                    props: {
                        y: 269,
                        x: 666,
                        var: "mright",
                        stateNum: 1,
                        skin: "ui/shop_right_btn.png"
                    },
                    compId: 39
                }, {
                    type: "Text",
                    props: {
                        y: -10,
                        x: 184,
                        width: 351,
                        var: "cname",
                        height: 77,
                        fontSize: 50,
                        color: "#ffffff",
                        align: "center",
                        runtime: "laya.display.Text"
                    },
                    compId: 43
                }]
            }, {
                type: "Box",
                props: {
                    x: 23,
                    centerY: 341
                },
                compId: 41,
                child: [{
                    type: "Button",
                    props: {
                        y: 0,
                        x: 360,
                        var: "getGold",
                        stateNum: 1,
                        skin: "ui/shop_unlock02_btn.png"
                    },
                    compId: 10,
                    child: [{
                        type: "FontClip",
                        props: {
                            y: 31,
                            x: 105,
                            width: 150,
                            var: "videoGold",
                            value: "+200",
                            spaceX: -5,
                            skin: "ui/nub.png",
                            sheet: "0123456789+",
                            scaleY: .7,
                            scaleX: .7,
                            height: 48,
                            align: "center"
                        },
                        compId: 22
                    }]
                }, {
                    type: "Button",
                    props: {
                        y: 0,
                        x: 0,
                        var: "unlock",
                        stateNum: 1,
                        skin: "ui/shop_unlock01_btn.png"
                    },
                    compId: 9,
                    child: [{
                        type: "FontClip",
                        props: {
                            y: 40,
                            x: 165,
                            width: 158,
                            var: "price",
                            value: "200",
                            spaceX: -8,
                            skin: "ui/nub.png",
                            sheet: "0123456789+",
                            scaleY: .5,
                            scaleX: .5,
                            height: 48,
                            align: "center"
                        },
                        compId: 21
                    }]
                }, {
                    type: "CheckBox",
                    props: {
                        y: 0,
                        x: 202,
                        var: "use",
                        stateNum: 2,
                        skin: "ui/shop_use_btn.png"
                    },
                    compId: 40
                }]
            }],
            loadList: ["ui/shop_color.png", "ui/shop_return.png", "ui/shop_golod.png", "ui/nub.png", "ui/shop_color01.png", "ui/shop_left_btn.png", "ui/shop_right_btn.png", "ui/shop_unlock02_btn.png", "ui/shop_unlock01_btn.png", "ui/shop_use_btn.png"],
            loadList3D: []
        }, e.SkinUI = o, s("ui.SkinUI", o);
    }(i || (i = {}));
    class a extends Laya.EventDispatcher {
        static get ins() {
            return this.eventDispatcher || (this.eventDispatcher = new Laya.EventDispatcher()),
                this.eventDispatcher;
        }
    }
    a.CREATE_LEVEL = "CREATE_LEVEL", a.LEVEL_CREATE_DONE = "LEVEL_CREATE_DONE", a.LEVEL_CREATE_FAIL = "LEVEL_CREATE_FAIL",
        a.AVATER_MOVED = "AVATER_MOVED", a.LEVEL_START = "LEVEL_START", a.LEVEL_FAILED = "LEVEL_FAILED",
        a.LEVEL_RELIFE = "LEVEL_RELIFE", a.LEVEL_FINISH = "LEVEL_FINISH", a.LEVEL_COMPLETE = "LEVEL_COMPLETE",
        a.SKIN_CHANGED = "SKIN_CHANGED";
    class n {
        static get ins() {
            return this._ins || (this._ins = new n()), this._ins;
        }
        constructor() {}
        get user_data() {
            return this._user_data;
        }
        set user_data(e) {
            this._user_data = e;
        }
        get store_data() {
            return this._store_data;
        }
        set store_data(e) {
            this._store_data = e;
        }
        get config() {
            return this._config;
        }
        set config(e) {
            "audit" == e.state && (this._store_data = this._store_data.filter((e, t) => !("黄人眼眼" == e.name || "海面屁屁" == e.name)),
                this._user_data.skin = ["c0"], this._user_data.equ_skin = "c0"), this._config = e;
        }
    }
    class r {
        constructor() {
            this.serverType = 1, this.api_base_release = "",
                this.api_base_local = "", this._zs_config_version = "2.20",
                this.canOpenFullScreenJump = false,
                this.wudian = !1, this.wudian_time = 600;
            let e = "";
            switch (this.serverType) {
                case 0:
                    e = this.api_base_local;
                    break;

                case 1:
                    e = this.api_base_release;
            }
        }
        static get ins() {
            return this._ins || (this._ins = new r()), this._ins;
        }
        request(e, t, i) {
            this.token && (t.token = this.token);
            let s = new Laya.HttpRequest();
            s.once(Laya.Event.COMPLETE, this, e => {
                i && i(e);
            }), s.once(Laya.Event.ERROR, this, t => {
                console.log("网络请求失败", e, t), i && i(t);
            }), s.send(e, JSON.stringify(t), "post", "json", ["Content-Type", "application/json"]);
        }
        login(e) {}
        passLevel(e) {
            n.ins.user_data.level++;
            platform.getInstance().setStorageSync("user_data", n.ins.user_data);
            e();
        }
        rewardGold(e, t) {
            let i = {
                num: e
            };
            n.ins.user_data.gold += e;
            platform.getInstance().setStorageSync("user_data", n.ins.user_data);
            t();

        }
        unlockSkin(e, t) {
            let i = {
                skin_id: e
            };
            n.ins.user_data.skin.push(e.id);
            n.ins.user_data.gold -= e.price;
            platform.getInstance().setStorageSync("user_data", n.ins.user_data);
            t();
        }
        equ_skin(e, t) {
            n.ins.user_data.equ_skin = e;
            platform.getInstance().setStorageSync("user_data", n.ins.user_data);
            t();
        }
        request_zs_config() {
            this.canOpenFullScreenJump = false;
        }
    }
    r.v = "", r.channel = "wx", r.res_url = "";
    class o {
        static getItemByid(e, t) {
            for (let i = 0; i < e.length; i++)
                if (t == e[i].id) return e[i];
            console.log("错误： 无法根据id从该数据获取元素");
        }
        static getIdxByid(e, t) {
            for (let i = 0; i < e.length; i++)
                if (e[i].id == t) return i;
            console.log("错误： 获取idx失败， 数据未包含id对应的数据, id：" + t);
        }
        static get onwx() {
            return Laya.Browser.onMiniGame;
        }
        static wan_10(e) {
            return Math.abs(e) >= 1e5 ? e / 1e4 + "万" : e.toString();
        }
        static wan_1(e) {
            return Math.abs(e) >= 1e4 ? e / 1e4 + "万" : e.toString();
        }
        static splitStr(e, t = 8, i = "...") {
            let s = 0,
                a = "";
            for (let n = 0; n < e.length; n++)
                if (e.charCodeAt(n) > 127 || 94 == e.charCodeAt(n) ? s += 2 : s += 1,
                    s <= t && (a += e[n]), s > t) {
                    a += i;
                    break;
                }
            return a;
        }
        static randomInt(e, t) {
            return Math.round(Laya.MathUtil.lerp(e, t, Math.random()));
        }
    }
    o.pointerOnUI = !1;
    class h {
        constructor() {
            this.menuX = 0, this.menuY = 20, this.curShareData = {}, this._st = 0, this._key = "level_rank";
        }
        static get ins() {
            return this._ins || (this._ins = new h()), this._ins;
        }
        init() {
            this.wx = Laya.Browser.window.wx, this.wx && (this.wx.showShareMenu({}), this.wx.onShareAppMessage(this.shareInfo),
                this.wx.setKeepScreenOn({
                    keepScreenOn: !0
                }), this.wx.onShow(e => {
                    Laya.stage.event(h.WX_ON_SHOW), this.wx.setKeepScreenOn({
                        keepScreenOn: !0
                    });
                }), this.wx.onHide(() => {
                    Laya.stage.event(h.WX_ON_HIDE);
                }), this.getMenuPos(), this.wx.setPreferredFramesPerSecond(60));
        }
        getMenuPos() {
            if (this.wx) {
                let e = this;
                this.wx.getSystemInfo({
                    success: t => {
                        e.menuY = t.devicePixelRatio * t.statusBarHeight * .5;
                    }
                });
            }
        }
        shareInfo() {
            // let e = [ "我已经过了" + (n.ins.user_data.level - 1) + "关, 等你来挑战", "在吗？拜托帮我过下第" + n.ins.user_data.level + "关" ], t = [ r.res_url + "res/share/s01.jpg", r.res_url + "res/share/s02.jpg" ];
            // return this.curShareData = {
            //     title: e[o.randomInt(0, e.length - 1)],
            //     imageUrl: t[o.randomInt(0, t.length - 1)]
            // }, this.curShareData;
        }
        share(e) {
            this.wx ? (this._st = Date.now(), this.cb = e, Laya.stage.off(h.WX_ON_SHOW, this, this.onShareBack),
                Laya.stage.on(h.WX_ON_SHOW, this, this.onShareBack), this.wx.shareAppMessage(this.shareInfo())) : e && e.runWith(5e3);
        }
        onShareBack() {
            Laya.stage.off(h.WX_ON_SHOW, this, this.onShareBack);
            let e = Date.now() - this._st;
            this.cb && this.cb.runWith(e);
        }
        showToast(e) {
            this.wx && this.wx.showToast({
                title: e,
                icon: "none",
                duration: 2500
            });
        }
        setPlayerLevel() {
            if (this.wx) {
                var e = [],
                    t = {
                        wxgame: {}
                    };
                t.wxgame.level = n.ins.user_data.level, t.wxgame.update_time = Laya.Browser.now(),
                    e.push({
                        key: this._key,
                        value: JSON.stringify(t)
                    }), wx.setUserCloudStorage({
                        KVDataList: e,
                        success: e => {
                            console.log("setUserCloudStorage success:" + JSON.stringify(e));
                        },
                        fail: e => {
                            console.log("setUserCloudStorage fail:" + JSON.stringify(e));
                        }
                    });
            }
        }
        showRank() {
            if (this.wx) {
                this.wx.getOpenDataContext().postMessage({
                    cmd: "show_rank",
                    user_id: n.ins.user_data.user_id,
                    level: n.ins.user_data.level
                });
            }
        }
        hideRank() {
            if (this.wx) {
                this.wx.getOpenDataContext().postMessage({
                    cmd: "hide_rank"
                });
            }
        }
        op_hiden() {
            if (this.wx) {
                this.wx.getOpenDataContext().postMessage({
                    type: "hiden"
                });
            }
        }
    }
    h.WX_ON_SHOW = "WX_ON_SHOW", h.WX_ON_HIDE = "WX_ON_HIDE";
    class l {
        constructor() {
            this.key = "vibrate_setting", this.setting = {
                enable: !0
            }, this.wx = Laya.Browser.window.wx;
        }
        static get ins() {
            return this._ins || (this._ins = new l()), this._ins;
        }
        init() {
            let e = Laya.LocalStorage.getJSON(this.key);
            e ? this.setting = e : Laya.LocalStorage.setJSON(this.key, this.setting);
        }
        get enable() {
            return this.setting.enable;
        }
        set enable(e) {
            this.setting.enable = e, Laya.LocalStorage.setJSON(this.key, this.setting);
        }
        vibrateShort() {}
        vibrateLong() {}
    }
    class d {}
    d.sound_url = "wxlocal/subpackage/sound/", d.mainScene_url = "wxlocal/subpackage/3d/main/Conventional/main.ls",
        d.skinScene_url = "wxlocal/subpackage/3d/skin/Conventional/skin.ls", d.levelBase_url = "wxlocal/subpackage/3d/level/Conventional/",
        d.pathData_url = "wxlocal/subpackage/3d/level_config/path_data.json";
    class _ {
        constructor() {
            this.bg = d.sound_url + "bg.mp3", this.fail = d.sound_url + "fail.mp3", this.cheer = d.sound_url + "cheer.mp3",
                this.gold = d.sound_url + "gold.mp3", this.goldGet = d.sound_url + "gold_0.mp3",
                this.key = "sound_setting", this.setting = {
                    enable: !0
                }, Laya.SoundManager.autoReleaseSound = !1;
        }
        static get ins() {
            return this._ins || (this._ins = new _()), this._ins;
        }
        init() {
            a.ins.on(a.LEVEL_FINISH, this, this.playCheer), Laya.stage.on(h.WX_ON_SHOW, this, this.playBg);
            let e = Laya.LocalStorage.getJSON(this.key);
            e ? this.setting = e : Laya.LocalStorage.setJSON(this.key, this.setting);
        }
        get enable() {
            return this.setting.enable;
        }
        set enable(e) {
            this.setting.enable = e, Laya.LocalStorage.setJSON(this.key, this.setting), e ? this.playBg() : this.stopBg();
        }
        playBg() {
            Laya.Browser.onMiniGame && this.setting.enable && (console.log("play bg music"),
                Laya.SoundManager.playMusic(this.bg, 0));
        }
        stopBg() {
            Laya.Browser.onMiniGame && Laya.SoundManager.stopAll();
        }
        playFail() {
            Laya.Browser.onMiniGame && this.setting.enable && Laya.SoundManager.playSound(this.fail);
        }
        playCheer() {
            Laya.Browser.onMiniGame && this.setting.enable && Laya.SoundManager.playSound(this.cheer);
        }
        playGoldOpen() {
            Laya.Browser.onMiniGame && this.setting.enable && Laya.SoundManager.playSound(this.gold);
        }
        playGoldGet() {
            Laya.Browser.onMiniGame && this.setting.enable && Laya.SoundManager.playSound(this.goldGet);
        }
    }
    class c {
        constructor() {
            if (this.adId = {
                    bid: "adunit-89f79cf3ba8eb3d9",
                    vid: "adunit-facd344648803d4a",
                    iid: "adunit-89d2c4f3a13a7acf"
                }, this.bannerCount = 10, this.banner = [], this.bannerIsShow = !1, this._vad_load_done = !1,
                this.interstitialAd = null, this.insertAdOk = !1, this.wx = Laya.Browser.window.wx,
                this.timer = new Laya.Timer(), this.wx) {
                let e = this.wx.getSystemInfoSync();
                this.screenWidth = e.screenWidth, this.screenHeight = e.screenHeight;
            }
        }
        static get ins() {
            return this._ins || (this._ins = new c()), this._ins;
        }
        init() {
            Laya.Browser.onMiniGame && (this.loadBannerAD(), this.loadVideoAD());
        }
        loadBannerAD() {
            if (!this.wx) return;
            let e = this.adId.bid,
                t = this.wx.createBannerAd({
                    adUnitId: e,
                    style: {
                        left: 0,
                        top: 0,
                        width: this.screenWidth * (r.ins.wudian ? 1 : .6)
                    }
                });
            t.onError(e => {
                console.log("bannerAd 拉取失败", e);
            }), t.onLoad(() => {
                console.log("AD:", t), t.style.top = this.screenHeight - t.style.realHeight + .01,
                    t.style.left = .5 * (this.screenWidth - t.style.realWidth) + .01, this.banner.push(t);
            });
        }
        showBanner(e = null) {
            this.bannerIsShow = !0, this.hideBanner(), this.timer.clear(this, this.wudian_show_banner),
                r.ins.wudian && e ? (e.y = Laya.stage.height - e.height - 70, this.timer.once(r.ins.wudian_time, this, this.wudian_show_banner, [e])) : this._showBanner();
        }
        wudian_show_banner(e) {
            if (e) {
                let t = this._showBanner();
                0 != t && (e.y = t - e.height - 10);
            }
        }
        hideBanner() {
            this.bannerIsShow = !1, this._hideBanner(), this.timer.clear(this, this.wudian_show_banner);
        }
        _showBanner() {
            return this.wx ? (this.curShowBanner && this.curShowBanner.hide(), this.banner.length < this.bannerCount && this.loadBannerAD(),
                this.banner.length > 0 && (this.curShowBanner = this.banner[Math.round(Math.random() * (this.banner.length - 1))]),
                this.curShowBanner ? (this.curShowBanner.show(), Laya.stage.height - Laya.stage.height * (this.curShowBanner.style.realHeight / this.screenHeight)) : 0) : Laya.stage.height - 180;
        }
        _hideBanner() {
            this.curShowBanner && this.curShowBanner.hide();
        }
        loadVideoAD() {
            if (!this.wx) return;
            let e = this.adId.vid;
            this.videoAd = this.wx.createRewardedVideoAd({
                adUnitId: e
            }), this.videoAd.onLoad(() => {
                this._vad_load_done = !0;
            }), this.videoAd.onError(e => {
                console.log("激励视屏拉去失败:", e), this._vad_load_done = !1, this.videoAd.load();
            }), this.videoAd.onClose(e => {
                e && e.isEnded || void 0 === e ? this.handle && this.handle.runWith(!0) : this.handle && this.handle.runWith(!1),
                    _.ins.playBg();
            });
        }
        get vadLoaded() {
            return !this.wx || this._vad_load_done;
        }
        showVideo(e) {
            this._vad_load_done && (this.handle = e, this._vad_load_done ? (this.videoAd.show(),
                this._vad_load_done = !1) : this.videoAd.load());
        }
        loadInsertAd() {
            if (!this.wx) return;
            let e = this.adId.iid;
            this.wx.createInterstitialAd && (this.interstitialAd = this.wx.createInterstitialAd({
                adUnitId: e
            }), this.interstitialAd.onLoad(() => {
                this.insertAdOk = !0;
            }), this.interstitialAd.onError(e => {
                this.insertAdOk = !1;
            }), this.interstitialAd.onClose(e => {
                console.log("插屏 广告关闭");
            }));
        }
        showInsert() {
            this.insertAdOk && (this.interstitialAd.show().catch(e => {
                console.error("显示插屏ad失败:", e);
            }), this.insertAdOk = !1);
        }
    }
    class u {
        constructor() {
            this.hexcase = 0, this.b64pad = "";
        }
        static get Instance() {
            return null == this._instance && (this._instance = new u()), this._instance;
        }
        hex_md5(e) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(e)));
        }
        b64_md5(e) {
            return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(e)));
        }
        any_md5(e, t) {
            return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(e)), t);
        }
        hex_hmac_md5(e, t) {
            return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(e), this.str2rstr_utf8(t)));
        }
        b64_hmac_md5(e, t) {
            return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(e), this.str2rstr_utf8(t)));
        }
        any_hmac_md5(e, t, i) {
            return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(e), this.str2rstr_utf8(t)), i);
        }
        rstr_md5(e) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(e), 8 * e.length));
        }
        rstr_hmac_md5(e, t) {
            var i = this.rstr2binl(e);
            i.length > 16 && (i = this.binl_md5(i, 8 * e.length));
            for (var s = Array(16), a = Array(16), n = 0; n < 16; n++) s[n] = 909522486 ^ i[n],
                a[n] = 1549556828 ^ i[n];
            var r = this.binl_md5(s.concat(this.rstr2binl(t)), 512 + 8 * t.length);
            return this.binl2rstr(this.binl_md5(a.concat(r), 640));
        }
        rstr2hex(e) {
            try {
                this.hexcase;
            } catch (e) {
                this.hexcase = 0;
            }
            for (var t, i = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", s = "", a = 0; a < e.length; a++) t = e.charCodeAt(a),
                s += i.charAt(t >>> 4 & 15) + i.charAt(15 & t);
            return s;
        }
        rstr2b64(e) {
            try {
                this.b64pad;
            } catch (e) {
                this.b64pad = "";
            }
            for (var t = "", i = e.length, s = 0; s < i; s += 3)
                for (var a = e.charCodeAt(s) << 16 | (s + 1 < i ? e.charCodeAt(s + 1) << 8 : 0) | (s + 2 < i ? e.charCodeAt(s + 2) : 0), n = 0; n < 4; n++) 8 * s + 6 * n > 8 * e.length ? t += this.b64pad : t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a >>> 6 * (3 - n) & 63);
            return t;
        }
        rstr2any(e, t) {
            var i, s, a, n, r, o = t.length,
                h = Array(Math.ceil(e.length / 2));
            for (i = 0; i < h.length; i++) h[i] = e.charCodeAt(2 * i) << 8 | e.charCodeAt(2 * i + 1);
            var l = Math.ceil(8 * e.length / (Math.log(t.length) / Math.log(2))),
                d = Array(l);
            for (s = 0; s < l; s++) {
                for (r = Array(), n = 0, i = 0; i < h.length; i++) n = (n << 16) + h[i], n -= (a = Math.floor(n / o)) * o,
                    (r.length > 0 || a > 0) && (r[r.length] = a);
                d[s] = n, h = r;
            }
            var _ = "";
            for (i = d.length - 1; i >= 0; i--) _ += t.charAt(d[i]);
            return _;
        }
        str2rstr_utf8(e) {
            for (var t, i, s = "", a = -1; ++a < e.length;) t = e.charCodeAt(a), i = a + 1 < e.length ? e.charCodeAt(a + 1) : 0,
                55296 <= t && t <= 56319 && 56320 <= i && i <= 57343 && (t = 65536 + ((1023 & t) << 10) + (1023 & i),
                    a++), t <= 127 ? s += String.fromCharCode(t) : t <= 2047 ? s += String.fromCharCode(192 | t >>> 6 & 31, 128 | 63 & t) : t <= 65535 ? s += String.fromCharCode(224 | t >>> 12 & 15, 128 | t >>> 6 & 63, 128 | 63 & t) : t <= 2097151 && (s += String.fromCharCode(240 | t >>> 18 & 7, 128 | t >>> 12 & 63, 128 | t >>> 6 & 63, 128 | 63 & t));
            return s;
        }
        str2rstr_utf16le(e) {
            for (var t = "", i = 0; i < e.length; i++) t += String.fromCharCode(255 & e.charCodeAt(i), e.charCodeAt(i) >>> 8 & 255);
            return t;
        }
        str2rstr_utf16be(e) {
            for (var t = "", i = 0; i < e.length; i++) t += String.fromCharCode(e.charCodeAt(i) >>> 8 & 255, 255 & e.charCodeAt(i));
            return t;
        }
        rstr2binl(e) {
            for (var t = Array(e.length >> 2), i = 0; i < t.length; i++) t[i] = 0;
            for (i = 0; i < 8 * e.length; i += 8) t[i >> 5] |= (255 & e.charCodeAt(i / 8)) << i % 32;
            return t;
        }
        binl2rstr(e) {
            for (var t = "", i = 0; i < 32 * e.length; i += 8) t += String.fromCharCode(e[i >> 5] >>> i % 32 & 255);
            return t;
        }
        binl_md5(e, t) {
            e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
            for (var i = 1732584193, s = -271733879, a = -1732584194, n = 271733878, r = 0; r < e.length; r += 16) {
                var o = i,
                    h = s,
                    l = a,
                    d = n;
                i = this.md5_ff(i, s, a, n, e[r + 0], 7, -680876936), n = this.md5_ff(n, i, s, a, e[r + 1], 12, -389564586),
                    a = this.md5_ff(a, n, i, s, e[r + 2], 17, 606105819), s = this.md5_ff(s, a, n, i, e[r + 3], 22, -1044525330),
                    i = this.md5_ff(i, s, a, n, e[r + 4], 7, -176418897), n = this.md5_ff(n, i, s, a, e[r + 5], 12, 1200080426),
                    a = this.md5_ff(a, n, i, s, e[r + 6], 17, -1473231341), s = this.md5_ff(s, a, n, i, e[r + 7], 22, -45705983),
                    i = this.md5_ff(i, s, a, n, e[r + 8], 7, 1770035416), n = this.md5_ff(n, i, s, a, e[r + 9], 12, -1958414417),
                    a = this.md5_ff(a, n, i, s, e[r + 10], 17, -42063), s = this.md5_ff(s, a, n, i, e[r + 11], 22, -1990404162),
                    i = this.md5_ff(i, s, a, n, e[r + 12], 7, 1804603682), n = this.md5_ff(n, i, s, a, e[r + 13], 12, -40341101),
                    a = this.md5_ff(a, n, i, s, e[r + 14], 17, -1502002290), s = this.md5_ff(s, a, n, i, e[r + 15], 22, 1236535329),
                    i = this.md5_gg(i, s, a, n, e[r + 1], 5, -165796510), n = this.md5_gg(n, i, s, a, e[r + 6], 9, -1069501632),
                    a = this.md5_gg(a, n, i, s, e[r + 11], 14, 643717713), s = this.md5_gg(s, a, n, i, e[r + 0], 20, -373897302),
                    i = this.md5_gg(i, s, a, n, e[r + 5], 5, -701558691), n = this.md5_gg(n, i, s, a, e[r + 10], 9, 38016083),
                    a = this.md5_gg(a, n, i, s, e[r + 15], 14, -660478335), s = this.md5_gg(s, a, n, i, e[r + 4], 20, -405537848),
                    i = this.md5_gg(i, s, a, n, e[r + 9], 5, 568446438), n = this.md5_gg(n, i, s, a, e[r + 14], 9, -1019803690),
                    a = this.md5_gg(a, n, i, s, e[r + 3], 14, -187363961), s = this.md5_gg(s, a, n, i, e[r + 8], 20, 1163531501),
                    i = this.md5_gg(i, s, a, n, e[r + 13], 5, -1444681467), n = this.md5_gg(n, i, s, a, e[r + 2], 9, -51403784),
                    a = this.md5_gg(a, n, i, s, e[r + 7], 14, 1735328473), s = this.md5_gg(s, a, n, i, e[r + 12], 20, -1926607734),
                    i = this.md5_hh(i, s, a, n, e[r + 5], 4, -378558), n = this.md5_hh(n, i, s, a, e[r + 8], 11, -2022574463),
                    a = this.md5_hh(a, n, i, s, e[r + 11], 16, 1839030562), s = this.md5_hh(s, a, n, i, e[r + 14], 23, -35309556),
                    i = this.md5_hh(i, s, a, n, e[r + 1], 4, -1530992060), n = this.md5_hh(n, i, s, a, e[r + 4], 11, 1272893353),
                    a = this.md5_hh(a, n, i, s, e[r + 7], 16, -155497632), s = this.md5_hh(s, a, n, i, e[r + 10], 23, -1094730640),
                    i = this.md5_hh(i, s, a, n, e[r + 13], 4, 681279174), n = this.md5_hh(n, i, s, a, e[r + 0], 11, -358537222),
                    a = this.md5_hh(a, n, i, s, e[r + 3], 16, -722521979), s = this.md5_hh(s, a, n, i, e[r + 6], 23, 76029189),
                    i = this.md5_hh(i, s, a, n, e[r + 9], 4, -640364487), n = this.md5_hh(n, i, s, a, e[r + 12], 11, -421815835),
                    a = this.md5_hh(a, n, i, s, e[r + 15], 16, 530742520), s = this.md5_hh(s, a, n, i, e[r + 2], 23, -995338651),
                    i = this.md5_ii(i, s, a, n, e[r + 0], 6, -198630844), n = this.md5_ii(n, i, s, a, e[r + 7], 10, 1126891415),
                    a = this.md5_ii(a, n, i, s, e[r + 14], 15, -1416354905), s = this.md5_ii(s, a, n, i, e[r + 5], 21, -57434055),
                    i = this.md5_ii(i, s, a, n, e[r + 12], 6, 1700485571), n = this.md5_ii(n, i, s, a, e[r + 3], 10, -1894986606),
                    a = this.md5_ii(a, n, i, s, e[r + 10], 15, -1051523), s = this.md5_ii(s, a, n, i, e[r + 1], 21, -2054922799),
                    i = this.md5_ii(i, s, a, n, e[r + 8], 6, 1873313359), n = this.md5_ii(n, i, s, a, e[r + 15], 10, -30611744),
                    a = this.md5_ii(a, n, i, s, e[r + 6], 15, -1560198380), s = this.md5_ii(s, a, n, i, e[r + 13], 21, 1309151649),
                    i = this.md5_ii(i, s, a, n, e[r + 4], 6, -145523070), n = this.md5_ii(n, i, s, a, e[r + 11], 10, -1120210379),
                    a = this.md5_ii(a, n, i, s, e[r + 2], 15, 718787259), s = this.md5_ii(s, a, n, i, e[r + 9], 21, -343485551),
                    i = this.safe_add(i, o), s = this.safe_add(s, h), a = this.safe_add(a, l), n = this.safe_add(n, d);
            }
            return [i, s, a, n];
        }
        md5_cmn(e, t, i, s, a, n) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(t, e), this.safe_add(s, n)), a), i);
        }
        md5_ff(e, t, i, s, a, n, r) {
            return this.md5_cmn(t & i | ~t & s, e, t, a, n, r);
        }
        md5_gg(e, t, i, s, a, n, r) {
            return this.md5_cmn(t & s | i & ~s, e, t, a, n, r);
        }
        md5_hh(e, t, i, s, a, n, r) {
            return this.md5_cmn(t ^ i ^ s, e, t, a, n, r);
        }
        md5_ii(e, t, i, s, a, n, r) {
            return this.md5_cmn(i ^ (t | ~s), e, t, a, n, r);
        }
        safe_add(e, t) {
            var i = (65535 & e) + (65535 & t);
            return (e >> 16) + (t >> 16) + (i >> 16) << 16 | 65535 & i;
        }
        bit_rol(e, t) {
            return e << t | e >>> 32 - t;
        }
    }
    class p extends i.CnxhUI {
        onOpened() {
            console.error("CnxhUI");
            g.setupList(this.list, this.timer, 3, "v", 6e3, 300), g.setupList(this.list1, this.timer, 7, "h", 1e4, 3e3),
                this.back.on(Laya.Event.CLICK, this, this.backHandle), c.ins.hideBanner();
        }
        backHandle() {
            t.close(this);
        }
        onClosed() {
            this.back.off(Laya.Event.CLICK, this, this.backHandle), a.ins.event(p.ON_CLOSED);
        }
    }
    p.ON_CLOSED = "ON_CLOSED";
    class g {
        static get ad_data_home() {
            return this._ad_data_home;
        }
        static pullZSData() {
            // let e = new Laya.HttpRequest();
            // e.once(Laya.Event.ERROR, this, e => {
            //     console.log("拉取zsad 失败", e);
            // }), e.once(Laya.Event.COMPLETE, this, () => {
            //     console.log("pull zsad:", e.data), 200 == e.data.code ? e.data.data["position-2"] && (this._ad_data_home = e.data.data["position-2"]) : console.log("拉取zsad 失败", e.data);
            // });
            // let t = Math.round(.001 * Date.now()), i = "appid:" + this.appid + "timestamp:" + t + this.key, s = new u().hex_md5(i), a = {
            //     appid: this.appid,
            //     timestamp: t,
            //     sign: s
            // };
            // e.send(this.zs_ad_url, JSON.stringify(a), "post", "json", [ "Content-Type", "application/json" ]);
        }
        static jumpCollect(e) {
            let t = new Laya.HttpRequest();
            t.once(Laya.Event.ERROR, this, e => {
                console.log("JumpCollect 失败:", e);
            }), t.once(Laya.Event.COMPLETE, this, () => {
                console.log("zs 跳转统计:", t.data);
            });
            let i = this.getLoacalUid(),
                s = Math.round(.001 * Date.now()),
                a = "from_id:" + this.appid + "timestamp:" + s + "to_id:" + e + "user_id:" + i + this.key,
                n = new u().hex_md5(a),
                r = {
                    user_id: i,
                    from_id: this.appid,
                    to_id: e,
                    sign: n,
                    timestamp: s
                },
                o = JSON.stringify(r);
            console.log("上报紫色跳转数据：", o), t.send(this.zs_collect_url, o, "post", "json", ["Content-Type", "application/json"]);
        }
        static navigateToOther(e) {
            Laya.Browser.onMiniGame && e ? Laya.Browser.window.wx.navigateToMiniProgram({
                appId: e.appid,
                path: e.link_path,
                success: () => {
                    g.jumpCollect(e.app_id);
                },
                fail: () => {
                    r.ins.canOpenFullScreenJump && t.open(p, !1);
                }
            }) : r.ins.canOpenFullScreenJump && t.open(p, !1);
        }
        static setupList(e, t, i, s, a, n) {
            let r = g.ad_data_home;
            if ("v" == s && (e.vScrollBarSkin = ""), "h" == s && (e.hScrollBarSkin = ""), e.renderHandler = Laya.Handler.create(this, (e, t) => {
                    e.getChildByName("icon").skin = r[t].app_icon, e.getChildByName("title").text = o.splitStr(r[t].app_title, 10, "..");
                }, null, !1), e.array = r, e.selectEnable = !0, e.selectHandler = Laya.Handler.create(this, e => {
                    e >= 0 && e < r.length && g.navigateToOther(r[e]);
                }, null, !1), t) {
                let s = 0;
                i < 0 ? (i *= -1, e.tweenTo(i)) : s = i, Laya.timer.once(1e3, this, () => {
                    let r = () => {
                        e.tweenTo(s, a, Laya.Handler.create(this, () => {
                            s = s == i ? 0 : i, t.once(n, this, r);
                        }));
                    };
                    r();
                });
            }
        }
        static getLoacalUid() {
            if (!this._uid) {
                let e = "local_uid";
                this._uid = Laya.LocalStorage.getJSON(e), this._uid || (this._uid = {
                    id: "l" + Date.now().toString(16) + Math.round(999 * Math.random())
                }, Laya.LocalStorage.setJSON(e, this._uid));
            }
            return this._uid ? this._uid.id : "r" + (999 + Math.round(99999 * Math.random())).toString(16);
        }
    }
    g.appid = "", g.key = "",
        g.zs_collect_url = "";
    class m {
        constructor() {
            this.versionOk = !1, this.iconIsShow = !1, Laya.Browser.onMiniGame && (this.wx = Laya.Browser.window.wx,
                this.wx && (this.sysInfo = this.wx.getSystemInfoSync(), console.log("this.sysInfo:", this.sysInfo),
                    this.versionOk = this.compareVersion(this.sysInfo.SDKVersion, "2.8.3") >= 0));
        }
        static get ins() {
            return this._ins || (this._ins = new m()), this._ins;
        }
        showIconPortal(e) {
            if (!this.versionOk) return;
            this.iconIsShow = !0;
            let t = [];
            for (let i = 0; i < e.numChildren; i++) {
                let s = e.getChildAt(i),
                    a = new Laya.Point(0, 0);
                a = s.localToGlobal(a), t.push({
                    x: a.x,
                    y: a.y
                });
            }
            let i = this.sysInfo.screenHeight,
                s = this.sysInfo.screenWidth,
                a = [];
            for (let e = 0; e < t.length; e++) {
                let n = s * t[e].x / Laya.stage.width,
                    r = i * t[e].y / Laya.stage.height;
                a.push({
                    appNameHidden: !0,
                    color: "white",
                    size: 45,
                    borderWidth: 0,
                    borderColor: "white",
                    left: n,
                    top: r
                });
            }
            let n = {
                adUnitId: "PBgAA-E8gVvljKKM",
                count: t.length,
                style: a
            };
            this.curIcon = this.wx.createGameIcon(n), this.curIcon.onError(e => {
                console.log("createGameIcon err: ", e);
            }), this.curIcon.onLoad(() => {
                this.iconIsShow && this.curIcon.show();
            });
        }
        hideAll() {
            this.iconIsShow = !1, null != this.curIcon && (this.curIcon.hide(), this.curIcon.destroy()),
                this.curIcon = null;
        }
        compareVersion(e, t) {
            e = e.split("."), t = t.split(".");
            for (var i = Math.max(e.length, t.length); e.length < i;) e.push("0");
            for (; t.length < i;) t.push("0");
            for (var s = 0; s < i; s++) {
                var a = parseInt(e[s]),
                    n = parseInt(t[s]);
                if (a > n) return 1;
                if (a < n) return -1;
            }
            return 0;
        }
    }
    class f extends i.GameUI {
        constructor() {
            super(...arguments), this.levelState = "";
        }
        onOpened() {
            this.levelProgress.bar.sizeGrid = "0,0,0,0,1", this.levelProgress.value = 0, this.levelNum.text = "Level " + n.ins.user_data.level + "",
                this.goldBox.y = h.ins.menuY, this.levelProgress.y = h.ins.menuY + 80, this.info.y = h.ins.menuY + 160,
                this.award.y = h.ins.menuY + 250;
            let e = n.ins.curLineColor;
            e.x, e.y, e.z;
            this.gold.value = n.ins.user_data.gold.toString(), this.bg.visible = !1, this.info.visible = !1,
                this.award.visible = !1, this.failed.visible = !1, this.complete.visible = !1, this.tuijian.visible = !1,
                this.videoRelife.on(Laya.Event.CLICK, this, this.videoRelifeHandle), this.retry.on(Laya.Event.CLICK, this, this.retryHandle),
                this.normalGet.on(Laya.Event.CLICK, this, this.normalGetHandle), this.videGit.on(Laya.Event.CLICK, this, this.videlGetHandle),
                a.ins.on(a.AVATER_MOVED, this, this.avatarMovedHandle), a.ins.on(a.LEVEL_FAILED, this, this.onLevelFinish, ["failed"]),
                a.ins.on(a.LEVEL_COMPLETE, this, this.onLevelFinish, ["finished"]), a.ins.on(p.ON_CLOSED, this, this.cnxhViewClose),
                this.timer.callLater(this, () => {
                    this.points0.visible = this.points1.visible = !1;
                }), this.showZsad(!1), this.zsad();
        }
        zsad() {
            this.list.array = platform.getInstance().getForgames();
            this.list.renderHandler = new Laya.Handler(this, this.renderH);
        }

        renderH(b) {
            b.offAll(Laya.Event.MOUSE_DOWN);
            b.on(Laya.Event.MOUSE_DOWN, this, () => {
                platform.getInstance().navigate("GAME", "MORE", b.dataSource.id);
            });
        }
        showZsad(e) {
            this.mzsad.visible = e;
        }
        videoRelifeHandle() {
            platform.getInstance().showReward(() => {
                m.ins.hideAll();
                this.info.visible = !1;
                this.failed.visible = !1;
                this.bg.visible = !1;
                this.showZsad(!1);
                a.ins.event(a.LEVEL_RELIFE)
            })

            // Laya.Browser.onMiniGame ? c.ins.vadLoaded ? c.ins.showVideo(Laya.Handler.create(this, e => {
            //     e ? (m.ins.hideAll(), this.info.visible = !1, this.failed.visible = !1, this.bg.visible = !1, 
            //     this.showZsad(!1), a.ins.event(a.LEVEL_RELIFE)) : h.ins.showToast("看完视频才可以复活");
            // })) : h.ins.showToast("视频准备中") : (this.info.visible = !1, this.failed.visible = !1, 
            // this.bg.visible = !1, this.showZsad(!1), a.ins.event(a.LEVEL_RELIFE));
        }
        retryHandle() {
            platform.getInstance().showInterstitial(() => {
                t.open(K);
            })
        }
        normalGetHandle() {
            _.ins.playGoldOpen(), this.videGit.visible = !1, this.normalGet.mouseEnabled = !1,
                this.goldAnim(n.ins.config.level_reward);
        }
        videlGetHandle() {

            platform.getInstance().showReward(() => {
                this.goldAnim(3 * n.ins.config.level_reward);
            });


            // Laya.Browser.onMiniGame ? c.ins.vadLoaded ? c.ins.showVideo(Laya.Handler.create(this, e => {
            //     e ? this.goldAnim(3 * n.ins.config.level_reward) : h.ins.showToast("需要看完视频才可以获取");
            // })) : h.ins.showToast("视频准备中") : this.goldAnim(3 * n.ins.config.level_reward);
        }
        goldAnim(e) {
            let i = [],
                s = [],
                a = this.imgGold.localToGlobal(new Laya.Point(0, 0));
            for (let e = 0; e < 10; e++) {
                let e = new Laya.Sprite();
                e.texture = this.goldImg.texture, e.width = this.goldImg.width, e.height = this.goldImg.height,
                    this.addChild(e);
                let t = this.goldImg.localToGlobal(new Laya.Point(0, 0));
                e.pos(t.x, t.y), i.push(e), t.x += 500 * (Math.random() - .5), t.y -= 300 * Math.random(),
                    s.push(t);
            }
            let o = new Laya.Point(0, 0);
            Laya.Tween.to(o, {
                x: 2,
                update: Laya.Handler.create(this, () => {
                    if (o.x < 1)
                        for (let e = 0; e < i.length; e++) i[e].x = Laya.MathUtil.lerp(i[e].x, s[e].x, o.x),
                            i[e].y = Laya.MathUtil.lerp(i[e].y, s[e].y, o.x);
                    else
                        for (let e = 0; e < i.length; e++) i[e].x = Laya.MathUtil.lerp(i[e].x, a.x, o.x - 1),
                            i[e].y = Laya.MathUtil.lerp(i[e].y, a.y, o.x - 1);
                }, null, !1)
            }, 2e3, Laya.Ease.sineIn, Laya.Handler.create(this,
                () => {
                    l.ins.vibrateShort(), _.ins.playGoldGet(), this.timerOnce(500, this, d), r.ins.rewardGold(e, e => {
                        this.gold.value = n.ins.user_data.gold.toString();
                    });
                }));
            let d = () => {
                t.open(K);
            };
        }
        avatarMovedHandle(e) {
            this.levelProgress.value = e;
        }
        onLevelFinish(e) {
            this.levelState = e;
            let i = "failed" == this.levelState ? 1e3 : 2500;
            this.timer.once(i, this, () => {
                this.show_jiesuan();
            });

            // g.setupList(this.hlist0, this.timer, 12, "h", 2e4, 3e3), 
            // g.setupList(this.hlist1, this.timer, -12, "h", 2e4, 3e3);
        }
        show_jiesuan() {
            m.ins.hideAll(),
                // m.ins.showIconPortal(this.points1), 
                // this.tuijian.visible = false, 
                console.log("levelCompoleteHandle=,", this.levelState);
            "failed" == this.levelState && this.levelFailedHandle(), "finished" == this.levelState && this.levelCompoleteHandle();
        }
        levelFailedHandle() {
            this.info.text = Math.round(100 * this.levelProgress.value) + "% finished", this.info.visible = !0,
                this.failed.visible = !0, this.bg.visible = !0,

                this.showZsad(!0);
        }
        levelCompoleteHandle() {
            this.info.text = "finished",
                this.info.visible = !0,
                this.getGoldNum.text = "+" + 50,
                this.award.visible = !0,
                this.complete.visible = !0,
                this.bg.visible = !0,
                this.showZsad(!0),
                // c.ins.showBanner(this.complete), 
                r.ins.passLevel(e => {}),
                h.ins.setPlayerLevel();
            console.log("levelCompoleteHandle");
        }
        cnxhViewClose() {
            c.ins.showBanner(this.tjskip), m.ins.showIconPortal(this.points0);
        }
        onClosed() {
            this.videoRelife.off(Laya.Event.CLICK, this, this.videoRelifeHandle), this.retry.off(Laya.Event.CLICK, this, this.retryHandle),
                this.normalGet.off(Laya.Event.CLICK, this, this.normalGetHandle), a.ins.off(a.AVATER_MOVED, this, this.avatarMovedHandle),
                a.ins.off(a.LEVEL_FAILED, this, this.onLevelFinish), a.ins.off(a.LEVEL_COMPLETE, this, this.onLevelFinish),
                a.ins.off(p.ON_CLOSED, this, this.cnxhViewClose), this.tjskip.off(Laya.Event.CLICK, this, this.show_jiesuan),
                c.ins.hideBanner(), m.ins.hideAll();
        }
    }
    class E {
        static init(e, t, i) {
            this._ins ? console.error("不可从复初始化") : (this._ins = new E(), this._ins._mainScene = e,
                this._ins._skinScene = t, this._ins._pathData = i);
        }
        constructor() {}
        static get ins() {
            return this._ins ? this._ins : (console.error("为初始化 不可访问"), null);
        }
        get mainScene() {
            return this._mainScene;
        }
        get skinScene() {
            return this._skinScene;
        }
        get pathData() {
            return this._pathData;
        }
    }
    var L = Laya.Vector3;
    class y {
        static createLine(e, t = 1) {
            t *= .5;
            let i = e.length,
                s = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV"),
                a = new Float32Array(16 * i),
                n = new Uint16Array(6 * (i - 1)),
                r = new L(0, 1, 0),
                o = new L(0, 0, 0),
                h = new L(0, 0, 0),
                l = new L(0, 0, 0),
                d = new L(0, 0, 0),
                _ = 0,
                c = 0,
                u = 0,
                p = 1 / i,
                g = .002 / i,
                m = .003;
            for (let s = 0; s < i; s++) m -= g, 0 == s ? (h.x = e[s][0], h.y = m, h.z = e[s][2],
                    l.x = e[s][0], l.y = m, l.z = e[s][2], d.x = e[s + 1][0], d.y = m, d.z = e[s + 1][2]) : s == i - 1 ? (h.x = e[s][0],
                    h.y = m, h.z = e[s][2], l.x = e[s - 1][0], l.y = m, l.z = e[s - 1][2], d.x = e[s][0],
                    d.y = m, d.z = e[s][2]) : (h.x = e[s][0], h.y = m, h.z = e[s][2], l.x = e[s - 1][0],
                    l.y = m, l.z = e[s - 1][2], d.x = e[s + 1][0], d.y = m, d.z = e[s + 1][2]), f = h,
                E = l, y = d, S = s, L.subtract(y, E, o), L.normalize(o, o), L.cross(r, o, o), L.normalize(o, o),
                L.scale(o, t, o), a[_++] = o.x + f.x, a[_++] = o.y + f.y, a[_++] = o.z + f.z, a[_++] = 0,
                a[_++] = 1, a[_++] = 0, a[_++] = 0, a[_++] = S * p, a[_++] = -o.x + f.x, a[_++] = -o.y + f.y,
                a[_++] = -o.z + f.z, a[_++] = 0, a[_++] = 1, a[_++] = 0, a[_++] = 1, a[_++] = S * p,
                s < i - 1 && (u = 2 * s, n[c++] = u, n[c++] = u + 2, n[c++] = u + 3, n[c++] = u,
                    n[c++] = u + 3, n[c++] = u + 1);
            var f, E, y, S;
            return Laya.PrimitiveMesh._createMesh(s, a, n);
        }
        static createPath(e, t = 1, i = .2) {
            console.log("路径点优化前：", e.length);
            let s = this.optimizingPathPoint(e);
            console.log("路径点优化后：", s.length), t *= .5;
            let a = s.length,
                n = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL"),
                r = new Float32Array(36 * a),
                o = new Uint16Array(18 * (a - 1)),
                h = new L(0, 1, 0),
                l = new L(0, 0, 0),
                d = new L(0, 0, 0),
                _ = new L(0, 0, 0),
                c = new L(0, 0, 0),
                u = new L(0, 0, 0),
                p = 0,
                g = 0,
                m = 0;
            for (let e = 0; e < a; e++) 0 == e ? (d.x = s[e][0], d.y = s[e][1], d.z = s[e][2],
                    _.x = s[e][0], _.y = s[e][1], _.z = s[e][2], c.x = s[e + 1][0], c.y = s[e + 1][1],
                    c.z = s[e + 1][2]) : e == a - 1 ? (d.x = s[e][0], d.y = s[e][1], d.z = s[e][2],
                    _.x = s[e - 1][0], _.y = s[e - 1][1], _.z = s[e - 1][2], c.x = s[e][0], c.y = s[e][1],
                    c.z = s[e][2]) : (d.x = s[e][0], d.y = s[e][1], d.z = s[e][2], _.x = s[e - 1][0],
                    _.y = s[e - 1][1], _.z = s[e - 1][2], c.x = s[e + 1][0], c.y = s[e + 1][1], c.z = s[e + 1][2]),
                f = d, E = _, y = c, L.subtract(y, E, l), L.normalize(l, l), L.cross(h, l, l), L.normalize(l, l),
                u.x = l.x, u.y = l.y, u.z = l.z, L.scale(l, t, l), r[p++] = l.x + f.x, r[p++] = l.y + f.y - i,
                r[p++] = l.z + f.z, r[p++] = u.x, r[p++] = u.y, r[p++] = u.z, r[p++] = l.x + f.x,
                r[p++] = l.y + f.y, r[p++] = l.z + f.z, r[p++] = u.x, r[p++] = u.y, r[p++] = u.z,
                r[p++] = l.x + f.x, r[p++] = l.y + f.y, r[p++] = l.z + f.z, r[p++] = 0, r[p++] = 1,
                r[p++] = 0, r[p++] = -l.x + f.x, r[p++] = -l.y + f.y, r[p++] = -l.z + f.z, r[p++] = 0,
                r[p++] = 1, r[p++] = 0, r[p++] = -l.x + f.x, r[p++] = -l.y + f.y, r[p++] = -l.z + f.z,
                r[p++] = -u.x, r[p++] = -u.y, r[p++] = -u.z, r[p++] = -l.x + f.x, r[p++] = -l.y + f.y - i,
                r[p++] = -l.z + f.z, r[p++] = -u.x, r[p++] = -u.y, r[p++] = -u.z, e < s.length - 1 && (m = 6 * e,
                    o[g++] = m, o[g++] = m + 6, o[g++] = m + 7, o[g++] = m, o[g++] = m + 7, o[g++] = m + 1,
                    o[g++] = m + 2, o[g++] = m + 8, o[g++] = m + 9, o[g++] = m + 2, o[g++] = m + 9,
                    o[g++] = m + 3, o[g++] = m + 4, o[g++] = m + 10, o[g++] = m + 11, o[g++] = m + 4,
                    o[g++] = m + 11, o[g++] = m + 5);
            var f, E, y;
            return Laya.PrimitiveMesh._createMesh(n, r, o);
        }
        static optimizingPathPoint(e) {
            let t = [];
            t.push(e[0]);
            let i = new Laya.Vector3(e[0][0], 0, e[0][2]),
                s = new L();
            L.subtract(new Laya.Vector3(e[1][0], 0, e[1][2]), i, s), L.normalize(s, s);
            let a = new L(0, 0, 0),
                n = new L(0, 0, 0),
                r = !1,
                o = e.length;
            for (let h = 2; h < o; h++) a.x = e[h][0], a.y = 0, a.z = e[h][2], L.subtract(a, i, n),
                L.normalize(n, n), L.dot(s, n) <= .9999 ? (r && t.push(e[h - 1]), t.push(e[h]),
                    i.x = e[h - 1][0], i.y = 0, i.z = e[h - 1][2], L.subtract(a, i, s), L.normalize(s, s),
                    r = !1) : r = !0;
            return t.push(e[o - 1]), t;
        }
    }
    class S extends Laya.Script3D {
        static get delta() {
            return this._delta;
        }
        onUpdate() {
            S._delta = Laya.MathUtil.lerp(S._delta, .001 * Laya.timer.delta, 8e-4 * Laya.timer.delta),
                S._delta = Math.min(S._delta, .018);
        }
    }
    S._delta = .0166;
    class T extends Laya.Script3D {
        constructor() {
            super(...arguments), this.speed = 50;
        }
        onAwake() {
            this.trans = this.owner.transform;
            let e = this.owner.getChildByName("plane");
            e && (e.meshRenderer.material.albedoColor = G.ins.lineColor);
        }
        setup(e) {
            this.speed = e;
        }
        onUpdate() {
            this.trans.localRotationEulerY += S.delta * this.speed;
        }
    }
    class x {
        static angle(e, t) {
            return Laya.Vector3.normalize(e, e), Laya.Vector3.normalize(t, t), 57.29578 * Math.acos(x.clamp(Laya.Vector3.dot(e, t), -1, 1));
        }
        static signedAngle(e, t, i) {
            return Laya.Vector3.normalize(e, e), Laya.Vector3.normalize(t, t), this._num = 57.29578 * Math.acos(x.clamp(Laya.Vector3.dot(e, t), -1, 1)),
                Laya.Vector3.cross(e, t, this._cross), this._num2 = x.sign(Laya.Vector3.dot(i, this._cross)),
                this._num * this._num2;
        }
        static clamp(e, t, i) {
            return e < t ? e = t : e > i && (e = i), e;
        }
        static sign(e) {
            return e >= 0 ? 1 : -1;
        }
        static equals(e, t) {
            return Math.abs(e.x - t.x) < x.threshold && Math.abs(e.y - t.y) < x.threshold && Math.abs(e.z - t.z) < x.threshold;
        }
        static d3Tod2(e, t, i) {
            e.viewport.project(t, e.projectionViewMatrix, i), i.x = i.x / Laya.stage.clientScaleX,
                i.y = i.y / Laya.stage.clientScaleY, i.z = 0;
        }
        static parabola(e, t, i, s) {
            s.x = e * i * Math.cos(t * x.toRadian), s.y = e * i * Math.sin(t * x.toRadian) - 9.8 * i * i * .5;
        }
        static parabola_t(e, t, i) {
            return i / e * Math.cos(t * x.toRadian);
        }
        static parabola_power(e, t, i) {
            let s = Math.cos(i * x.toRadian) * Math.cos(i * x.toRadian) * (Math.sin(i * x.toRadian) * e / Math.cos(i * x.toRadian) - t);
            return Math.sqrt(4.9 * e * e / s);
        }
        parabola_y(e, t, i) {
            let s = Math.cos(t * x.toRadian);
            return Math.sin(t * x.toRadian) * i / s - 4.9 * i * i / e * e * s * s;
        }
        static lerpVector3(e, t, i, s) {
            s.x = Laya.MathUtil.lerp(e.x, t.x, i), s.y = Laya.MathUtil.lerp(e.y, t.y, i), s.z = Laya.MathUtil.lerp(e.z, t.z, i);
        }
    }
    x.toRadian = .017453292519943, x._num = 0, x._cross = new Laya.Vector3(0, 0, 0),
        x._num2 = 0, x.threshold = .01;
    class C {
        constructor(e, t) {
            this._moved_dis = 0, this.pidx = 0, this.cpos = new Laya.Vector3(0, 0, 0), this.tpos = new Laya.Vector3(0, 0, 0),
                this.speedSlow = 2, this.speedDefauld = 4, this.speed = 3, this.dis = 0, this.d = 0,
                this.ry = 0, this.sry = 0, this.sv = 20, this.dir = new Laya.Vector3(0, 0, 0), this.zdir = new Laya.Vector3(0, 0, 1),
                this.axis = new Laya.Vector3(0, -1, 0), this.relife_pidx = 0, this.stepLength = 0,
                this.path = e, this.path_nodeLengh = this.path.length, this._path_length = t, this.stepLength = t / this.path_nodeLengh;
        }
        setCharacter(e) {
            this.character = e, this.reset();
        }
        relife() {
            this.pidx = this.relife_pidx, this.refreshCpos();
        }
        reset() {
            this.pidx = this.relife_pidx = 0, this._moved_dis = 0, this.refreshCpos();
        }
        refreshCpos() {
            this.cpos.x = this.path[this.pidx][0], this.cpos.y = this.path[this.pidx][1], this.cpos.z = this.path[this.pidx][2],
                this.move(1), this.sry = this.ry, this.character.transform.localRotationEulerY = this.sry;
        }
        move(e) {
            this.character ? this.pidx + 1 < this.path_nodeLengh ? (this.dis = S.delta * e,
                this._move(), this._moved_dis = this.pidx * this.stepLength + .1, this.sry < -90 && this.ry > 90 && (this.ry -= 360),
                this.sry > 90 && this.ry < -90 && (this.ry += 360), this.sry = Laya.MathUtil.lerp(this.sry, this.ry, S.delta * this.sv),
                this.sry > 180 && (this.sry -= 360), this.sry < -180 && (this.sry += 360), this.character.transform.localRotationEulerY = this.sry,
                this.character.transform.position = this.cpos, a.ins.event(a.AVATER_MOVED, this._moved_dis / this._path_length)) : a.ins.event(a.LEVEL_COMPLETE) : console.error("\b未设置 character");
        }
        _move() {
            this.pidx < this.path_nodeLengh - 1 && (this.tpos.x = this.path[this.pidx + 1][0],
                this.tpos.y = this.path[this.pidx + 1][1], this.tpos.z = this.path[this.pidx + 1][2],
                this.d = Laya.Vector3.distance(this.cpos, this.tpos), this.dis <= this.d ? (x.lerpVector3(this.cpos, this.tpos, this.dis / this.d, this.cpos),
                    this.dis != this.d && (Laya.Vector3.subtract(this.tpos, this.cpos, this.dir), this.ry = x.signedAngle(this.dir, this.zdir, this.axis))) : (this.dis -= this.d,
                    this.cpos.x = this.tpos.x, this.cpos.y = this.tpos.y, this.cpos.z = this.tpos.z,
                    this.pidx++, this._move()));
        }
        recordReliveIdx() {
            this.relife_pidx = this.pidx;
        }
    }
    class I extends Laya.Script3D {
        onAwake() {
            this.self = this.owner, this.self.transform.localPosition = new Laya.Vector3(0, 0, 0),
                this.self.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.top = this.self.getChildByName("Chest_open_top"),
                this.coins = this.self.getChildByName("coins"), this.self.transform.localScaleX = this.self.transform.localScaleY = this.self.transform.localScaleZ = .7,
                a.ins.on(a.LEVEL_COMPLETE, this, this.open);
        }
        open() {
            let e = new Laya.TimeLine();
            e.addLabel("scale", 0).to(this.self.transform, {
                localScaleX: 1,
                localScaleY: 1,
                localScaleZ: 1
            }, 1e3, Laya.Ease.elasticInOut), e.addLabel("open", 0).to(this.top.transform, {
                localRotationEulerX: -180
            }, 600, Laya.Ease.circIn), e.play(), this.owner.timer.once(1500, this, () => {
                l.ins.vibrateShort();
            });
        }
        onDestroy() {
            a.ins.off(a.LEVEL_COMPLETE, this, this.open);
        }
    }
    class v extends Laya.Script3D {
        onAwake() {
            this.owner.getChildByName("plane").getComponent(Laya.PhysicsCollider).collisionGroup = 4;
        }
        onStart() {
            this.owner.timer.frameOnce(1, this, () => {
                let e = () => {
                        let e = new Laya.Vector3();
                        return e.x = 150 * (Math.random() - .5), e.z = 150 * (Math.random() - .5), e.y = 100,
                            e;
                    },
                    t = this.owner.getChildByName("cubes");
                for (let i = 0; i < t.numChildren; i++) {
                    let s = t.getChildAt(i);
                    s.meshRenderer.material.albedoColor = i < 6 ? G.ins.lineColor : G.ins.passLineColor;
                    let a = s.getComponent(Laya.Rigidbody3D);
                    a.applyForce(e()), a.canCollideWith = 4;
                }
            });
        }
    }
    class w extends Laya.Script3D {
        constructor() {
            super(...arguments), this.cs = [], this.cd = [], this.t = 0, this.speed = 1, this.cap = 0,
                this._cap = 0, this.cap0 = 0, this.cap1 = 0, this.idx = 0, this.lerp = 0, this.piMin = 0,
                this.piMax = .5 * Math.PI;
        }
        onAwake() {
            for (let e = 0; e < this.owner.numChildren; e++) {
                let t = this.owner.getChildAt(e).name.split("_");
                this.cs.push(this.owner.getChildAt(e)), this.cd.push([parseFloat(t[0]), parseFloat(t[1])]);
            }
        }
        setup(e, t, i) {
            this.speed = e, this.cap0 = t, this.cap1 = i, this.cap = t;
        }
        onUpdate() {
            if (this._cap += S.delta, this._cap > this.cap)
                for (this.t += S.delta * this.speed,
                    this.t > this.piMax && (this.t = this.piMax, this.speed *= -1, this._cap = 0, this.cap = this.cap1),
                    this.t < this.piMin && (this.t = this.piMin, this.speed *= -1, this._cap = 0, this.cap = this.cap0),
                    this.lerp = Math.sin(this.t), this.idx = 0; this.idx < this.cs.length; this.idx++) this.cs[this.idx].transform.localPositionX = Laya.MathUtil.lerp(this.cd[this.idx][1], this.cd[this.idx][0], this.lerp);
        }
    }
    class D extends Laya.Script {
        constructor() {
            super(...arguments), this.t = 0, this.speed = 1, this.lerp = 0, this.cap = 1, this._cap = 1,
                this.from = 0, this.to = 0, this.pi_min = .5 * Math.PI, this.pi_max = 1.5 * Math.PI;
        }
        onAwake() {
            this.c = this.owner.getChildAt(0);
        }
        setup(e, t, i) {
            this.speed = i, this.cap = t, this._cap = t, this.from = -e, this.to = e;
        }
        onUpdate() {
            this._cap += S.delta, this._cap > this.cap && (this.t += S.delta * this.speed, this.t > this.pi_max && (this.t = this.pi_max,
                this.speed *= -1, this._cap = 0), this.t < this.pi_min && (this.t = this.pi_min,
                this.speed *= -1, this._cap = 0), this.lerp = .5 * (1 + Math.sin(this.t)), this.c.transform.localPositionX = Laya.MathUtil.lerp(this.from, this.to, this.lerp));
        }
    }
    class b {
        static __init_shader() {
            let e = Laya.Shader3D.add("MTestShader", !0),
                t = new Laya.SubShader({
                    a_Position: 0,
                    a_Normal: 3,
                    a_Tangent0: 4,
                    a_Texcoord0: 2,
                    a_BoneWeights: 6,
                    a_BoneIndices: 5,
                    a_MvpMatrix: 12,
                    a_WorldMat: 8
                }, {
                    u_Bones: 0,
                    u_MvpMatrix: 2,
                    u_WorldMat: 2,
                    u_View: 3,
                    u_Projection: 3,
                    u_CameraPos: 3,
                    u_AlphaTestValue: 1,
                    u_AlbedoColor: 1,
                    u_AlbedoColor1: 1,
                    u_EmissionColor: 1,
                    u_AlbedoTexture: 1,
                    u_NormalTexture: 1,
                    u_ParallaxTexture: 1,
                    u_MetallicGlossTexture: 1,
                    u_OcclusionTexture: 1,
                    u_EmissionTexture: 1,
                    u_metallic: 1,
                    u_smoothness: 1,
                    u_progress: 1,
                    u_smoothnessScale: 1,
                    u_occlusionStrength: 1,
                    u_normalScale: 1,
                    u_parallaxScale: 1,
                    u_TilingOffset: 1,
                    "u_DirectionLight.Direction": 4,
                    "u_DirectionLight.Color": 4,
                    u_PointLightMatrix: 4,
                    "u_PointLight.Position": 4,
                    "u_PointLight.Range": 4,
                    "u_PointLight.Color": 4,
                    "u_SpotLight.Position": 4,
                    "u_SpotLight.Direction": 4,
                    "u_SpotLight.Range": 4,
                    "u_SpotLight.SpotAngle": 4,
                    "u_SpotLight.Color": 4,
                    u_RangeTexture: 4,
                    u_ReflectTexture: 4,
                    u_ReflectIntensity: 4,
                    u_AmbientColor: 4,
                    u_shadowMap1: 4,
                    u_shadowMap2: 4,
                    u_shadowMap3: 4,
                    u_shadowPSSMDistance: 4,
                    u_lightShadowVP: 4,
                    u_shadowPCFoffset: 4,
                    u_FogStart: 4,
                    u_FogRange: 4,
                    u_FogColor: 4
                }, Laya.SkinnedMeshSprite3D.shaderDefines, A.shaderDefines);
            e.addSubShader(t), t.addShaderPass('\n        #include "Lighting.glsl";\n    \n        attribute vec4 a_Position;\n        attribute vec3 a_Normal;\n        attribute vec4 a_Tangent0;\n        attribute vec2 a_Texcoord0;\n        \n        #ifdef GPU_INSTANCE\n            attribute mat4 a_MvpMatrix;\n        #else\n            uniform mat4 u_MvpMatrix;\n        #endif\n        \n        #ifdef GPU_INSTANCE\n            attribute mat4 a_WorldMat;\n        #else\n            uniform mat4 u_WorldMat;\n        #endif\n        \n        uniform vec3 u_CameraPos;\n    \n        uniform mat4 u_View;\n        uniform mat4 u_Projection;\n        \n        varying vec2 v_Texcoord0;\n        varying vec3 v_Normal;\n        varying vec3 v_Tangent;\n        varying vec3 v_Binormal;\n        varying vec3 v_ViewDir;\n        varying vec3 v_PositionWorld;\n    \n        \n        #ifdef TILINGOFFSET\n            uniform vec4 u_TilingOffset;\n        #endif\n        \n        varying float v_posViewZ;\n        #ifdef RECEIVESHADOW\n          #ifdef SHADOWMAP_PSSM1 \n              varying vec4 v_lightMVPPos;\n              uniform mat4 u_lightShadowVP[4];\n          #endif\n        #endif\n        \n        #ifdef BONE\n            const int c_MaxBoneCount = 24;\n            attribute vec4 a_BoneIndices;\n            attribute vec4 a_BoneWeights;\n            uniform mat4 u_Bones[c_MaxBoneCount];\n        #endif\n        \n        void main_castShadow()\n        {\n            vec4 position;\n            #ifdef BONE\n                mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n                skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n                skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n                skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n                position=skinTransform*a_Position;\n            #else\n                position=a_Position;\n            #endif\n            #ifdef GPU_INSTANCE\n                gl_Position = a_MvpMatrix * position;\n            #else\n                gl_Position = u_MvpMatrix * position;\n            #endif\n             \n            //TODO没考虑UV动画呢\n            #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n                v_Texcoord0 = a_Texcoord0;\n            #endif\n            gl_Position=remapGLPositionZ(gl_Position);\n            v_posViewZ = gl_Position.z;\n        }\n        \n        void main_normal()\n        {\n            vec4 position;\n            #ifdef BONE\n                mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n                skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n                skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n                skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n                position=skinTransform*a_Position;\n            #else\n                position=a_Position;\n            #endif\n    \n     \n            //到视图空间\n            #ifdef GPU_INSTANCE\n                gl_Position = a_MvpMatrix * position;\n            #else\n                gl_Position = u_MvpMatrix * position;\n            #endif\n            \n            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)\n                mat4 worldMat;\n                #ifdef GPU_INSTANCE\n                    worldMat = a_WorldMat;\n                #else\n                    worldMat = u_WorldMat;\n                #endif\n            #endif\n            \n            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n                mat3 worldInvMat;\n                #ifdef BONE\n                    worldInvMat=inverse(mat3(worldMat*skinTransform));\n                #else\n                    worldInvMat=inverse(mat3(worldMat));\n                #endif  \n                v_Normal=a_Normal*worldInvMat;\n                #if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))\n                    v_Tangent=a_Tangent0.xyz*worldInvMat;\n                    v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;\n                #endif\n            #endif\n            \n            \n            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)\n                v_PositionWorld=(worldMat*position).xyz;\n            #endif\n            \n          \n            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n                v_ViewDir=u_CameraPos-v_PositionWorld;\n            #endif\n        \n            #ifdef TILINGOFFSET\n                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);\n            #else\n                v_Texcoord0=a_Texcoord0;\n            #endif\n          \n            #ifdef RECEIVESHADOW\n                v_posViewZ = gl_Position.w;\n                #ifdef SHADOWMAP_PSSM1 \n                    v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);\n                #endif\n            #endif\n            gl_Position=remapGLPositionZ(gl_Position);\n        }\n    \n        \n        void main()\n        {\n            #ifdef CASTSHADOW\n                main_castShadow();\n            #else\n                main_normal();\n            #endif\n        }', '\n        #ifdef FSHIGHPRECISION\n            precision highp float;\n        #else\n            precision mediump float;\n        #endif\n    \n        varying vec2 v_Texcoord0;\n        varying vec3 v_Normal;\n        varying vec3 v_Tangent;\n        varying vec3 v_Binormal;\n        varying vec3 v_ViewDir;\n        varying vec3 v_PositionWorld;\n    \n        uniform vec3 u_AmbientColor;\n        uniform vec4 u_AlbedoColor;\n        uniform vec4 u_AlbedoColor1;\n        \n    \n        #ifdef ALBEDOTEXTURE\n            uniform sampler2D u_AlbedoTexture;\n        #endif\n        #ifdef METALLICGLOSSTEXTURE\n            uniform sampler2D u_MetallicGlossTexture;\n        #endif\n        #ifdef NORMALTEXTURE\n            uniform sampler2D u_NormalTexture;\n            uniform float u_normalScale;\n        #endif\n        #ifdef PARALLAXTEXTURE\n            uniform sampler2D u_ParallaxTexture;\n            uniform float u_parallaxScale;\n        #endif\n        #ifdef OCCLUSIONTEXTURE\n            uniform sampler2D u_OcclusionTexture;\n            uniform float u_occlusionStrength;\n        #endif\n        #ifdef EMISSION\n            #ifdef EMISSIONTEXTURE\n                uniform sampler2D u_EmissionTexture;\n            #endif\n            uniform vec4 u_EmissionColor;\n        #endif\n        #ifdef REFLECTMAP\n            uniform samplerCube u_ReflectTexture;\n            uniform float u_ReflectIntensity;\n        #endif\n    \n        uniform float u_AlphaTestValue;\n        uniform float u_metallic;\n        uniform float u_smoothness;\n        uniform float u_smoothnessScale;\n        uniform float u_progress;\n    \n        uniform sampler2D u_RangeTexture;\n        //uniform sampler2D u_AngleTexture;\n        uniform mat4 u_PointLightMatrix;\n        //uniform mat4 u_SpotLightMatrix;\n    \n        #include "PBRStandardLighting.glsl"\n        #include "ShadowHelper.glsl"\n    \n        varying float v_posViewZ;\n        #ifdef RECEIVESHADOW\n            #if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)\n                uniform mat4 u_lightShadowVP[4];\n            #endif\n            #ifdef SHADOWMAP_PSSM1 \n                varying vec4 v_lightMVPPos;\n            #endif\n        #endif\n    \n        #ifdef DIRECTIONLIGHT\n            uniform DirectionLight u_DirectionLight;\n        #endif\n        #ifdef POINTLIGHT\n            uniform PointLight u_PointLight;\n        #endif\n        #ifdef SPOTLIGHT\n            uniform SpotLight u_SpotLight;\n        #endif\n    \n        #ifdef FOG\n            uniform float u_FogStart;\n            uniform float u_FogRange;\n            uniform vec3 u_FogColor;\n        #endif\n    \n        void main_castShadow()\n        {\n            gl_FragColor=packDepth(v_posViewZ);\n            #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n                float alpha = texture2D(u_AlbedoTexture,v_Texcoord0).w;\n                if( alpha < u_AlphaTestValue )\n                {\n                    discard;\n                }\n            #endif\n        }\n    \n        void main_normal()\n        {\t\n            vec3 viewDir = normalize(v_ViewDir);\n            \n            vec2 uv0 = ParallaxOffset(viewDir);\n            \n            vec2 mg;\n            vec4 albedoColor;\n            #ifdef ALBEDOTEXTURE\n                vec4 abledoTextureColor = texture2D(u_AlbedoTexture, uv0);\n                albedoColor = abledoTextureColor * u_AlbedoColor;\n                mg = MetallicGloss(abledoTextureColor.a, uv0);\n            #else\n                //albedoColor = u_AlbedoColor;\n                if(uv0.y > u_progress)\n                    albedoColor = u_AlbedoColor;\n                else\n                    albedoColor = u_AlbedoColor1;\n                \n                mg = MetallicGloss(1.0, uv0);\n            #endif\n            \n            #ifdef ALPHATEST\n                if(albedoColor.a < u_AlphaTestValue)\n                    discard;\n            #endif\n            \n            vec3 normal = UnpackScaleNormal(uv0);\n        \n            LayaGI gi;\n            gi.diffuse = u_AmbientColor * Occlusion(uv0).rgb;\n            gi.specular = ReflectCubeMap(viewDir, normal);\n        \n            vec4 color = vec4(0.0);\n            \n            #ifdef DIRECTIONLIGHT\n                color += PBRStandardDiectionLight(albedoColor, mg.r, mg.g, normal, viewDir, u_DirectionLight, gi);\n            #endif\n        \n            #ifdef POINTLIGHT\n                color.a = 0.0;\n                color += PBRStandardPointLight(albedoColor, mg.r, mg.g, normal, viewDir, u_PointLight, v_PositionWorld, gi);\n            #endif\n            \n            #ifdef SPOTLIGHT\n                color.a = 0.0;\n                color += PBRStandardSpotLight(albedoColor, mg.r, mg.g, normal, viewDir, u_SpotLight, v_PositionWorld, gi);\n            #endif\n            \n            #ifdef EMISSION\n                vec4 emissionColor = u_EmissionColor;\n                #ifdef EMISSIONTEXTURE\n                    emissionColor *=  texture2D(u_EmissionTexture, uv0);\n                #endif\n                color.rgb += emissionColor.rgb;\n            #endif\n            \n            #ifdef RECEIVESHADOW\n                float shadowValue = 1.0;\n                #ifdef SHADOWMAP_PSSM3\n                    shadowValue = getShadowPSSM3( u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n                #endif\n                #ifdef SHADOWMAP_PSSM2\n                    shadowValue = getShadowPSSM2( u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n                #endif \n                #ifdef SHADOWMAP_PSSM1\n                    shadowValue = getShadowPSSM1( u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);\n                #endif\n                gl_FragColor = vec4(color.rgb * shadowValue, color.a);\n            #else\n                gl_FragColor = color;\n            #endif\n            \n            #ifdef FOG\n                float lerpFact = clamp((1.0 / gl_FragCoord.w - u_FogStart) / u_FogRange, 0.0, 1.0);\n                gl_FragColor.rgb = mix(gl_FragColor.rgb, u_FogColor, lerpFact);\n            #endif\n        }\n    \n        void main()\n        {\n            #ifdef CASTSHADOW\t\t\n                main_castShadow();\n            #else\n                main_normal();\n            #endif  \n        }', {
                s_Cull: 0,
                s_Blend: 1,
                s_BlendSrc: 2,
                s_BlendDst: 3,
                s_DepthTest: 12,
                s_DepthWrite: 13
            });
        }
    }
    class A extends Laya.BaseMaterial {
        constructor() {
            super(), this.setShaderName("MTestShader"), this._albedoColor = new Laya.Vector4(1, 1, 1, 1),
                this._albedoColor1 = new Laya.Vector4(1, 1, 1, 1), this._shaderValues.setVector(A.ALBEDOCOLOR, new Laya.Vector4(1, 1, 1, 1)),
                this._emissionColor = new Laya.Vector4(0, 0, 0, 0), this._shaderValues.setVector(A.EMISSIONCOLOR, new Laya.Vector4(0, 0, 0, 0)),
                this._shaderValues.setNumber(A.METALLIC, 0), this._shaderValues.setNumber(A.SMOOTHNESS, 0),
                this._shaderValues.setNumber(A.SMOOTHNESSSCALE, 1), this._shaderValues.setNumber(A.SMOOTHNESSSOURCE, 0),
                this._shaderValues.setNumber(A.OCCLUSIONSTRENGTH, 1), this._shaderValues.setNumber(A.NORMALSCALE, 1),
                this._shaderValues.setNumber(A.PARALLAXSCALE, .001), this._shaderValues.setBool(A.ENABLEEMISSION, !1),
                this._shaderValues.setBool(A.ENABLEREFLECT, !0), this._shaderValues.setNumber(Laya.BaseMaterial.ALPHATESTVALUE, .5),
                this._disablePublicDefineDatas.remove(Laya.Scene3DShaderDeclaration.SHADERDEFINE_REFLECTMAP),
                this.renderMode = 0;
        }
        get _Parallax() {
            return this._shaderValues.getNumber(A.PARALLAXSCALE);
        }
        set _Parallax(e) {
            this._shaderValues.setNumber(A.PARALLAXSCALE, e);
        }
        get _ColorB() {
            return this._albedoColor.z;
        }
        set _ColorB(e) {
            this._albedoColor.z = e, this.albedoColor = this._albedoColor;
        }
        get _ColorR() {
            return this._albedoColor.x;
        }
        set _ColorR(e) {
            this._albedoColor.x = e, this.albedoColor = this._albedoColor;
        }
        get _ColorG() {
            return this._albedoColor.y;
        }
        set _ColorG(e) {
            this._albedoColor.y = e, this.albedoColor = this._albedoColor;
        }
        get _ColorA() {
            return this._albedoColor.w;
        }
        set _ColorA(e) {
            this._albedoColor.w = e, this.albedoColor = this._albedoColor;
        }
        get albedoColor() {
            return this._albedoColor;
        }
        set albedoColor(e) {
            this._albedoColor = e, this._shaderValues.setVector(A.ALBEDOCOLOR, e);
        }
        get albedoColor1() {
            return this._albedoColor1;
        }
        set albedoColor1(e) {
            this._albedoColor1 = e, this._shaderValues.setVector(A.ALBEDOCOLOR1, e);
        }
        get progress() {
            return this._shaderValues.getNumber(A.PROGRESS);
        }
        set progress(e) {
            this._shaderValues.setNumber(A.PROGRESS, e);
        }
        get metallic() {
            return this._Metallic;
        }
        set metallic(e) {
            this._Metallic = Math.max(0, Math.min(1, e));
        }
        get _GlossMapScale() {
            return this._shaderValues.getNumber(A.SMOOTHNESSSCALE);
        }
        set _GlossMapScale(e) {
            this._shaderValues.setNumber(A.SMOOTHNESSSCALE, e);
        }
        get _Glossiness() {
            return this._shaderValues.getNumber(A.SMOOTHNESS);
        }
        set _Glossiness(e) {
            this._shaderValues.setNumber(A.SMOOTHNESS, e);
        }
        get enableReflection() {
            return this._shaderValues.getBool(A.ENABLEREFLECT);
        }
        set enableReflection(e) {
            this._shaderValues.setBool(A.ENABLEREFLECT, !0), e ? this._disablePublicDefineDatas.remove(Laya.Scene3DShaderDeclaration.SHADERDEFINE_REFLECTMAP) : this._disablePublicDefineDatas.add(Laya.Scene3DShaderDeclaration.SHADERDEFINE_REFLECTMAP);
        }
        get _Metallic() {
            return this._shaderValues.getNumber(A.METALLIC);
        }
        set _Metallic(e) {
            this._shaderValues.setNumber(A.METALLIC, e);
        }
        get _BumpScale() {
            return this._shaderValues.getNumber(A.NORMALSCALE);
        }
        set _BumpScale(e) {
            this._shaderValues.setNumber(A.NORMALSCALE, e);
        }
        get _OcclusionStrength() {
            return this._shaderValues.getNumber(A.OCCLUSIONSTRENGTH);
        }
        set _OcclusionStrength(e) {
            this._shaderValues.setNumber(A.OCCLUSIONSTRENGTH, e);
        }
        get _EmissionColorR() {
            return this._emissionColor.x;
        }
        set _EmissionColorR(e) {
            this._emissionColor.x = e, this.emissionColor = this._emissionColor;
        }
        get _EmissionColorG() {
            return this._emissionColor.y;
        }
        set _EmissionColorG(e) {
            this._emissionColor.y = e, this.emissionColor = this._emissionColor;
        }
        get _EmissionColorB() {
            return this._emissionColor.z;
        }
        set _EmissionColorB(e) {
            this._emissionColor.z = e, this.emissionColor = this._emissionColor;
        }
        get _EmissionColorA() {
            return this._emissionColor.w;
        }
        set _EmissionColorA(e) {
            this._emissionColor.w = e, this.emissionColor = this._emissionColor;
        }
        get tilingOffset() {
            return this._shaderValues.getVector(A.TILINGOFFSET);
        }
        set tilingOffset(e) {
            e && (1 != e.x || 1 != e.y || 0 != e.z || 0 != e.w) ? this._shaderValues.addDefine(A.SHADERDEFINE_TILINGOFFSET) : this._shaderValues.removeDefine(A.SHADERDEFINE_TILINGOFFSET),
                this._shaderValues.setVector(A.TILINGOFFSET, e);
        }
        get blendSrc() {
            return this._shaderValues.getInt(A.BLEND_SRC);
        }
        set blendSrc(e) {
            this._shaderValues.setInt(A.BLEND_SRC, e);
        }
        get tilingOffsetW() {
            return this._MainTex_STW;
        }
        set tilingOffsetW(e) {
            this._MainTex_STW = e;
        }
        get albedoColorA() {
            return this._ColorA;
        }
        set albedoColorA(e) {
            this._ColorA = e;
        }
        get _MainTex_STX() {
            return this._shaderValues.getVector(A.TILINGOFFSET).x;
        }
        set _MainTex_STX(e) {
            var t = this._shaderValues.getVector(A.TILINGOFFSET);
            t.x = e, this.tilingOffset = t;
        }
        get _MainTex_STY() {
            return this._shaderValues.getVector(A.TILINGOFFSET).y;
        }
        set _MainTex_STY(e) {
            var t = this._shaderValues.getVector(A.TILINGOFFSET);
            t.y = e, this.tilingOffset = t;
        }
        get _MainTex_STZ() {
            return this._shaderValues.getVector(A.TILINGOFFSET).z;
        }
        set _MainTex_STZ(e) {
            var t = this._shaderValues.getVector(A.TILINGOFFSET);
            t.z = e, this.tilingOffset = t;
        }
        get _MainTex_STW() {
            return this._shaderValues.getVector(A.TILINGOFFSET).w;
        }
        set _MainTex_STW(e) {
            var t = this._shaderValues.getVector(A.TILINGOFFSET);
            t.w = e, this.tilingOffset = t;
        }
        get _Cutoff() {
            return this.alphaTestValue;
        }
        set _Cutoff(e) {
            this.alphaTestValue = e;
        }
        get albedoColorR() {
            return this._ColorR;
        }
        set albedoColorR(e) {
            this._ColorR = e;
        }
        get albedoColorG() {
            return this._ColorG;
        }
        set albedoColorG(e) {
            this._ColorG = e;
        }
        get albedoColorB() {
            return this._ColorB;
        }
        set albedoColorB(e) {
            this._ColorB = e;
        }
        get tilingOffsetX() {
            return this._MainTex_STX;
        }
        set tilingOffsetX(e) {
            this._MainTex_STX = e;
        }
        get albedoTexture() {
            return this._shaderValues.getTexture(A.ALBEDOTEXTURE);
        }
        set albedoTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_ALBEDOTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_ALBEDOTEXTURE),
                this._shaderValues.setTexture(A.ALBEDOTEXTURE, e);
        }
        get cull() {
            return this._shaderValues.getInt(A.CULL);
        }
        set cull(e) {
            this._shaderValues.setInt(A.CULL, e);
        }
        get parallaxTexture() {
            return this._shaderValues.getTexture(A.PARALLAXTEXTURE);
        }
        set parallaxTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_PARALLAXTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_PARALLAXTEXTURE),
                this._shaderValues.setTexture(A.PARALLAXTEXTURE, e);
        }
        get normalTexture() {
            return this._shaderValues.getTexture(A.NORMALTEXTURE);
        }
        set normalTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_NORMALTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_NORMALTEXTURE),
                this._shaderValues.setTexture(A.NORMALTEXTURE, e);
        }
        get emissionColor() {
            return this._shaderValues.getVector(A.EMISSIONCOLOR);
        }
        set emissionColor(e) {
            this._shaderValues.setVector(A.EMISSIONCOLOR, e);
        }
        get parallaxTextureScale() {
            return this._Parallax;
        }
        set parallaxTextureScale(e) {
            this._Parallax = Math.max(.005, Math.min(.08, e));
        }
        get normalTextureScale() {
            return this._BumpScale;
        }
        set normalTextureScale(e) {
            this._BumpScale = e;
        }
        get tilingOffsetZ() {
            return this._MainTex_STZ;
        }
        set tilingOffsetZ(e) {
            this._MainTex_STZ = e;
        }
        get occlusionTexture() {
            return this._shaderValues.getTexture(A.OCCLUSIONTEXTURE);
        }
        set occlusionTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_OCCLUSIONTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_OCCLUSIONTEXTURE),
                this._shaderValues.setTexture(A.OCCLUSIONTEXTURE, e);
        }
        get occlusionTextureStrength() {
            return this._OcclusionStrength;
        }
        set occlusionTextureStrength(e) {
            this._OcclusionStrength = Math.max(0, Math.min(1, e));
        }
        get enableEmission() {
            return this._shaderValues.getBool(A.ENABLEEMISSION);
        }
        set enableEmission(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_EMISSION) : this._shaderValues.removeDefine(A.SHADERDEFINE_EMISSION),
                this._shaderValues.setBool(A.ENABLEEMISSION, e);
        }
        get metallicGlossTexture() {
            return this._shaderValues.getTexture(A.METALLICGLOSSTEXTURE);
        }
        set metallicGlossTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_METALLICGLOSSTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_METALLICGLOSSTEXTURE),
                this._shaderValues.setTexture(A.METALLICGLOSSTEXTURE, e);
        }
        get emissionColorA() {
            return this._EmissionColorA;
        }
        set emissionColorA(e) {
            this._EmissionColorA = e;
        }
        get smoothness() {
            return this._Glossiness;
        }
        set smoothness(e) {
            this._Glossiness = Math.max(0, Math.min(1, e));
        }
        get blendDst() {
            return this._shaderValues.getInt(A.BLEND_DST);
        }
        set blendDst(e) {
            this._shaderValues.setInt(A.BLEND_DST, e);
        }
        get smoothnessTextureScale() {
            return this._GlossMapScale;
        }
        set smoothnessTextureScale(e) {
            this._GlossMapScale = Math.max(0, Math.min(1, e));
        }
        get depthWrite() {
            return this._shaderValues.getBool(A.DEPTH_WRITE);
        }
        set depthWrite(e) {
            this._shaderValues.setBool(A.DEPTH_WRITE, e);
        }
        get smoothnessSource() {
            return this._shaderValues.getInt(A.SMOOTHNESSSOURCE);
        }
        set smoothnessSource(e) {
            e ? (this._shaderValues.addDefine(A.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA),
                this._shaderValues.setInt(A.SMOOTHNESSSOURCE, 1)) : (this._shaderValues.removeDefine(A.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA),
                this._shaderValues.setInt(A.SMOOTHNESSSOURCE, 0));
        }
        get emissionColorR() {
            return this._EmissionColorR;
        }
        set emissionColorR(e) {
            this._EmissionColorR = e;
        }
        get emissionColorG() {
            return this._EmissionColorG;
        }
        set emissionColorG(e) {
            this._EmissionColorG = e;
        }
        get emissionColorB() {
            return this._EmissionColorB;
        }
        set emissionColorB(e) {
            this._EmissionColorB = e;
        }
        get emissionTexture() {
            return this._shaderValues.getTexture(A.EMISSIONTEXTURE);
        }
        set emissionTexture(e) {
            e ? this._shaderValues.addDefine(A.SHADERDEFINE_EMISSIONTEXTURE) : this._shaderValues.removeDefine(A.SHADERDEFINE_EMISSIONTEXTURE),
                this._shaderValues.setTexture(A.EMISSIONTEXTURE, e);
        }
        get tilingOffsetY() {
            return this._MainTex_STY;
        }
        set tilingOffsetY(e) {
            this._MainTex_STY = e;
        }
        set renderMode(e) {
            switch (e) {
                case 0:
                    this.alphaTest = !1, this.renderQueue = 2e3, this.depthWrite = !0, this.cull = 2,
                        this.blend = 0, this.depthTest = 513, this._shaderValues.removeDefine(A.SHADERDEFINE_ALPHAPREMULTIPLY);
                    break;

                case 1:
                    this.renderQueue = 2450, this.alphaTest = !0, this.depthWrite = !0, this.cull = 2,
                        this.blend = 0, this.depthTest = 513, this._shaderValues.removeDefine(A.SHADERDEFINE_ALPHAPREMULTIPLY);
                    break;

                case 2:
                    this.renderQueue = 3e3, this.alphaTest = !1, this.depthWrite = !1, this.cull = 2,
                        this.blend = 1, this.blendSrc = 770, this.blendDst = 771, this.depthTest = 513,
                        this._shaderValues.removeDefine(A.SHADERDEFINE_ALPHAPREMULTIPLY);
                    break;

                case 3:
                    this.renderQueue = 3e3, this.alphaTest = !1, this.depthWrite = !1, this.cull = 2,
                        this.blend = 1, this.blendSrc = 1, this.blendDst = 771, this.depthTest = 513, this._shaderValues.addDefine(A.SHADERDEFINE_ALPHAPREMULTIPLY);
                    break;

                default:
                    throw new Error("PBRSpecularMaterial : renderMode value error.");
            }
        }
        get blend() {
            return this._shaderValues.getInt(A.BLEND);
        }
        set blend(e) {
            this._shaderValues.setInt(A.BLEND, e);
        }
        get depthTest() {
            return this._shaderValues.getInt(A.DEPTH_TEST);
        }
        set depthTest(e) {
            this._shaderValues.setInt(A.DEPTH_TEST, e);
        }
        static get ALBEDOTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
        }
        static get METALLICGLOSSTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_MetallicGlossTexture");
        }
        static get NORMALTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_NormalTexture");
        }
        static get PARALLAXTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_ParallaxTexture");
        }
        static get OCCLUSIONTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_OcclusionTexture");
        }
        static get EMISSIONTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_EmissionTexture");
        }
        static get ALBEDOCOLOR() {
            return Laya.Shader3D.propertyNameToID("u_AlbedoColor");
        }
        static get ALBEDOCOLOR1() {
            return Laya.Shader3D.propertyNameToID("u_AlbedoColor1");
        }
        static get PROGRESS() {
            return Laya.Shader3D.propertyNameToID("u_progress");
        }
        static get EMISSIONCOLOR() {
            return Laya.Shader3D.propertyNameToID("u_EmissionColor");
        }
        static get METALLIC() {
            return Laya.Shader3D.propertyNameToID("u_metallic");
        }
        static get SMOOTHNESS() {
            return Laya.Shader3D.propertyNameToID("u_smoothness");
        }
        static get SMOOTHNESSSCALE() {
            return Laya.Shader3D.propertyNameToID("u_smoothnessScale");
        }
        static get OCCLUSIONSTRENGTH() {
            return Laya.Shader3D.propertyNameToID("u_occlusionStrength");
        }
        static get NORMALSCALE() {
            return Laya.Shader3D.propertyNameToID("u_normalScale");
        }
        static get PARALLAXSCALE() {
            return Laya.Shader3D.propertyNameToID("u_parallaxScale");
        }
        static get TILINGOFFSET() {
            return Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        static get CULL() {
            return Laya.Shader3D.propertyNameToID("s_Cull");
        }
        static get BLEND() {
            return Laya.Shader3D.propertyNameToID("s_Blend");
        }
        static get BLEND_SRC() {
            return Laya.Shader3D.propertyNameToID("s_BlendSrc");
        }
        static get BLEND_DST() {
            return Laya.Shader3D.propertyNameToID("s_BlendDst");
        }
        static get DEPTH_TEST() {
            return Laya.Shader3D.propertyNameToID("s_DepthTest");
        }
        static get DEPTH_WRITE() {
            return Laya.Shader3D.propertyNameToID("s_DepthWrite");
        }
        static get defaultMaterial() {
            return new A();
        }
        static __init_defines() {
            A.SHADERDEFINE_ALBEDOTEXTURE = A.shaderDefines.registerDefine("ALBEDOTEXTURE"),
                A.SHADERDEFINE_METALLICGLOSSTEXTURE = A.shaderDefines.registerDefine("METALLICGLOSSTEXTURE"),
                A.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA = A.shaderDefines.registerDefine("SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA"),
                A.SHADERDEFINE_NORMALTEXTURE = A.shaderDefines.registerDefine("NORMALTEXTURE"),
                A.SHADERDEFINE_PARALLAXTEXTURE = A.shaderDefines.registerDefine("PARALLAXTEXTURE"),
                A.SHADERDEFINE_OCCLUSIONTEXTURE = A.shaderDefines.registerDefine("OCCLUSIONTEXTURE"),
                A.SHADERDEFINE_EMISSION = A.shaderDefines.registerDefine("EMISSION"), A.SHADERDEFINE_EMISSIONTEXTURE = A.shaderDefines.registerDefine("EMISSIONTEXTURE"),
                A.SHADERDEFINE_REFLECTMAP = A.shaderDefines.registerDefine("REFLECTMAP"), A.SHADERDEFINE_TILINGOFFSET = A.shaderDefines.registerDefine("TILINGOFFSET"),
                A.SHADERDEFINE_ALPHAPREMULTIPLY = A.shaderDefines.registerDefine("ALPHAPREMULTIPLY");
        }
        static __init__() {
            this.__init_defines(), b.__init_shader();
        }
    }
    A.SmoothnessSource_MetallicGlossTexture_Alpha = 0, A.SmoothnessSource_AlbedoTexture_Alpha = 1,
        A.RENDERMODE_OPAQUE = 0, A.RENDERMODE_CUTOUT = 1, A.RENDERMODE_FADE = 2, A.RENDERMODE_TRANSPARENT = 3,
        A.SHADERDEFINE_ALBEDOTEXTURE = 0, A.SHADERDEFINE_NORMALTEXTURE = 0, A.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA = 0,
        A.SHADERDEFINE_METALLICGLOSSTEXTURE = 0, A.SHADERDEFINE_OCCLUSIONTEXTURE = 0, A.SHADERDEFINE_PARALLAXTEXTURE = 0,
        A.SHADERDEFINE_EMISSION = 0, A.SHADERDEFINE_EMISSIONTEXTURE = 0, A.SHADERDEFINE_REFLECTMAP = 0,
        A.SHADERDEFINE_TILINGOFFSET = 0, A.SHADERDEFINE_ALPHAPREMULTIPLY = 0, A.SMOOTHNESSSOURCE = -1,
        A.ENABLEEMISSION = -1, A.ENABLEREFLECT = -1, A.shaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);
    class O extends Laya.Script3D {
        constructor() {
            super(...arguments), this.rotSpeed = 5, this.tpos = new Laya.Vector3(0, 0, 0), this.rotationCam = !1;
        }
        static get ins() {
            return this._ins;
        }
        get pos() {
            return this.transform.position;
        }
        onAwake() {
            O._ins = this, this.camera = this.owner.getChildAt(0), this.transform = this.owner.transform,
                this.offset = this.transform.position.clone(), this.initRotation = this.transform.rotationEuler.clone(),
                this.spos = this.transform.position.clone(), this.tpos = this.transform.position.clone(),
                a.ins.on(a.LEVEL_CREATE_DONE, this, this.levelCreateDoneHandle), a.ins.on(a.LEVEL_FINISH, this, this.leveFinishHandle);
        }
        levelCreateDoneHandle() {
            this.rotationCam = !1, this.transform.rotationEuler = this.initRotation.clone();
        }
        leveFinishHandle() {
            this.rotationCam = !0;
        }
        onLateUpdate() {
            U.ins && (this.tpos.x = U.ins.pos.x + this.offset.x, this.tpos.z = U.ins.pos.z + this.offset.z,
                this.spos.x = Laya.MathUtil.lerp(this.spos.x, this.tpos.x, 10 * S.delta), this.spos.z = Laya.MathUtil.lerp(this.spos.z, this.tpos.z, 10 * S.delta),
                this.transform.position = this.spos, this.rotationCam && (this.transform.localRotationEulerY += S.delta * this.rotSpeed));
        }
        onDestroy() {
            a.ins.off(a.LEVEL_CREATE_DONE, this, this.levelCreateDoneHandle), a.ins.off(a.LEVEL_FINISH, this, this.leveFinishHandle);
        }
    }
    class M {
        static __init__() {
            let e = Laya.Shader3D.add("MUnlit", !0),
                t = new Laya.SubShader({
                    a_Position: 0,
                    a_Color: 1,
                    a_Texcoord0: 2,
                    a_BoneWeights: 6,
                    a_BoneIndices: 5,
                    a_MvpMatrix: 12
                }, {
                    u_Bones: 0,
                    u_AlbedoTexture: 1,
                    u_AlbedoColor: 1,
                    u_BgColor: 1,
                    u_TilingOffset: 1,
                    u_AlphaTestValue: 1,
                    u_MvpMatrix: 2,
                    u_WorldMat: 2,
                    u_Time: 4,
                    u_FogStart: 4,
                    u_FogRange: 4,
                    u_FogColor: 4
                }, Laya.SkinnedMeshSprite3D.shaderDefines, R.shaderDefines);
            e.addSubShader(t), t.addShaderPass('#include "Lighting.glsl";\n\nattribute vec4 a_Position;\n\nattribute vec2 a_Texcoord0;\n\n#ifdef GPU_INSTANCE\n\tattribute mat4 a_MvpMatrix;\n#else\n\tuniform mat4 u_MvpMatrix;\n#endif\n\nuniform mat4 u_WorldMat;\nuniform float u_Time;\n\nattribute vec4 a_Color;\nvarying vec4 v_Color;\nvarying vec2 v_Texcoord0;\n\n\n#ifdef TILINGOFFSET\n\tuniform vec4 u_TilingOffset;\n#endif\n\n#ifdef BONE\n\tconst int c_MaxBoneCount = 24;\n\tattribute vec4 a_BoneIndices;\n\tattribute vec4 a_BoneWeights;\n\tuniform mat4 u_Bones[c_MaxBoneCount];\n#endif\n\nvoid main() {\n\tvec4 position;\n\t#ifdef BONE\n\t\tmat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n\t\tskinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n\t\tskinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n\t\tskinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n\t\tposition=skinTransform*a_Position;\n\t#else\n\t\tposition=a_Position;\n\t#endif\n\n\tv_Texcoord0 = (u_WorldMat * position).xz;\n\n\tv_Texcoord0.x = v_Texcoord0.x + fract(u_Time * 0.02) / u_TilingOffset.x;\n   \tv_Texcoord0.y = v_Texcoord0.y + fract(u_Time * 0.01) / u_TilingOffset.y; \n\n\n\t#ifdef GPU_INSTANCE\n\t\tgl_Position = a_MvpMatrix * position;\n\t#else\n\t\tgl_Position = u_MvpMatrix * position;\n\t#endif\n\n\t#ifdef TILINGOFFSET\n\t\tv_Texcoord0=TransformUV(v_Texcoord0, u_TilingOffset);\n\t#endif\n\n\t#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n\t\tv_Color = a_Color;\n\t#endif\n\tgl_Position=remapGLPositionZ(gl_Position);\n}', "#ifdef FSHIGHPRECISION\n\tprecision highp float;\n#else\n\tprecision mediump float;\n#endif\n\n#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n\tvarying vec4 v_Color;\n#endif\n\n#ifdef ALBEDOTEXTURE\n\tuniform sampler2D u_AlbedoTexture;\n\tvarying highp vec2 v_Texcoord0;\n#endif\n\nuniform vec4 u_AlbedoColor;\nuniform vec4 u_BgColor;\n\n#ifdef ALPHATEST\n\tuniform float u_AlphaTestValue;\n#endif\n\n#ifdef FOG\n\tuniform float u_FogStart;\n\tuniform float u_FogRange;\n\t#ifdef ADDTIVEFOG\n\t#else\n\t\tuniform vec3 u_FogColor;\n\t#endif\n#endif\n\nvoid main()\n{\n\tvec4 color =  u_AlbedoColor;\n\t#ifdef ALBEDOTEXTURE\n\t\tcolor *= texture2D(u_AlbedoTexture, v_Texcoord0);\n        color.rgb = mix(u_BgColor.rgb, color.rgb, color.a);\n\t#endif\n\t#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n\t\tcolor *= v_Color;\n\t#endif\n\t\n\t#ifdef ALPHATEST\n\t\tif(color.a < u_AlphaTestValue)\n\t\t\tdiscard;\n\t#endif\n\t\n\tgl_FragColor = color;\n\t\n\t#ifdef FOG\n\t\tfloat lerpFact = clamp((1.0 / gl_FragCoord.w - u_FogStart) / u_FogRange, 0.0, 1.0);\n\t\t#ifdef ADDTIVEFOG\n\t\t\tgl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0), lerpFact);\n\t\t#else\n\t\t\tgl_FragColor.rgb = mix(gl_FragColor.rgb, u_FogColor, lerpFact);\n\t\t#endif\n\t#endif\n}\n", {
                s_Cull: 0,
                s_Blend: 1,
                s_BlendSrc: 2,
                s_BlendDst: 3,
                s_DepthTest: 12,
                s_DepthWrite: 13
            });
        }
    }
    var N = Laya.Vector4;
    class R extends Laya.BaseMaterial {
        constructor() {
            super(), this._albedoIntensity = 1, this._enableVertexColor = !1, this._albedoColor = new N(1, 1, 1, 1),
                this._bgColor = new N(1, 1, 1, 1), this._renderMode = 0, this.setShaderName("MUnlit"),
                this._shaderValues.setVector(R.ALBEDOCOLOR, this._albedoColor), this._shaderValues.setVector(R.BGCOLOR, this._bgColor),
                this.renderMode = 0;
        }
        get _ColorR() {
            return this._albedoColor.x;
        }
        set _ColorR(e) {
            this._albedoColor.x = e, this.albedoColor = this._albedoColor;
        }
        get _ColorG() {
            return this._albedoColor.y;
        }
        set _ColorG(e) {
            this._albedoColor.y = e, this.albedoColor = this._albedoColor;
        }
        get _ColorB() {
            return this._albedoColor.z;
        }
        set _ColorB(e) {
            this._albedoColor.z = e, this.albedoColor = this._albedoColor;
        }
        get _ColorA() {
            return this._albedoColor.w;
        }
        set _ColorA(e) {
            this._albedoColor.w = e, this.albedoColor = this._albedoColor;
        }
        get albedoColorR() {
            return this._ColorR;
        }
        set albedoColorR(e) {
            this._ColorR = e;
        }
        get albedoColorG() {
            return this._ColorG;
        }
        set albedoColorG(e) {
            this._ColorG = e;
        }
        get albedoColorB() {
            return this._ColorB;
        }
        set albedoColorB(e) {
            this._ColorB = e;
        }
        get albedoColorA() {
            return this._ColorA;
        }
        set albedoColorA(e) {
            this._ColorA = e;
        }
        get albedoColor() {
            return this._albedoColor;
        }
        set albedoColor(e) {
            var t = this._shaderValues.getVector(R.ALBEDOCOLOR);
            N.scale(e, this._albedoIntensity, t), this._albedoColor = e, this._shaderValues.setVector(R.ALBEDOCOLOR, t);
        }
        get bgColor() {
            return this._bgColor;
        }
        set bgColor(e) {
            this._bgColor = e, this._shaderValues.setVector(R.BGCOLOR, e);
        }
        get _MainTex_STX() {
            return this._shaderValues.getVector(R.TILINGOFFSET).x;
        }
        set _MainTex_STX(e) {
            var t = this._shaderValues.getVector(R.TILINGOFFSET);
            t.x = e, this.tilingOffset = t;
        }
        get _MainTex_STY() {
            return this._shaderValues.getVector(R.TILINGOFFSET).y;
        }
        set _MainTex_STY(e) {
            var t = this._shaderValues.getVector(R.TILINGOFFSET);
            t.y = e, this.tilingOffset = t;
        }
        get _MainTex_STZ() {
            return this._shaderValues.getVector(R.TILINGOFFSET).z;
        }
        set _MainTex_STZ(e) {
            var t = this._shaderValues.getVector(R.TILINGOFFSET);
            t.z = e, this.tilingOffset = t;
        }
        get _MainTex_STW() {
            return this._shaderValues.getVector(R.TILINGOFFSET).w;
        }
        set _MainTex_STW(e) {
            var t = this._shaderValues.getVector(R.TILINGOFFSET);
            t.w = e, this.tilingOffset = t;
        }
        get _AlbedoIntensity() {
            return this._albedoIntensity;
        }
        set _AlbedoIntensity(e) {
            if (this._albedoIntensity !== e) {
                var t = this._shaderValues.getVector(R.ALBEDOCOLOR);
                N.scale(this._albedoColor, e, t), this._albedoIntensity = e, this._shaderValues.setVector(R.ALBEDOCOLOR, t);
            }
        }
        get _Cutoff() {
            return this.alphaTestValue;
        }
        set _Cutoff(e) {
            this.alphaTestValue = e;
        }
        get albedoIntensity() {
            return this._albedoIntensity;
        }
        set albedoIntensity(e) {
            this._AlbedoIntensity = e;
        }
        get enableVertexColor() {
            return this._enableVertexColor;
        }
        set enableVertexColor(e) {
            this._enableVertexColor = e, e ? this._shaderValues.addDefine(R.SHADERDEFINE_ENABLEVERTEXCOLOR) : this._shaderValues.removeDefine(R.SHADERDEFINE_ENABLEVERTEXCOLOR);
        }
        get albedoTexture() {
            return this._shaderValues.getTexture(R.ALBEDOTEXTURE);
        }
        set albedoTexture(e) {
            e ? this._shaderValues.addDefine(R.SHADERDEFINE_ALBEDOTEXTURE) : this._shaderValues.removeDefine(R.SHADERDEFINE_ALBEDOTEXTURE),
                this._shaderValues.setTexture(R.ALBEDOTEXTURE, e);
        }
        get tilingOffsetX() {
            return this._MainTex_STX;
        }
        set tilingOffsetX(e) {
            this._MainTex_STX = e;
        }
        get tilingOffsetY() {
            return this._MainTex_STY;
        }
        set tilingOffsetY(e) {
            this._MainTex_STY = e;
        }
        get tilingOffsetZ() {
            return this._MainTex_STZ;
        }
        set tilingOffsetZ(e) {
            this._MainTex_STZ = e;
        }
        get tilingOffsetW() {
            return this._MainTex_STW;
        }
        set tilingOffsetW(e) {
            this._MainTex_STW = e;
        }
        get tilingOffset() {
            return this._shaderValues.getVector(R.TILINGOFFSET);
        }
        set tilingOffset(e) {
            e && (1 != e.x || 1 != e.y || 0 != e.z || 0 != e.w) ? this._shaderValues.addDefine(R.SHADERDEFINE_TILINGOFFSET) : this._shaderValues.removeDefine(R.SHADERDEFINE_TILINGOFFSET),
                this._shaderValues.setVector(R.TILINGOFFSET, e);
        }
        get blendSrc() {
            return this._shaderValues.getInt(R.BLEND_SRC);
        }
        set blendSrc(e) {
            this._shaderValues.setInt(R.BLEND_SRC, e);
        }
        get renderMode() {
            return this._renderMode;
        }
        set renderMode(e) {
            switch (e) {
                case 0:
                    this.alphaTest = !1, this.renderQueue = 2e3, this.depthWrite = !0, this.cull = 2,
                        this.blend = 0, this.depthTest = 513;
                    break;

                case 1:
                    this.renderQueue = 2450, this.alphaTest = !0, this.depthWrite = !0, this.cull = 2,
                        this.blend = 0, this.depthTest = 513;
                    break;

                case 2:
                    this.renderQueue = 3e3, this.alphaTest = !1, this.depthWrite = !1, this.cull = 2,
                        this.blend = 1, this.blendSrc = 770, this.blendDst = 771, this.depthTest = 513;
                    break;

                default:
                    throw new Error("UnlitMaterial : renderMode value error.");
            }
        }
        get depthWrite() {
            return this._shaderValues.getBool(R.DEPTH_WRITE);
        }
        set depthWrite(e) {
            this._shaderValues.setBool(R.DEPTH_WRITE, e);
        }
        get cull() {
            return this._shaderValues.getInt(R.CULL);
        }
        set cull(e) {
            this._shaderValues.setInt(R.CULL, e);
        }
        get blend() {
            return this._shaderValues.getInt(R.BLEND);
        }
        set blend(e) {
            this._shaderValues.setInt(R.BLEND, e);
        }
        get blendDst() {
            return this._shaderValues.getInt(R.BLEND_DST);
        }
        set blendDst(e) {
            this._shaderValues.setInt(R.BLEND_DST, e);
        }
        get depthTest() {
            return this._shaderValues.getInt(R.DEPTH_TEST);
        }
        set depthTest(e) {
            this._shaderValues.setInt(R.DEPTH_TEST, e);
        }
        static get ALBEDOTEXTURE() {
            return Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
        }
        static get ALBEDOCOLOR() {
            return Laya.Shader3D.propertyNameToID("u_AlbedoColor");
        }
        static get BGCOLOR() {
            return Laya.Shader3D.propertyNameToID("u_BgColor");
        }
        static get TILINGOFFSET() {
            return Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        static get CULL() {
            return Laya.Shader3D.propertyNameToID("s_Cull");
        }
        static get BLEND() {
            return Laya.Shader3D.propertyNameToID("s_Blend");
        }
        static get BLEND_SRC() {
            return Laya.Shader3D.propertyNameToID("s_BlendSrc");
        }
        static get BLEND_DST() {
            return Laya.Shader3D.propertyNameToID("s_BlendDst");
        }
        static get DEPTH_TEST() {
            return Laya.Shader3D.propertyNameToID("s_DepthTest");
        }
        static get DEPTH_WRITE() {
            return Laya.Shader3D.propertyNameToID("s_DepthWrite");
        }
        static get defaultMaterial() {
            return new R();
        }
        static __init__() {
            R.SHADERDEFINE_ALBEDOTEXTURE = R.shaderDefines.registerDefine("ALBEDOTEXTURE"),
                R.SHADERDEFINE_TILINGOFFSET = R.shaderDefines.registerDefine("TILINGOFFSET"), R.SHADERDEFINE_ENABLEVERTEXCOLOR = R.shaderDefines.registerDefine("ENABLEVERTEXCOLOR"),
                M.__init__();
        }
    }
    R.RENDERMODE_OPAQUE = 0, R.RENDERMODE_CUTOUT = 1, R.RENDERMODE_TRANSPARENT = 2,
        R.RENDERMODE_ADDTIVE = 3, R.SHADERDEFINE_ALBEDOTEXTURE = 0, R.SHADERDEFINE_TILINGOFFSET = 0,
        R.SHADERDEFINE_ENABLEVERTEXCOLOR = 0, R.shaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);
    class V extends Laya.Script3D {
        static get ins() {
            return this._ins;
        }
        onAwake() {
            V._ins = this, this.transform = this.owner.transform;
            let e = this.owner.meshRenderer.material;
            this.mat = new R(), this.mat.albedoTexture = e.albedoTexture, this.mat.tilingOffset = e.tilingOffset,
                this.mat.albedoIntensity = 1.33, this.owner.meshRenderer.material = this.mat;
        }
        onUpdate() {
            O.ins && (this.transform.localPositionX = O.ins.pos.x, this.transform.localPositionZ = O.ins.pos.z);
        }
        refreshColor() {
            let e = [
                    [40, 142, 234, 130, 170, 190, 92],
                    [111, 122, 127, 182, 182, 182, 88],
                    [80, 40, 208, 111, 68, 213, 117],
                    [142, 55, 15, 147, 96, 50, 136],
                    [23, 87, 68, 47, 125, 106, 163]
                ],
                t = e[Math.round(Math.random() * (e.length - 1))];
            this.mat.bgColor = n.ins.curBgColor = new Laya.Vector4(t[0] / 255, t[1] / 255, t[2] / 255, 1),
                this.mat.albedoColor = n.ins.curWaterColor = new Laya.Vector4(t[3] / 255, t[4] / 255, t[5] / 255, t[6] / 255);
        }
    }
    class B {
        static comp(e, t) {
            let i = Math.min(1, (e - 1) / this.config.max_level),
                s = t.split("_");
            switch (s[0]) {
                case "r":
                    let e = this.config["r_" + s[1]];
                    return {
                        t: "r",
                        speed: Laya.MathUtil.lerp(e.min, e.max, i) * -parseFloat(s[3])
                    };

                case "mxa":
                    let t = this.config.mxa;
                    return {
                        t: "mxa",
                        cap0: t.cap0,
                        cap1: t.cap1,
                        speed: Laya.MathUtil.lerp(t.min, t.max, i)
                    };

                case "mxb":
                    let a = this.config.mxb;
                    return {
                        t: "mxb",
                        x: parseFloat(s[2]),
                        cap: a.cap,
                        speed: Laya.MathUtil.lerp(a.min, a.max, i)
                    };
            }
            return null;
        }
        static gold(e) {
            return 100 + 5 * (e - 1);
        }
    }
    B.config = {
        max_level: 200,
        r_a: {
            min: 70,
            max: 138
        },
        r_b: {
            min: 70,
            max: 138
        },
        r_c: {
            min: 70,
            max: 138
        },
        r_d: {
            min: 70,
            max: 138
        },
        r_e: {
            min: 70,
            max: 138
        },
        r_f: {
            min: 70,
            max: 138
        },
        r_g: {
            min: 70,
            max: 138
        },
        r_h: {
            min: 70,
            max: 138
        },
        r_i: {
            min: 70,
            max: 138
        },
        r_j: {
            min: 70,
            max: 138
        },
        r_k: {
            min: 70,
            max: 138
        },
        mxa: {
            cap0: 1,
            cap1: .4,
            min: 2.8,
            max: 5
        },
        mxb: {
            cap: 1,
            min: 3,
            max: 8
        }
    };
    var k = Laya.Handler;
    class P {
        static load(e, t) {
            let i, s, a, n = [
                    () => {
                        r();
                    },
                    () => {
                        Laya.loader.create(d.mainScene_url, k.create(this, e => {
                            e ? (i = e, r()) : t.runWith(!1);
                        }), k.create(this, t => {
                            e && e.runWith(["加载3d资源... ", t]);
                        }, null, !1));
                    }, () => {
                        Laya.loader.create(d.skinScene_url, k.create(this, e => {
                            e ? (s = e, r()) : t.runWith(!1);
                        }), k.create(this, t => {
                            e && e.runWith(["加载3d资源... ", t]);
                        }, null, !1));
                    }, () => {
                        Laya.loader.load(d.pathData_url, k.create(this, e => {
                            e ? (a = e, r()) : t.runWith(!1);
                        }), k.create(this, t => {
                            e && e.runWith(["加载配置... ", t]);
                        }, null, !1));
                    }, () => {
                        Laya.Browser.onMiniGame ? Laya.loader.load("res/atlas/rank.atlas", Laya.Handler.create(this, e => {
                            e ? (Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas"), r()) : t.runWith(!1);
                        })) : r();
                    }
                ],
                r = () => {
                    n.length > 0 ? n.shift()() : (E.init(i, s, a), t.runWith(!0));
                };
            r();
        }
        static loadLevelPrefab(e, t) {
            Laya.loader.create(d.levelBase_url + "L" + e + ".lh", Laya.Handler.create(this, e => {
                e ? t && t.runWith(e) : t && t.runWith(null);
            })), Laya.Resource.destroyUnusedResources();
        }
    }
    var H = Laya.Sprite3D,
        F = Laya.Vector3;
    class G {
        constructor() {
            this.cur_levelNum = 0, this.lineColor = new Laya.Vector4(.54, .58, .67, 1), this.passLineColor = new Laya.Vector4(.54, .58, .67, 1),
                this.pathData = E.ins.pathData, this.scene = E.ins.mainScene, this.level_pos = this.scene.getChildByName("level_pos"),
                this.prefab = this.scene.getChildByName("prefab"), this.prefab.removeSelf();
        }
        static get ins() {
            if (this._ins) return this._ins;
            console.error("LevelMgr 为初始化 不可访问");
        }
        static init() {
            this._ins ? console.error("LevelMgr 不可从复初始化") : this._ins = new G();
        }
        createLevel(e) {
            if (console.log("createLevel:", e), e == this.cur_levelNum) return void a.ins.event(a.LEVEL_CREATE_DONE, this.cur_path);
            Laya.Resource.destroyUnusedResources();
            let t = e;
            t > this.pathData.length && (t = e % this.pathData.length == 0 ? this.pathData.length : e % this.pathData.length),
                V.ins.refreshColor(), this.passLineColor = this.getPassLineColor();
            let i = this.pathData[t - 1],
                s = i.path.slice(i.l_from, i.l_to + 1);
            P.loadLevelPrefab(t, Laya.Handler.create(this, t => {
                if (t) {
                    this.cur_level && this.cur_level.destroy(!0), this.cur_levelNum = e, this.cur_level = t,
                        this.level_pos.addChild(this.cur_level), this.cur_level.transform.position = new F(0, 0, 0);
                    let h = this.cur_level.getChildByName("event"),
                        l = H.instantiate(this.prefab.getChildByName("finish_fx"), h.getChildByName("finish_pos"));
                    l.transform.localPosition = new F(0, 0, 0), l.transform.localRotationEuler = new F(0, 0, 0),
                        l.transform.localScale = new F(1, 1, 1), this.setCollideWith(h), H.instantiate(this.prefab.getChildByName("chest"), this.cur_level.getChildByName("chestPos")).addComponent(I),
                        n(), r(), o(), this.cur_path = new C(s, i.path_length), a.ins.event(a.LEVEL_CREATE_DONE, this.cur_path);
                } else a.ins.event(a.LEVEL_CREATE_FAIL);
            }));
            let n = () => {
                    let e = this.cur_level.getChildByName("hinder");
                    for (let t = 0; t < e.numChildren; t++) {
                        let i = e.getChildAt(t);
                        if (i) {
                            let e = B.comp(this.cur_levelNum, i.name);
                            switch (e.t) {
                                case "r":
                                    i.addComponent(T).setup(e.speed);
                                    break;

                                case "mxa":
                                    i.addComponent(w).setup(e.speed, e.cap0, e.cap1);
                                    break;

                                case "mxb":
                                    i.addComponent(D).setup(e.x, e.cap, e.speed);
                            }
                        }
                        this.setCollideWith(i);
                    }
                },
                r = () => {
                    let e = y.createPath(i.path, 2, .5),
                        t = new Laya.MeshSprite3D(e),
                        s = new Laya.PBRStandardMaterial();
                    s.smoothness = 0, s.albedoColor = new Laya.Vector4(.823, .823, .823, 1), t.meshRenderer.material = s,
                        this.cur_level.addChild(t), t.transform.localPosition = new F(0, 0, 0);
                },
                o = () => {
                    let e = y.createLine(s, .3),
                        t = new Laya.MeshSprite3D(e);
                    this.lineMat = new A(), this.lineMat.albedoColor = this.lineColor, this.lineMat.albedoColor1 = this.passLineColor,
                        t.meshRenderer.material = this.lineMat, this.cur_level.addChild(t), t.transform.localPosition = new Laya.Vector3(0, .001, 0),
                        a.ins.off(a.AVATER_MOVED, this, this.drawLine), a.ins.on(a.AVATER_MOVED, this, this.drawLine);
                };
        }
        setCollideWith(e) {
            let t = e.getComponent(Laya.PhysicsCollider);
            t && (t.collisionGroup = 2, t.canCollideWith = 3);
            for (let t = 0; t < e.numChildren; t++) this.setCollideWith(e.getChildAt(t));
        }
        getPassLineColor() {
            let e = [
                    [171, 118, 160],
                    [174, 94, 203],
                    [123, 109, 229],
                    [109, 125, 229],
                    [109, 165, 229],
                    [83, 167, 167],
                    [83, 167, 115],
                    [107, 167, 83],
                    [184, 172, 73],
                    [184, 126, 73],
                    [184, 73, 73],
                    [73, 161, 184],
                    [73, 97, 184],
                    [123, 154, 12]
                ],
                t = Math.round(Math.random() * (e.length - 1));
            console.log("colorIdx:", t);
            let i = e[t],
                s = new Laya.Vector4(i[0] / 255, i[1] / 255, i[2] / 255, 1);
            return n.ins.curLineColor = s, s;
        }
        drawLine(e) {
            this.lineMat && (this.lineMat.progress = e);
        }
        showDiefx() {
            this.diefx = H.instantiate(this.prefab.getChildByName("diefx"), this.cur_level),
                this.diefx.transform.position = U.ins.pos.clone(), this.diefx.addComponent(v);
        }
        hideDiefx() {
            this.diefx && this.diefx.destroy(!0);
        }
    }
    class U extends Laya.Script3D {
        constructor() {
            super(...arguments), this.speedSlow = 1.5, this.speedMax = 3.8, this.accSpeed = 15,
                this.cSpeed = 0, this.state = 0, this.run = !1, this.failSoundTimes = 0, this._idle = "idle",
                this._run = "run_02", this._runSlow = "run_01", this._win = "win", this.cur_ani = "";
        }
        static get ins() {
            return this._ins;
        }
        get pos() {
            return this.self.transform.position;
        }
        onAwake() {
            U._ins = this, this.self = this.owner, this.rig = this.owner.getComponent(Laya.Rigidbody3D),
                this.rig.collisionGroup = 3, this.rig.canCollideWith = 2, a.ins.on(a.SKIN_CHANGED, this, this.onSkinChangeHandle),
                a.ins.on(a.LEVEL_CREATE_DONE, this, this.onLevelCreateDoneHandle), a.ins.on(a.LEVEL_START, this, this.onLevelStartHandle),
                a.ins.on(a.LEVEL_RELIFE, this, this.levelRelifeHandle), a.ins.on(a.LEVEL_COMPLETE, this, this.levelCompleteHandle),
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDownHandle), Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUpHandle);
        }
        mouseDownHandle() {
            1 == this.state && (this.run = !0, this.playRun());
        }
        mouseUpHandle() {
            1 == this.state && (this.run = !1, this.playIdle(.5));
        }
        onSkinChangeHandle(e) {
            this.skin = e, this.animator = e.getComponent(Laya.Animator), this.playIdle();
        }
        onLevelCreateDoneHandle(e) {
            this.path = e, this.state = 0, G.ins.hideDiefx(), this.path.setCharacter(this.self),
                this.skin && (this.skin.active = !0);
        }
        onLevelStartHandle() {
            this.skin.active = !0, this.state = 1, this.failSoundTimes = 0, G.ins.hideDiefx(),
                this.path.reset(), this.playIdle();
        }
        levelRelifeHandle() {
            this.skin.active = !0, this.state = 1, this.failSoundTimes = 0, G.ins.hideDiefx(),
                this.path.relife(), this.playIdle();
        }
        levelCompleteHandle() {
            this.state = 4, this.playWin();
        }
        faile() {
            2 != this.state && (this.run = !1, this.skin.active = !1, this.state = 2, G.ins.showDiefx(),
                a.ins.event(a.LEVEL_FAILED)), this.failSoundTimes < 3 && (_.ins.playFail(), this.failSoundTimes++);
        }
        onUpdate() {
            this.path && this.skin && (1 == this.state && (this.cSpeed += (this.run ? S.delta : -S.delta) * this.accSpeed,
                    this.cSpeed = Math.max(0, Math.min(this.cSpeed, this.speedMax)), this.path.move(this.cSpeed)),
                3 == this.state && this.path.move(this.speedSlow));
        }
        onTriggerEnter(e) {
            switch (e.owner.name) {
                case "fx_0":
                    this.showPartical(e.owner), a.ins.event(a.LEVEL_FINISH), this.state = 3, this.playRunSlow(),
                        this.run = !1;
                    break;

                case "fx_1":
                    this.showPartical(e.owner);

                case "fx_2":
                    this.showPartical(e.owner);
                    break;

                case "relife":
                    this.path.recordReliveIdx();
                    break;

                default:
                    this.faile();
            }
            "relife" != e.owner.name && l.ins.vibrateShort();
        }
        playIdle(e = .2) {
            this.animator && this.cur_ani != this._idle && (this.cur_ani = this._idle, this.animator.crossFade(this._idle, e));
        }
        playRun() {
            this.animator && this.cur_ani != this._run && (this.cur_ani = this._run, this.animator.crossFade(this._run, .2));
        }
        playRunSlow() {
            this.animator && this.cur_ani != this._runSlow && (this.cur_ani = this._runSlow,
                this.animator.crossFade(this._runSlow, .2));
        }
        playWin() {
            this.animator && this.cur_ani != this._win && (this.cur_ani = this._win, this.animator.crossFade(this._win, .2));
        }
        showPartical(e) {
            e.getChildAt(0).particleSystem.play(), e.getChildAt(1).particleSystem.play();
        }
        onDestroy() {
            a.ins.off(a.SKIN_CHANGED, this, this.onSkinChangeHandle), a.ins.off(a.LEVEL_CREATE_DONE, this, this.onLevelCreateDoneHandle),
                a.ins.off(a.LEVEL_START, this, this.onLevelStartHandle), Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDownHandle),
                Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUpHandle);
        }
    }
    var z = Laya.Sprite3D;
    class X {
        static get ins() {
            if (this._ins) return this._ins;
            console.error("SkinMgr 为初始化 不可访问");
        }
        static init() {
            this._ins ? console.error("SkinMgr 不可从复初始化") : this._ins = new X();
        }
        constructor() {
            this.scene = E.ins.mainScene, this.skinPrefab = this.scene.getChildByName("skin"),
                this.skinPrefab.removeSelf();
        }
        setSkin(e) {
            this.curSkinId != e && (this.curSkinId = e, this.curSkin && this.curSkin.destroy(!0),
                this.curSkin = z.instantiate(this.skinPrefab.getChildByName(e), U.ins.owner), this.curSkin.transform.localPosition = new Laya.Vector3(0, 0, 0),
                this.curSkin.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), a.ins.event(a.SKIN_CHANGED, this.curSkin));
        }
        getSkin(e) {
            return z.instantiate(this.skinPrefab.getChildByName(e));
        }
    }
    class W extends i.SkinUI {
        constructor() {
            super(...arguments), this.c_idx = 0;
        }
        onOpened() {
            this.gold.value = n.ins.user_data.gold.toString(), this.store_skins = n.ins.store_data,
                this.c_idx = this.getSkinIdx(n.ins.user_data.equ_skin), -1 == this.c_idx && (console.error("获取角色idx失败"),
                    this.c_idx = 0), this.refresh_LR_btn(), this.refresh_UU_btn(), this.setupSkinScene(),
                this.setSkin(this.c_idx), this.video_reward = n.ins.config.video_reward || 50, this.videoGold.value = "+" + this.video_reward,
                this.back.on(Laya.Event.CLICK, this, this.backHandle), this.mleft.on(Laya.Event.CLICK, this, this.leftHandle),
                this.mright.on(Laya.Event.CLICK, this, this.rightHandle), this.unlock.on(Laya.Event.CLICK, this, this.unlockHandle),
                this.use.on(Laya.Event.CLICK, this, this.useHandle), this.getGold.on(Laya.Event.CLICK, this, this.getGoldHandle),
                c.ins.showBanner();
        }
        leftHandle() {
            this.c_idx - 1 >= 0 && (this.c_idx--, this.setSkin(this.c_idx), this.refresh_LR_btn(),
                this.refresh_UU_btn());
        }
        rightHandle() {
            this.c_idx + 1 < this.store_skins.length && (this.c_idx++, this.setSkin(this.c_idx),
                this.refresh_LR_btn(), this.refresh_UU_btn());
        }
        getSkinIdx(e) {
            for (let t = 0; t < this.store_skins.length; t++)
                if (this.store_skins[t].id == e) return t;
            return -1;
        }
        hasSkin(e) {
            return -1 != n.ins.user_data.skin.indexOf(e);
        }
        setupSkinScene() {
            this.skinScene = E.ins.skinScene, this.addChild(this.skinScene);
            let e = this.skinScene.getChildByName("camera"),
                t = Laya.stage.clientScaleX,
                i = Laya.stage.clientScaleY;
            e.viewport = new Laya.Viewport(this.scenePos.x * t, this.scenePos.y * i, this.scenePos.width * t, this.scenePos.height * i),
                this.skinNode = this.skinScene.getChildByName("pos");
        }
        setSkin(e) {
            let t = this.store_skins[e];
            this.selectedSkin && this.selectedSkin.destroy(!0), this.selectedSkin = X.ins.getSkin(t.id),
                this.skinNode.addChild(this.selectedSkin), this.selectedSkin.transform.localPosition = new Laya.Vector3(0, 0, 0);
            let i = this.selectedSkin.getComponent(Laya.Animator);
            i && i.play("win"), this.cname.text = t.name;
        }
        refresh_LR_btn() {
            this.c_idx == this.store_skins.length - 1 ? this.mright.visible = !1 : this.mright.visible = !0,
                0 == this.c_idx ? this.mleft.visible = !1 : this.mleft.visible = !0;
        }
        refresh_UU_btn() {
            let e = this.store_skins[this.c_idx];
            this.hasSkin(e.id) ? (this.getGold.visible = this.unlock.visible = !1, this.use.visible = !0,
                e.id == n.ins.user_data.equ_skin ? (this.use.selected = !0, this.use.mouseEnabled = !1) : (this.use.selected = !1,
                    this.use.mouseEnabled = !0)) : (this.use.visible = !1, this.getGold.visible = this.unlock.visible = !0,
                this.price.value = e.price.toString());
        }
        unlockHandle() {
            let e = this.store_skins[this.c_idx];
            if (n.ins.user_data.gold >= e.price) {
                r.ins.unlockSkin(e, e => {
                    this.gold.value = n.ins.user_data.gold.toString()
                    this.refresh_UU_btn()
                })
            } else {
                platform.getInstance().prompt("Coin is not enought");
            }
        }
        useHandle() {
            let e = this.store_skins[this.c_idx];
            this.hasSkin(e.id) ? r.ins.equ_skin(e.id, e => {
                this.refresh_UU_btn();
            }) : console.error(this.c_idx + "该皮肤未拥有不可使用");
        }
        getGoldHandle() {
            platform.getInstance().showReward(() => {
                this.goldAnim(this.video_reward);
            })
        }
        goldAnim(e) {
            let t = [],
                i = [],
                s = this.goldImg.localToGlobal(new Laya.Point(0, 0));
            for (let e = 0; e < 10; e++) {
                let e = new Laya.Sprite();
                e.texture = this.goldImg.texture, e.width = this.goldImg.width, e.height = this.goldImg.height,
                    this.addChild(e);
                let s = this.getGold.localToGlobal(new Laya.Point(0, 0));
                e.pos(s.x, s.y), t.push(e), s.x += 500 * (Math.random() - .5), s.y -= 300 * Math.random(),
                    i.push(s);
            }
            let a = new Laya.Point(0, 0);
            Laya.Tween.to(a, {
                x: 2,
                update: Laya.Handler.create(this, () => {
                    if (a.x < 1)
                        for (let e = 0; e < t.length; e++) t[e].x = Laya.MathUtil.lerp(t[e].x, i[e].x, a.x),
                            t[e].y = Laya.MathUtil.lerp(t[e].y, i[e].y, a.x);
                    else
                        for (let e = 0; e < t.length; e++) t[e].x = Laya.MathUtil.lerp(t[e].x, s.x, a.x - 1),
                            t[e].y = Laya.MathUtil.lerp(t[e].y, s.y, a.x - 1);
                }, null, !1)
            }, 2e3, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                l.ins.vibrateShort(), _.ins.playGoldGet(), r.ins.rewardGold(e, e => {
                    this.gold.value = n.ins.user_data.gold.toString()
                });
            }));
        }
        backHandle() {
            t.open(K);
        }
        onClosed() {
            this.selectedSkin.destroy(!0), this.skinScene.removeSelf(), this.back.off(Laya.Event.CLICK, this, this.backHandle),
                this.tween && this.tween.clear(), c.ins.hideBanner();
        }
    }
    class Y extends i.RankUI {
        onOpened() {
            h.ins.showRank(), this.back.on(Laya.Event.CLICK, this, this.backHandle);
        }
        backHandle() {
            t.open(K);
        }
        onClosed() {
            h.ins.hideRank(), this.back.off(Laya.Event.CLICK, this, this.backHandle);
        }
    }
    class K extends i.HomeUI {
        onOpened(e) {
            this.levelProgress.bar.sizeGrid = "0,0,0,0,1", this.levelProgress.value = 0, this.levelNum.text = "Level " + n.ins.user_data.level + " ",
                this.gold.value = n.ins.user_data.gold.toString(), console.log("menuY:", h.ins.menuY),
                this.goldBox.y = h.ins.menuY, this.levelProgress.y = h.ins.menuY + 80, a.ins.event(a.CREATE_LEVEL, n.ins.user_data.level),
                this.start.on(Laya.Event.CLICK, this, this.starthandle),
                this.skin.on(Laya.Event.CLICK, this, this.skinHandle),
                this.setting(), this._zsad(), c.ins.hideBanner();
        }
        setting() {
            this.settingBox.y = this.goldBox.y + 100;
            // this.sound.selected = !_.ins.enable, 
            // this.vibrate.selected = !l.ins.enable, 
            // this.sound.on(Laya.Event.CHANGE, this, this.soundSet);
            // this.vibrate.on(Laya.Event.CHANGE, this, this.vibrateSet);
        }
        soundSet() {
            // _.ins.enable = !this.sound.selected;
        }
        vibrateSet() {}
        _zsad() {
            this.cnxh.visible = !1;
            this.zsad.visible = !1;
        }
        cnxhHandle() {
            t.open(p, !1);
        }
        starthandle() {

            platform.getInstance().showInterstitial(() => {
                a.ins.event(a.LEVEL_START), t.open(f);
            });



        }
        skinHandle() {
            t.open(W);
        }
        rankHandle() {
            t.open(Y);
        }
        sharehandle() {
            h.ins.share();
        }
        onClosed() {
            this.start.off(Laya.Event.CLICK, this, this.starthandle),
                this.skin.off(Laya.Event.CLICK, this, this.skinHandle);
            // this.rank.off(Laya.Event.CLICK, this, this.rankHandle),
            //  this.sound.off(Laya.Event.CHANGED, this, this.soundSet);
        }
    }
    class Z {
        static init() {
            this._ins ? console.error("GameScene 不可从复初始化") : this._ins = new Z();
        }
        static get ins() {
            if (this._ins) return this._ins;
            console.error("GameScene 未初始化 不可访问");
        }
        constructor() {
            this.scene = E.ins.mainScene,
                Laya.stage.addChildAt(this.scene, 0),
                this.scene.addComponent(S),
                this.scene.getChildByName("water").addComponent(V),
                this.scene.getChildByName("camera").addComponent(O),
                this.scene.getChildByName("avatar").addComponent(U),
                X.init(), G.init(),
                a.ins.on(a.CREATE_LEVEL, this, this.createLevel);
        }
        createLevel(e) {
            G.ins.createLevel(e), X.ins.setSkin(n.ins.user_data.equ_skin);
        }
    }
    class j extends i.LoadingUI {
        onOpened() {
            this.v.text = r.v,
                this.progress.bar.sizeGrid = "0,28,0,28,0",
                this.tips.visible = this.tips_bg.visible = !1;

            let yad = new Laya.Image();
            yad.skin = "common/yad.png";
            yad.zOrder = 1e3;
            yad.left = 10;
            yad.bottom = 10;
            window.adsGameCon.recordOpen();
            yad.on(Laya.Event.MOUSE_DOWN, this, () => {
                platform.getInstance().navigate("GAME", "LOGO");
            });
            Laya.stage.addChild(yad);
            window.yad = yad;
            window.yad.visible = false;
            // this.retry.on(Laya.Event.CLICK, this, this.retryHandle), 
            a.ins.on(a.LEVEL_CREATE_DONE, this, this.createLevelDone),
                a.ins.on(a.LEVEL_CREATE_FAIL, this, this.createLevelFail),

                r.ins.request_zs_config(),
                this.init(),
                this.login();
        }
        init() {
            A.__init__(), R.__init__(), g.pullZSData(),
                Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
        }
        login() {
            let user_data = platform.getInstance().getStorageSync("user_data");
            if (!user_data) {
                user_data = {
                    gold: 0,
                    level: 1,
                    equ_skin: "c0",
                    skin: ["c0"]
                };
                platform.getInstance().setStorageSync("user_data", user_data);


            }
            n.ins.store_data = [{
                    "price": 100,
                    "_id": "5dc5a20198675c4a75584e85",
                    "id": "c0",
                    "name": ""
                },
                {
                    "price": 1100,
                    "_id": "5dc5a22a98675c4a75584e86",
                    "id": "c1",
                    "name": ""
                },
                {
                    "price": 1200,
                    "_id": "5dc5a26b98675c4a75584e87",
                    "id": "c2",
                    "name": ""
                },
                {
                    "price": 1300,
                    "_id": "5dc5a29a98675c4a75584e88",
                    "id": "c3",
                    "name": ""
                },
                {
                    "price": 1400,
                    "_id": "5dc5a2bb98675c4a75584e89",
                    "id": "c4",
                    "name": ""
                },
                {
                    "price": 1500,
                    "_id": "5dc5a2d798675c4a75584e8a",
                    "id": "c5",
                    "name": ""
                }
            ]
            n.ins.config = {
                level_reward: 50
            };
            n.ins.user_data = user_data;


            // YYGSDK.on(YYG.Event.YYGSDK_INITIALIZED, this, () => {
            //     // this.yad.visible =true;
            //     window.yad.visible = true;
            //     this.load();
            // });
            // let o = new YYG.Options();
            // o.gameNameId = "Line-Color-3D";
            // o.gamedistributionID = "";
            // YYGSDK.__init__(YYG.ChannelType.YAD, o);

            platform.getInstance().yadstartup("Line-Color-3d", () => {
                window.yad.visible = true;
                this.load();
            })

        }
        load() {
            P.load(Laya.Handler.create(this, (e, t) => {
                    this.progress.value = t, this.pv.text = Math.round(100 * t) + "%";
                }, null, !1),
                Laya.Handler.create(this, e => {
                    Z.init(),
                        a.ins.event(a.CREATE_LEVEL, n.ins.user_data.level)
                }));
        }
        showLoadFailTips() {
            this.tips.visible = this.tips_bg.visible = !0;
        }
        retryHandle() {
            this.tips.visible = this.tips_bg.visible = !1, this.login();
        }
        createLevelDone() {
            h.ins.init(), l.ins.init(), _.ins.init(), _.ins.playBg(), c.ins.init(), t.open(K);
        }
        createLevelFail() {
            console.log("levle 创建失败"), this.showLevelCreateFail();
        }
        showLevelCreateFail() {
            this.tips.visible = this.tips_bg.visible = !0, this.tipMsg.text = "关卡创建失败，点击确定重试",
                this.retry.offAll(Laya.Event.CLICK), this.retry.on(Laya.Event.CLICK, this, () => {
                    this.tips.visible = this.tips_bg.visible = !1, a.ins.event(a.CREATE_LEVEL, n.ins.user_data.level);
                });
        }
        onClosed() {
            a.ins.off(a.LEVEL_CREATE_DONE, this, this.createLevelDone), a.ins.off(a.LEVEL_CREATE_FAIL, this, this.createLevelFail);
            // this.retry.offAll(Laya.Event.CLICK);
        }
    }
    new class {
        constructor() {
            window.Laya3D ? Laya3D.init(e.width, e.height) : Laya.init(e.width, e.height, Laya.WebGL),
                Laya.Physics && Laya.Physics.enable(),
                Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
            Laya.stage.alignH = "center";
            Laya.stage.alignV = "middle";
            e.stat && Laya.Stat.show(10, 50), Laya.stage.useRetinalCanvas = false,
                this.onVersionLoaded();
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Laya.timer.frameOnce(1, this, () => {
                t.open(j);
            });
        }
    }();
}();window.adsGameCon.startup(AdsName);