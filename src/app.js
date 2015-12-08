
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
        // 是否长按
        isLongPress = false;

        // 游戏是否开始
        isStart = false;

        this.isCollision = false;
        this.isPass = false;

    },

    // 初始化UI
    initUI:function ()
    {
        var size = cc.winSize;

        // 显示点击屏幕开始
        this.tapLabel = cc.LabelTTF.create("Tap To Start", "Arial", 30);
        this.tapLabel.setPosition(size.width / 2, size.height / 6);
        this.addChild(this.tapLabel, 1);

        // 显示主节点，即玩家操作的节点
        this.mainNode = new MainNode();
        this.mainNode.setPosition(size.width / 2, size.height / 2);
        this.mainNode.init();
        this.addChild(this.mainNode);

        // 初始化障碍物UI
        this.blockNode = new BlockNode();
        this.blockNode.setPosition(size.width / 2, 0);
        this.blockNode.init();
        this.addChild(this.blockNode);


        // 显示分数
    },

    // 初始化触摸事件
    initTouch:function ()
    {
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                isStart = true;
                isLongPress = true;
                return true;
            },
            onTouchEnded: function (touch, event) {
                isLongPress = false;
            },
        });

        cc.eventManager.addListener(this.touchListener,this);
    },

    // 每帧更新函数
    update:function (ts)
    {
        // 更新主节点
        this.mainNode.update(ts, isStart, isLongPress);

        if (isStart)
        {
            this.tapLabel.setVisible(false);

            // 更新障碍物
            this.blockNode.update(ts, isStart);

            // 更新主节点状态，查看是否碰撞和通关
            this.updateState(ts);

            // 如果发生碰撞
            if (this.isCollision)
            {
                this.isCollision = false;
                cc.log("不好意思， 碰撞了");
            }

            // 如果通过障碍物
            if (this.isPass)
            {
                this.isPass = false;
                cc.log("恭喜你，通过一关");
            }
        }

    },

    // 更新当前游戏状态，是碰撞了，还是通关
    // 碰撞检测,分为和边缘碰撞、障碍物碰撞
    updateState:function(ts)
    {
        var size = cc.winSize;

        var rot = this.mainNode.getRotation();
        var moveDis = this.mainNode.moveDis;
        var rad = this.mainNode.radius;

        var posX = size.width  / 2 + moveDis * Math.sin(rot);
        var posY = size.height / 2 + moveDis * Math.cos(rot);

        // 1、判断是否和边缘碰撞
        if ((posX - rad <= 0) || (posX + rad >= size.width) || (posY - rad <= 0) || (posY + rad >= size.height))
        {
            cc.log("collison1");
            this.isCollision = true;
            return;
        }

        // 2、判断是否和障碍物碰撞
        // 2.1 先判断是否和阻挡圆碰撞
        var blockRad = rad * 0.8 + 4;
        var blockPosY = this.blockNode.getPositionY();
        var blockPos1 = cc.p(size.width / 2 - size.width / 8, blockPosY);
        var blockPos2 = cc.p(size.width / 2 + size.width / 8, blockPosY);

        if (this.square(blockPos1.x - posX) + this.square(blockPos1.y - posY) <= this.square(rad + blockRad) ||
            this.square(blockPos2.x - posX) + this.square(blockPos2.y - posY) <= this.square(rad + blockRad))
        {
            this.isCollision = true;
            return ;
        }

        // 2.2 再判断是否和阻挡杆碰撞
        if (posY - rad <= blockPosY)
        {
            if (posX + rad <= size.width / 2 + size.width / 4 && posX - rad >= size.width / 2 - size.width / 4)
            {
                this.isPass = true;
                cc.log("isPass", true);
                return;
            }
            else
            {
                this.isCollision = true;
                cc.log("isCollision", true);
                return ;
            }
        }

    },

    square:function(value)
    {
        return value * value;
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});