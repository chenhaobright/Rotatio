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

        this.moveSpeed = 300;       // 每秒前进多少像素

        this.passLen = cc.winSize.width / 8;     // 通过阻挡大门的长度

        this.passType = 0; // 只有-1，0， 1三种值，-1表示左边，0表示中间，1表示右边

        this.passDirect = 0; // 有8个方向：左、右、上、下、左上、左下、右上、右下

        this.passCount = 0; // 通过次数
        this.isFinish = true;
        this.isPass = false;
        this.isCollision = false;

        this.blockLen = 4;    // 阻挡直线的宽度
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

    getIsFinish:function()
    {
        return this.isFinish;
    },

    getIsPass:function()
    {
        return this.isPass;
    },

    getPassCount:function()
    {
        return this.passCount;
    },

    getIsCollision:function()
    {
        return this.isCollision;
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

        if (this.passDirect <= 4) {
            this.passType = Math.floor(Math.random() * 100) % 3 - 1;
        }
        else {
            this.passType = 0;
        }
        this.setPositionX(this.getPositionX() + this.passType * 1.5 * this.passLen);

        this.isFinish = false;
        this.isPass = false;
        this.isCollision = false;
    },

    update:function(ts, pos, rad)
    {
        if (this.isFinish) {
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

        this.checkCollision(pos, rad);
        this.checkPass(pos, rad);
    },

    // 检测输入圆是否碰撞
    checkCollision:function(pos, rad)
    {
        var hudu = -3.14 * this.getRotation() / 180;

        // 1, 是否和两个阻挡圆碰撞
        var cirPos1 = cc.p(0, 0);
        var cirPos2 = cc.p(0, 0);

        cirPos1.x = this.getPositionX() + this.blockNode1.getPositionX() * Math.cos(hudu);
        cirPos1.y = this.getPositionY() + this.blockNode1.getPositionX() * Math.sin(hudu);
        cirPos2.x = this.getPositionX() + this.blockNode2.getPositionX() * Math.cos(hudu);
        cirPos2.y = this.getPositionY() + this.blockNode2.getPositionX() * Math.sin(hudu);

        // 判断两圆是否相交
        if(this.square(pos.x - cirPos1.x) + this.square(pos.y - cirPos1.y) <= this.square(rad + this.blockRadius) ||
            this.square(pos.x - cirPos2.x) + this.square(pos.y - cirPos2.y) <= this.square(rad + this.blockRadius))
        {
            //cc.log("和圆碰撞");
            this.isCollision = true;
            return;
        }

        // 2，是否和矩形框碰撞
        var linePos = this.getPosition();
        var rot = this.getRotation();
        // 点到直线的距离
        var lineD = this.getPointToLineDistance(pos, linePos, rot);

        // 点到点的距离
        var circleD = Math.sqrt(this.square(pos.x - linePos.x) + this.square(pos.y - linePos.y));

        // 当检测点不在通过区,并用到直线距离小于时,碰撞成功
        if (lineD <= this.blockLen + rad && circleD >= this.passLen - this.blockRadius)
        {
            //cc.log("和矩形框碰撞");
            this.isCollision = true;
        }

    },

    // 检测是否通过障碍物
    checkPass:function(pos, rad)
    {
        if(this.isPass || this.isCollision) {return;}

        var blockPos = this.getPosition();

        switch (this.passDirect)
        {
            case BLOCK_DIRECT.TOP:
                if (pos.y > blockPos.y) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.BOTTOM:
                if (pos.y < blockPos.y) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.LEFT:
                if (pos.x < blockPos.x) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.RIGHT:
                if (pos.x > blockPos.x) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.LEFT_TOP:
                if (pos.x < blockPos.x && pos.y > blockPos.y) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.RIGHT_BOTTOM:
                if (pos.x > blockPos.x && pos.y < blockPos.y) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.RIGHT_TOP:
                if (pos.x > blockPos.x && pos.y > blockPos.y) {this.isPass = true;}
                break;

            case BLOCK_DIRECT.LEFT_BOTTOM:
                if (pos.x < blockPos.x && pos.y < blockPos.y) {this.isPass = true;}
                break;

            default:
                cc.log("生成方向出错2")
        }

        if(this.isPass)
        {
            this.passCount = this.passCount + 1;
            if(this.passCount == 10)
            {
                cc.log("speed up");
                this.moveSpeed = this.moveSpeed * 1.2;    // 提速10%
            }
            else if(this.passCount == 20)
            {
                cc.log("blink start ");
                this.runAction(cc.repeatForever(cc.blink(1, 1)));            // 开启闪烁功能;
            }

            cc.log("通过次数：", this.passCount);
        }
    },

    square:function(value)
    {
        return value * value;
    },

    // 得到点到直线的距离, 直线用一个点和旋转角度表示
    getPointToLineDistance:function(cirPos, linePos, rotation)
    {
        if (rotation == 90)
        {
            return Math.abs(cirPos.x - linePos.x);
        }
        else
        {
            // 由直线方程 y = kx + b 得到
            rotation = rotation * -1;
            var k = Math.tan(3.14 * rotation / 180);
            var b = linePos.y - k * linePos.x;

            // 由直线方程 Ax + By + C = 0 得到
            var A = k;
            var B = -1;
            var C = b;

            // 由点到直线距离为: (ax + by + c) / sqrt(a * a + b * b)
            var d = (k * cirPos.x + -1 * cirPos.y + C) / Math.sqrt(A * A + B * B);
            d = Math.abs(d);

            return d;
        }
    }

});