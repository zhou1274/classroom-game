function CAreYouSurePanel(oConfirmFunction, oNegateFunction) {

    var _oTitle;
    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;

    this._init = function (oConfirmFunction, oNegateFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box_small');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.cubicOut);

        _oTitle = new createjs.Text(TEXT_ARE_SURE," 50px "+FONT_GAME, "#ffffff");
        _oTitle.y = -oSprite.height/2 + 120;
        _oTitle.textAlign = "center";
        _oTitle.textBaseline = "middle";
        _oTitle.lineWidth = 800;
        _oPanelContainer.addChild(_oTitle);

        _oButYes = new CGfxButton(110, 160, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-110, 160, s_oSpriteLibrary.getSprite('but_exit'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        _oButNo.pulseAnimation();
    };

    this._onButYes = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            if(oConfirmFunction){
                oConfirmFunction();
            }

        }); 
    };

    this._onButNo = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            if(oNegateFunction){
                oNegateFunction();
            }
        }); 
    };

    this.changeMessage = function(szText, iFontSize){
        _oTitle.text = szText;
        
        if(iFontSize){
            _oTitle.font = " "+iFontSize +"px "+FONT_GAME;
        }
    };

    this.setMessageY = function(iY){
        _oTitle.y = iY;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.off("mousedown",function(){});
    };

    _oParent = this;
    this._init(oConfirmFunction, oNegateFunction);
}

