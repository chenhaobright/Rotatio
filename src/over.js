var MenuLayer = cc.Layer.extend({
    ctor:function()
    {
        this._super();
        return true;
    },

    init:function()
    {
        //var bgSprite = new cc.Sprite();
        //this.addChild(bgSprite);

        // 声音开关
        //var soundItem = new cc.MenuItemSprite("normal", "select", "disabled");
        var soundItem = new cc.MenuItemFont("sound", this.soundCallback, this);
        soundItem.setPosition(-100, 0);

        // 重新开始
        //var restartItem = new cc.MenuItemSprite("normal", "select", "disabled");
        var restartItem = new cc.MenuItemFont("restart", this.restartCallback, this);
        restartItem.setPosition(0, 0);

        // 分享链接
        //var shareItem = new cc.MenuItemSprite("normal", "select", "disabled");
        var shareItem = new cc.MenuItemFont("share", this.shareCallback, this);
        shareItem.setPosition(100, 0);

        var menu = new cc.Menu(soundItem, restartItem, shareItem);
        menu.setPosition(0,0);
        this.addChild(menu);
    },

    soundCallback:function()
    {
        cc.log("soundCallback");
    },

    restartCallback:function()
    {
        cc.log("restartCallback");

        var scene = new BlackScene();
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
        //cc.director.runScene(scene);
    },

    shareCallback:function()
    {
        cc.log("shareCallback");
    },

    updateLabel:function()
    {
        // 显示分数:本场分数,历史最高分数
        var curScore = parseInt(cc.sys.localStorage.getItem("CurScore"));
        if(isNaN(curScore)){curScore = 0;}
        var curScoreLabel = new cc.LabelTTF("CurScore:" + curScore);
        curScoreLabel.setFontSize(22);
        curScoreLabel.setPosition(0, 100);
        this.addChild(curScoreLabel);

        var bestScore = parseInt(cc.sys.localStorage.getItem("BestScore"));
        if(isNaN(bestScore)){bestScore = 0;}
        var bestScoreLabel = new cc.LabelTTF("BestScore:" + bestScore);
        bestScoreLabel.setFontSize(22);
        bestScoreLabel.setPosition(0, 200);
        this.addChild(bestScoreLabel);
    },
})