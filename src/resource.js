var res = {
    HelloWorld_png : "res/HelloWorld.png",
    MainScene_json : "res/MainScene.json",
    Triangle_png   : "res/triangle.png",
    PassCount_ogg  : "res/pass_count.ogg",
    Over_ogg       : "res/over.ogg",
    Start_ogg      : "res/start.ogg"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
