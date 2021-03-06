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
    update:function(ts, parent)
    {
        var isStart = parent.isStart;
        var isOver = parent.isOver;

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