
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
        this.dotNode.drawDot(cc.p(0, 0), 10, cc.color(255, 255, 255));
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
        // 更新主节点
        //this.mainNode.update(ts, this.isStart, this.isLongPress);

        var angel = ts * this.revolutionSpeed;
        var rot1 = this.mainNode.getRotation() + angel;
        this.mainNode.setRotation(rot1);

        if (this.isStart)
        {
            var rot2 = 0;

            if (this.rotDir == 1)
            {
                rot2 = this.mainNode.getRotation() - 90;
            }
            else
            {
                rot2 = this.mainNode.getRotation() + 90;
            }

            var hudu = 3.14 * rot2 / 180;

            var posX = this.rotPos.x + this.rotLen * Math.sin(hudu);
            var posY = this.rotPos.y + this.rotLen * Math.cos(hudu);

            this.mainNode.setPosition(posX, posY);

            this.tapLabel.setVisible(false);

            // 更新障碍物
            this.blockNode.update(ts);

            // 更新主节点状态，查看是否碰撞和通关
            //this.updateState(ts);

            // 如果发生碰撞
            if (this.isCollision)
            {
                this.isCollision = false;
                //cc.log("不好意思， 碰撞了");
            }

            // 如果通过障碍物
            if (this.isPass)
            {
                this.isPass = false;
                //cc.log("恭喜你，通过一关");
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
            //cc.log("collison1");
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
                //cc.log("isPass", true);
                return;
            }
            else
            {
                this.isCollision = true;
                //cc.log("isCollision", true);
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
        cc.log(Math.floor(2/5));
        var layer = new GameLayer();
        layer.init();

        this.addChild(layer);
    }
});