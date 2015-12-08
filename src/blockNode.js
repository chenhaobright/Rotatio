var BlockNode = cc.Node.extend({
    _lineWidth: 1,
    _drawColor: null,
    ctor:function()
    {
        this._super();
        this.radius = 30;
    },

    init:function()
    {
        // 阻挡节点1
        this.blockNode1 = new cc.Node();
        this.blockNode1.setPosition(-cc.winSize.width / 4, 0);
        this.addChild(this.blockNode1);

        // 绘制阻挡直线1
        this.blockLine1 = new cc.DrawNode();
        this.blockLine1.drawSegment(cc.p(-cc.winSize.width/2, 0), cc.p(-this.radius ,0), 10, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockLine1);

        //绘制虚心圆1
        this.blockCircle1 = new cc.DrawNode();
        this.blockCircle1.drawCircle(cc.p(0,0), this.radius * 0.8, 360, 360, false, 4, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockCircle1);

        // 绘制实心圆1
        this.blockDot1 = new cc.DrawNode();
        this.blockDot1.drawDot(cc.p(0, 0), 15, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockDot1);

        // 阻挡节点2
        this.blockNode2 = new cc.Node();
        this.blockNode2.setPosition(cc.winSize.width / 4, 0);
        this.addChild(this.blockNode2);

        // 绘制阻挡直线2
        this.blockLine2 = new cc.DrawNode();
        this.blockLine2.drawSegment(cc.p(this.radius, 0), cc.p(cc.winSize.width ,0), 10, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockLine2);

        //绘制虚心圆2
        this.blockCircle2 = new cc.DrawNode();
        this.blockCircle2.drawCircle(cc.p(0,0), this.radius * 0.8, 360, 360, false, 4, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockCircle2);

        // 绘制实心圆2
        this.blockDot2 = new cc.DrawNode();
        this.blockDot2.drawDot(cc.p(0, 0), 15, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockDot2);
    },

});