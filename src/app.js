
var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();

        return true;
    },

    // 初始化
    init:function()
    {
        this.initData();

        this.initUI();

        this.initTouch();

        this.scheduleUpdate();
    },

    // 初始化游戏数据
    initData:function()
    {
        this.rotLen = cc.winSize.height * 0.75 * 0.5;
        this.rotPos = cc.p(0, 0);
        this.rotDir = 1; // 旋转方向，1表示顺时针， -1表示逆时针

        // 每秒公转速度
        this.revolutionSpeed = 54;

        // 是否长按
        this.isLongPress = false;

        // 游戏是否开始
        this.isStart = false;

        this.isCollision = false;
        this.isPass = false;
    },

    // 新的公转旋转点位置
    updateRotPos:function ()
    {
        var rot = 0;
        if (this.rotDir == 1)
        {
            rot = this.mainNode.getRotation() + 90;
        }
        else
        {
            rot = this.mainNode.getRotation() - 90;
        }

        var hudu = 3.14 * rot / 180;

        this.rotPos.x = this.mainNode.getPositionX() + this.rotLen * Math.sin(hudu);
        this.rotPos.y = this.mainNode.getPositionY() + this.rotLen * Math.cos(hudu);

        this.dotNode.setPosition(this.rotPos);

        return this.rotPos
    },

    // 初始化UI
    initUI:function ()
    {
        var size = cc.winSize;

        // 显示点击屏幕开始
        this.tapLabel = cc.LabelTTF.create("Tap To Start", "Arial", 30);
        this.tapLabel.setPosition(size.width / 2, size.height / 6);
        this.addChild(this.tapLabel, 1);

        // 初始化障碍物UI
        this.blockNode = new BlockNode();
        this.blockNode.init();
        this.addChild(this.blockNode);

        // 显示主节点，即玩家操作的节点
        this.mainNode = new MainNode();
        this.mainNode.setPosition(size.width / 2, size.height / 2);
        this.mainNode.init();
        this.addChild(this.mainNode);

        this.dotNode = new cc.DrawNode();
        this.dotNode.setPosition(this.rotPos);
        this.dotNode.drawDot(cc.p(0, 0), 1, cc.color(255, 255, 255));
        this.addChild(this.dotNode);


        // 显示分数
    },

    // 初始化触摸事件
    initTouch:function ()
    {
        var self = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                self.isStart = true;
                self.isLongPress = true;
                self.rotDir = 1;

                self.mainNode.showArrow(1);

                self.updateRotPos();

                return true;
            },
            onTouchEnded: function (touch, event) {
                self.isLongPress = false;
                self.rotDir = -1;

                self.mainNode.showArrow(2);

                self.updateRotPos();
            },
        });

        cc.eventManager.addListener(this.touchListener,this);
    },

    // 每帧更新函数
    update:function (ts)
    {
        var angel = ts * this.revolutionSpeed;
        var rot1 = this.mainNode.getRotation() + angel;
        this.mainNode.setRotation(rot1);

        if (this.isStart)
        {
            // 隐藏提示
            this.tapLabel.setVisible(false);

            // 更新mainNode位置和方向
            var rot2 = 0;
            if (this.rotDir == 1) {
                rot2 = this.mainNode.getRotation() - 90;
            }
            else {
                rot2 = this.mainNode.getRotation() + 90;
            }
            var hudu = 3.14 * rot2 / 180;
            var posX = this.rotPos.x + this.rotLen * Math.sin(hudu);
            var posY = this.rotPos.y + this.rotLen * Math.cos(hudu);
            this.mainNode.setPosition(posX, posY);

            // 更新障碍物
            this.blockNode.update(ts);

            // 更新主节点状态，查看是否碰撞和通关
            this.updateState(ts);

            // 如果发生碰撞
            if (this.isCollision)
            {
                this.isCollision = false;
            }

            // 如果通过障碍物
            if (this.isPass)
            {
                this.isPass = false;
                cc.log("通过障碍物");
            }
        }

    },

    // 更新当前游戏状态，是碰撞了，还是通关
    // 碰撞检测,分为和边缘碰撞、障碍物碰撞
    updateState:function(ts)
    {
        var size = cc.winSize;

        var mainPos = this.mainNode.getPosition();
        var mainRad = this.mainNode.getRadius();

        // 1）是否和边框碰撞
        if ((mainPos.x - mainRad <= 0) ||
            (mainPos.x + mainRad >= size.width) ||
            (mainPos.y - mainRad <= 0) ||
            (mainPos.y + mainRad >= size.height))
        {
            //cc.log("和边框碰撞");
            this.isCollision = true;
            this.isPass = false;
            return;
        }

        // 2） 是否和障碍物碰撞
        if (this.blockNode.checkCollision(mainPos, mainRad))
        {
            //cc.log("和障碍物碰撞");
            this.isCollision = true;
            this.isPass = false;
            return;
        }

        // 3)是否通过障碍物
        if(this.blockNode.checkPass(mainPos, mainRad))
        {
            //cc.log("通过障碍物");
            this.isCollision = false;
            this.isPass = true;
            return;
        }
    },

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.log(Math.floor(2/5));
        var layer = new GameLayer();
        layer.init();

        this.addChild(layer);
    }
});