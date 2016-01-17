
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

        // 是否长按
        this.isLongPress = false;

        // 游戏是否开始
        this.isStart = false;

        this.isOver = false;

        this.smallTriangle = [];
        this.bigTriangle = [];
        this.triangleNum = 140;
        this.speed = 40;

    },

    // 新的公转旋转点位置
    updateRotPos:function ()
    {
        var rot = this.mainNode.getRotation() + 90 * this.rotDir;
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
        this.scoreLabel = new cc.LabelTTF("");
        this.scoreLabel.setFontSize(142);
        this.scoreLabel.setPosition(size.width / 2, size.height / 2);
        this.setOpacity(0);
        this.addChild(this.scoreLabel);
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
        this.mainNode.update(ts, this);

        if (this.isStart)
        {
            // 隐藏提示
            this.tapLabel.setVisible(false);

            // 更新mainNode位置和方向
            var rot = this.mainNode.getRotation() - 90 * this.rotDir;
            var hudu = 3.14 * rot / 180;

            var posX = this.rotPos.x + this.rotLen * Math.sin(hudu);
            var posY = this.rotPos.y + this.rotLen * Math.cos(hudu);
            this.mainNode.setPosition(posX, posY);

            // 更新障碍物
            this.blockNode.update(ts, this);

            // 碰撞逻辑
            this.collisionLogic(ts);
        }
        else if(this.isOver)
        {
            var k = 0;
            for (k = 0; k < this.triangleNum; k++)
            {
                // 更新小三角形
                var smallData = this.smallTriangle[k];
                var smallSprite = smallData.sprite;
                var smallPosX = smallSprite.getPositionX() + smallData.speedX * ts;
                var smallPosY = smallSprite.getPositionY() + smallData.speedY * ts;
                smallSprite.setPosition(cc.p(smallPosX, smallPosY));
                if(smallPosX - smallData.w <= 0 && smallData.speedX <= 0)
                {
                    smallData.speedX = smallData.speedX * -1;
                }
                if(smallPosX + smallData.w >= cc.winSize.width && smallData.speedX >= 0)
                {
                    smallData.speedX = smallData.speedX * -1;
                }

                if(smallPosY - smallData.h <= 0 && smallData.speedY <= 0)
                {
                    smallData.speedY = smallData.speedY * -1;
                }
                if(smallPosY + smallData.h >= cc.winSize.height && smallData.speedY >= 0)
                {
                    smallData.speedY = smallData.speedY * -1;
                }

                // 更新大三角形
                var bigData = this.bigTriangle[k];
                var bigSprite = bigData.sprite;
                var bigPosX = bigSprite.getPositionX() + 2 * bigData.speedX * ts;
                var bigPosY = bigSprite.getPositionY() + 2 * bigData.speedY * ts;
                bigSprite.setPosition(cc.p(bigPosX, bigPosY));

                if(bigPosX - bigData.w <= 0 && bigData.speedX <= 0)
                {
                    bigData.speedX = bigData.speedX * -1;
                }
                if(bigPosX + bigData.w >= cc.winSize.width && bigData.speedX >= 0)
                {
                    bigData.speedX = bigData.speedX * -1;
                }

                if(bigPosY - bigData.h <= 0 && bigData.speedY <= 0)
                {
                    bigData.speedY = bigData.speedY * -1;
                }
                if(bigPosY + bigData.h >= cc.winSize.height && bigData.speedY >= 0)
                {
                    bigData.speedY = bigData.speedY * -1;
                }

            }
        }

    },

    updateScoreLabel:function(score)
    {
        if (score < 1){return ;}

        this.scoreLabel.setOpacity(255);
        this.scoreLabel.setString("" + score);
        this.scoreLabel.runAction(cc.fadeOut(1));

    },

    // 碰撞检测,分为和边缘碰撞、障碍物碰撞
    collisionLogic:function(ts)
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
            this.isOver = true;
        }

        // 2） 是否和障碍物碰撞
        if (this.blockNode.getIsCollision())
        {
            this.isOver = true;
        }

        // 如果发生碰撞,则游戏失败，弹出UI层，创建随机三角形
        if (this.isOver)
        {
            cc.log("碰撞了");
            this.isStart = false;
            this.clear();
        }
    },

    createTriangle:function()
    {
        var scale = 0.5;

        // 加载大三角形图片
        var i = 0;
        for(i = 0; i < this.triangleNum; i++)
        {
            var rot = 3.14 * Math.random() * 360 / 180;
            var bigSprite = new cc.Sprite(res.Triangle_png);

            // 设置随机位置
            bigSprite.setPositionX(this.mainNode.getPositionX() + rot % 50);
            bigSprite.setPositionY(this.mainNode.getPositionY() + rot % 50);

            this.addChild(bigSprite);

            var data = {
                sprite:bigSprite,
                speedX:this.speed * Math.sin(rot) + 100 * (Math.random() - 0.5),
                speedY:this.speed * Math.cos(rot) + 100 * (Math.random() - 0.5),
                w:bigSprite.getBoundingBox().width/2,
                h:bigSprite.getBoundingBox().height/2,
            }

            bigSprite.setScale(0.2);
            bigSprite.runAction(cc.scaleTo(2.2, 1, 1));

            this.bigTriangle[i] = data;
        }

        // 加载小三角形图片
        var k = 0;
        var deltaLen = cc.winSize.height / this.triangleNum;
        for(k = 0; k < this.triangleNum; k++)
        {
            var smallSprite = new cc.Sprite(res.Triangle_png);

            var hudu = this.mainNode.getRotation() * 3.14 / 180;

            var x = this.mainNode.getPositionX() + deltaLen * (2 * k - this.triangleNum) * Math.sin(hudu);
            var y = this.mainNode.getPositionY() + deltaLen * (2 * k - this.triangleNum) * Math.cos(hudu);
            smallSprite.setPosition(cc.p(x, y));
            this.addChild(smallSprite);

            var rot = 3.14 * Math.random() * 360 / 180;
            var data = {
                sprite:smallSprite,
                speedX:this.speed * Math.cos(rot) * scale + 100 * (Math.random() - 0.5),
                speedY:this.speed * Math.sin(rot) * scale + 100 * (Math.random() - 0.5),
                w:smallSprite.getBoundingBox().width/2 * scale,
                h:smallSprite.getBoundingBox().height/2 * scale,
            }

            smallSprite.setScale(0.2);
            smallSprite.runAction(cc.scaleTo(2.2, scale, scale));

            this.smallTriangle[k] = data;
        }

    },

    clear:function()
    {
        // 创建动态三角形
        this.createTriangle();

        // 移除触摸监听
        cc.eventManager.removeListener(this.touchListener, this);

        // 显示战况信息
        var curScore = this.blockNode.getPassCount();
        var bestScore = parseInt(cc.sys.localStorage.getItem("BestScore"));
        cc.log(bestScore, cc.sys.localStorage.getItem("BestScore"), isNaN(bestScore));
        if(isNaN(bestScore)){bestScore = 0;}

        if(curScore > bestScore) {
            bestScore = curScore;
        }

        cc.log(curScore, bestScore);

        cc.sys.localStorage.setItem("CurScore", curScore);
        cc.sys.localStorage.setItem("BestScore", bestScore);

        var menuLayer = cc.director.getRunningScene().getChildByName("MenuLayer");
        if(menuLayer)
        {
            menuLayer.setVisible(true);
            menuLayer.updateLabel();
        }

        // 隐藏UI
        this.mainNode.setVisible(false);
        this.blockNode.setVisible(false);

    },
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var gameLayer = new GameLayer();
        gameLayer.init();
        this.addChild(gameLayer);

        var menuLayer = new MenuLayer();
        menuLayer.init();
        menuLayer.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        menuLayer.setVisible(false);

        this.addChild(menuLayer, 10, "MenuLayer");
    }
});