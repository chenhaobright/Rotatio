var BlackScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.schedule(this.newScene, 0.3, 1, 0);
    },

    newScene:function(dt)
    {
        var scene = new GameScene();
        //cc.director.runScene(new cc.TransitionFade(10, scene));
        cc.director.runScene(scene);
    },
});