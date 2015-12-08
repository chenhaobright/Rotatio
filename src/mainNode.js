var MainNode = cc.Node.extend({
    _lineWidth: 1,
    _drawColor: null,
    ctor:function()
    {
        this._super();

        this.radius = 30;

        // 每秒旋转多少度
        this.deltaAngel = 36;

        // 当前移动了多少像素
        this.moveDis = 0;

        // 每秒前进多少像素
        this.moveSpeed = 300;
    },

    init:function()
    {
        var size = cc.winSize;

        // 显示旗杆
        this.drawNode = new cc.DrawNode();
        this.drawNode.drawSegment(cc.p(0, -size.height/2), cc.p(0, size.height/2), 10, cc.color(0,0,255));
        this.addChild(this.drawNode);

        // 显示圆和箭头
        this.circleNode = new cc.DrawNode();
        this.circleNode.drawCircle(cc.p(0, 0), this.radius, 360, 360, false, 5, cc.color(255,0,0));
        this.addChild(this.circleNode);

        this.arrowNode1 = new cc.DrawNode();
        this.arrowNode1.drawSegment(cc.p(0, this.radius * 0.7), cc.p(this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
        this.circleNode.addChild(this.arrowNode1);

        this.arrowNode2 = new cc.DrawNode();
        this.arrowNode2.drawSegment(cc.p(0, this.radius * 0.7), cc.p(-this.radius * 0.7, 0), 2, cc.color(255, 0, 0));
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

    update:function(ts, isStart, isLongPress)
    {
        var angel = ts * this.deltaAngel;
        this.setRotation(this.getRotation() + angel);

        if (isStart)
        {
            if (isLongPress)
            {
                this.moveDis = this.moveDis - this.moveSpeed * ts;
                this.showArrow(2);
            }
            else
            {
                this.moveDis = this.moveDis + this.moveSpeed * ts;
                this.showArrow(1)
            }

            this.circleNode.setPositionY(this.moveDis);
        }
    },
});