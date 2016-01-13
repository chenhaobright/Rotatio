var MainNode = cc.Node.extend({
    _lineWidth: 1,
    _drawColor: null,
    ctor:function()
    {
        this._super();

        this.radius = 30;

        this.circleLen = 5;

        // 每秒公转速度
        this.revolutionSpeed = 54;

        this.smallTriangle = [];
        this.bigTriangle = [];
        this.triangleNum = 60;
        this.speed = 20;
    },

    init:function()
    {
        var size = cc.winSize;

        // 显示旗杆
        this.drawNode = new cc.DrawNode();
        this.drawNode.drawSegment(cc.p(0, -size.height), cc.p(0, size.height), 5, cc.color(0,0,255));
        this.addChild(this.drawNode);

         // 显示圆和箭头
         this.circleNode = new cc.DrawNode();
         this.circleNode.drawCircle(cc.p(0, 0), this.radius, 360, 360, false, this.circleLen, cc.color(255,0,0));
         this.addChild(this.circleNode);

         this.arrowNode1 = new cc.DrawNode();
         this.arrowNode1.drawSegment(cc.p(0, this.radius * 0.7), cc.p(this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
         this.arrowNode1.setVisible(true);
         this.circleNode.addChild(this.arrowNode1);

         this.arrowNode2 = new cc.DrawNode();
         this.arrowNode2.drawSegment(cc.p(0, this.radius * 0.7), cc.p(-this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
         this.arrowNode2.setVisible(true);
         this.circleNode.addChild(this.arrowNode2);

         this.arrowNode3 = new cc.DrawNode();
         this.arrowNode3.drawSegment(cc.p(0, -this.radius * 0.7), cc.p(this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
         this.arrowNode3.setVisible(false);
         this.circleNode.addChild(this.arrowNode3);

         this.arrowNode4 = new cc.DrawNode();
         this.arrowNode4.drawSegment(cc.p(0, -this.radius * 0.7), cc.p(-this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
         this.arrowNode4.setVisible(false);
         this.circleNode.addChild(this.arrowNode4);
    },

    createTriangle:function()
    {
        // 加载大三角形图片
        for(var i = 0; i < this.triangleNum; i++)
        {
            var bigSprite = new cc.Sprite(res.Triangle_png);
            bigSprite.setPosition(this.getPosition());
            this.addChild(bigSprite);

            var rot = 3.14 * Math.random() * 360 / 180;

            var data = {
                sprite:bigSprite,
                speedX:this.speed * Math.sin(rot),
                speedY:this.speed * Math.cos(rot),
            }
            this.bigTriangle[i] = data;
        }

        // 加载小三角形图片
        for(var k = 0; k < this.triangleNum; k++)
        {
            var smallSprite = new cc.Sprite(res.Triangle_png);
            smallSprite.setScale(0.5);
            var x = this.getPositionX() + cc.winSize.height / (k + 1) * Math.sin(this.getRotation());
            var y = this.getPositionY() + cc.winSize.height / (k + 1) * Math.cos(this.getRotation());
            smallSprite.setPosition(cc.p(x, y));
            this.addChild(smallSprite);

            var rot = 3.14 * Math.random() * 360 / 180;

            var data = {
                sprite:smallSprite,
                speedX:this.speed * Math.sin(rot),
                speedY:this.speed * Math.cos(rot),
            }

            this.smallTriangle[i] = data;
        }

    },

    getRadius:function()
    {
        return this.radius;
    },

    showArrow:function(num)
    {
        // 显示箭头， 1是正方向， 2是反方向
        if (num == 1)
        {
            this.arrowNode1.setVisible(true);
            this.arrowNode2.setVisible(true);
            this.arrowNode3.setVisible(false);
            this.arrowNode4.setVisible(false);
        }
        else
        {
            this.arrowNode1.setVisible(false);
            this.arrowNode2.setVisible(false);
            this.arrowNode3.setVisible(true);
            this.arrowNode4.setVisible(true);
        }
    },

    // 更新三角形位置
    update:function(ts, isStart, isOver)
    {
        if(isOver)
        {

        }
        else
        {
            var angel = ts * this.revolutionSpeed;
            var rot = this.getRotation() + angel;
            this.setRotation(rot);
        }
    },

});