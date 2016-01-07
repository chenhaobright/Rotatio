var BLOCK_DIRECT = {
    TOP:1,
    BOTTOM:2,
    LEFT:3,
    RIGHT:4,
    LEFT_TOP:5,
    RIGHT_BOTTOM:6,
    RIGHT_TOP:7,
    LEFT_BOTTOM:8,
}

var BlockNode = cc.Node.extend({
    _lineWidth: 1,
    _drawColor: null,
    ctor:function()
    {
        this._super();

        this.moveSpeed = 1300;       // 每秒前进多少像素

        this.passLen = cc.winSize.width / 8;     // 通过阻挡大门的长度

        this.passType = 0; // 只有-1，0， 1三种值，-1表示左边，0表示中间，1表示右边

        this.passDirect = 0; // 有8个方向：左、右、上、下、左上、左下、右上、右下

        this.passCount = 0; // 通过次数

        this.isFinish = true;

        this.blockLen = 5;    // 阻挡直线的宽度
        this.blockRadius = this.blockLen * 3; // 阻挡圆的半径

        // 生成斜边方向
        var edge = Math.sqrt(cc.winSize.height * cc.winSize.height + cc.winSize.width * cc.winSize.width);
        this.ratioX = cc.winSize.width / edge;
        this.ratioY = cc.winSize.height / edge;
    },

    init:function()
    {
        // 设置到屏幕外
        this.setPosition(-this.blockRadius, -this.blockRadius);

        // 阻挡节点1
        this.blockNode1 = new cc.Node();
        this.blockNode1.setPosition(-this.passLen, 0);
        this.addChild(this.blockNode1);

        // 绘制阻挡直线1
        this.blockLine1 = new cc.DrawNode();
        this.blockLine1.drawSegment(cc.p(-cc.winSize.width, 0), cc.p(-this.blockRadius - 4 ,0), this.blockLen, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockLine1);

        //绘制虚心圆1
        this.blockCircle1 = new cc.DrawNode();
        this.blockCircle1.drawCircle(cc.p(0,0), this.blockRadius, 360, 360, false, 4, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockCircle1);

        // 绘制实心圆1
        this.blockDot1 = new cc.DrawNode();
        this.blockDot1.drawDot(cc.p(0, 0), this.blockRadius / 2, cc.color(0, 255, 0));
        this.blockNode1.addChild(this.blockDot1);

        // 阻挡节点2
        this.blockNode2 = new cc.Node();
        this.blockNode2.setPosition(this.passLen, 0);
        this.addChild(this.blockNode2);

        // 绘制阻挡直线2
        this.blockLine2 = new cc.DrawNode();
        this.blockLine2.drawSegment(cc.p(this.blockRadius + 4, 0), cc.p(cc.winSize.width ,0), this.blockLen, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockLine2);

        //绘制虚心圆2
        this.blockCircle2 = new cc.DrawNode();
        this.blockCircle2.drawCircle(cc.p(0,0), this.blockRadius, 360, 360, false, 4, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockCircle2);

        // 绘制实心圆2
        this.blockDot2 = new cc.DrawNode();
        this.blockDot2.drawDot(cc.p(0, 0), this.blockRadius / 2, cc.color(0, 255, 0));
        this.blockNode2.addChild(this.blockDot2);
    },

    // 重新更新阻挡块位置
    updateBlockNode:function(ts)
    {
        var size = cc.winSize;

        // 生成阻挡块的方向
        var randomMax = Math.min(Math.ceil(this.passCount / 5) * 2, 8);
        this.passDirect = Math.floor(Math.random() * randomMax + 1);

        var angle = Math.atan(this.ratioX / this.ratioY) * 180 / 3.14;

        switch (this.passDirect)
        {
            case BLOCK_DIRECT.TOP:
                this.setPosition(size.width / 2, size.height + this.blockRadius);
                this.setRotation(0);
                break;

            case BLOCK_DIRECT.BOTTOM:
                this.setPosition(size.width / 2, 0 - this.blockRadius);
                this.setRotation(0);
                break;

            case BLOCK_DIRECT.LEFT:
                this.setPosition(0 - this.blockRadius, size.height / 2);
                this.setRotation(90);
                break;

            case BLOCK_DIRECT.RIGHT:
                this.setPosition(size.width + this.blockRadius, size.height / 2);
                this.setRotation(90);
                break;

            case BLOCK_DIRECT.LEFT_TOP:
                this.setPosition(0, size.height);
                this.setRotation(-angle);
                break;

            case BLOCK_DIRECT.RIGHT_BOTTOM:
                this.setPosition(size.width, 0);
                this.setRotation(-angle);
                break;

            case BLOCK_DIRECT.RIGHT_TOP:
                this.setPosition(size.width, size.height);
                this.setRotation(angle);
                break;

            case BLOCK_DIRECT.LEFT_BOTTOM:
                this.setPosition(0, 0);
                this.setRotation(angle);
                break;

            default:
                cc.log("生成方向出错1")
        }

        if (this.passDirect <= 4)
        {
            this.passType = Math.floor(Math.random() * 100) % 3 - 1;
        }
        else
        {
            this.passType = 0;
        }

        cc.log(angle, this.passType);

        this.setPositionX(this.getPositionX() + this.passType * this.passLen);

        this.isFinish = false;
        this.passCount = this.passCount + 1;
    },

    update:function(ts)
    {
        if (this.isFinish)
        {
            this.updateBlockNode(ts);
        }

        var dis = this.moveSpeed * ts * 0.5;
        switch (this.passDirect)
        {
            case BLOCK_DIRECT.TOP:
                var posY = this.getPositionY() - dis;
                this.setPositionY(posY);

                if (posY + this.blockRadius <= 0) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.BOTTOM:
                var posY = this.getPositionY() + dis;
                this.setPositionY(posY);

                if (posY - this.blockRadius >= cc.winSize.height) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.LEFT:
                var posX = this.getPositionX() + dis;
                this.setPositionX(posX);

                if (posX - this.blockRadius >= cc.winSize.width) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.RIGHT:
                var posX = this.getPositionX() - dis;
                this.setPositionX(posX);

                if (posX + this.blockRadius <= 0) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.LEFT_TOP:
                var posX = this.getPositionX() + dis * this.ratioX;
                var posY = this.getPositionY() - dis * this.ratioY;
                this.setPosition(posX, posY);

                if (posX >= cc.winSize.width && posY <= 0) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.RIGHT_BOTTOM:
                var posX = this.getPositionX() - dis * this.ratioX;
                var posY = this.getPositionY() + dis * this.ratioY;
                this.setPosition(posX, posY);

                if (posX <= 0 && posY >= cc.winSize.height) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.RIGHT_TOP:
                var posX = this.getPositionX() - dis * this.ratioX;
                var posY = this.getPositionY() - dis * this.ratioY;
                this.setPosition(posX, posY);

                if (posX <= 0 && posY <= 0) {this.isFinish = true;}
                break;

            case BLOCK_DIRECT.LEFT_BOTTOM:
                var posX = this.getPositionX() + dis * this.ratioX;
                var posY = this.getPositionY() + dis * this.ratioY;
                this.setPosition(posX, posY);

                if (posX >= cc.winSize.width && posY >= cc.winSize.height) {this.isFinish = true;}
                break;

            default:
                cc.log("生成方向出错2")
        }


    },

});