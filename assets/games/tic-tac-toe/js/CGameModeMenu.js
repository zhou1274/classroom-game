function CGameModeMenu(){

    var _oBg;
    var _oSprite3x3;
    var _oSprite5x5;
    var _oSprite7x7;
    var _oFade;
    var _oScoreContainer;
    
    var _pStartPosScore;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mode_menu'));
        s_oStage.addChild(_oBg);
	
        var oChooseText = createBitmap(s_oSpriteLibrary.getSprite('choose_text'));
        oChooseText.x = 40;
        oChooseText.y = 240;
        s_oStage.addChild(oChooseText);
	
	var oSprite = s_oSpriteLibrary.getSprite('but_3x3');
        _oSprite3x3 = createBitmap(oSprite);
        _oSprite3x3.regX = oSprite.width/2;
        _oSprite3x3.regY = oSprite.height/2;
        _oSprite3x3.x = (CANVAS_WIDTH/2);
        _oSprite3x3.y = 580;
        _oSprite3x3.cursor = "pointer";
        s_oStage.addChild(_oSprite3x3);
        _oSprite3x3.on("click", function(){
        playSound("press_but", 1, false);
            this._onBut3x3();
        },this);

        var oSprite = s_oSpriteLibrary.getSprite('but_5x5');
        _oSprite5x5 = createBitmap(oSprite);
        _oSprite5x5.regX = oSprite.width/2;
        _oSprite5x5.regY = oSprite.height/2;
        _oSprite5x5.x = (CANVAS_WIDTH/2);
        _oSprite5x5.y = 940;
        _oSprite5x5.cursor = "pointer";
        s_oStage.addChild(_oSprite5x5);
        _oSprite5x5.on("click", function(){
            playSound("press_but", 1, false);
            this._onBut5x5();
        },this);

        var oSprite = s_oSpriteLibrary.getSprite('but_7x7');
        _oSprite7x7 = createBitmap(oSprite);
        _oSprite7x7.regX = oSprite.width/2;
        _oSprite7x7.regY = oSprite.height/2;
        _oSprite7x7.x = (CANVAS_WIDTH/2);
        _oSprite7x7.y = 1300;
        _oSprite7x7.cursor = "pointer";
        s_oStage.addChild(_oSprite7x7);
        _oSprite7x7.on("click", function(){
            playSound("press_but", 1, false);
            this._onBut7x7();
        },this);
        
        if(!s_bTwoPlayerMode){
            var oSprite = s_oSpriteLibrary.getSprite('star_blue');
            _pStartPosScore = {x: oSprite.width/2 + 10, y: CANVAS_HEIGHT - oSprite.height/2 - 10};
            _oScoreContainer = new createjs.Container();
            _oScoreContainer.x = _pStartPosScore.x;
            _oScoreContainer.y = _pStartPosScore.y;
            s_oStage.addChild(_oScoreContainer);

            var oStar = createBitmap(oSprite);
            oStar.regX = oSprite.width/2;
            oStar.regY = oSprite.height/2;
            _oScoreContainer.addChild(oStar);

            var oScoreText = new createjs.Text(s_iTotalScore, "70px " + FONT_GAME, "#008df0");
            oScoreText.x = oSprite.width/2 +10;
            oScoreText.y = 0;
            oScoreText.textBaseline = "middle";
            oScoreText.textAlign = "left";
            _oScoreContainer.addChild(oScoreText);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 500).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oSprite3x3.removeAllEventListeners();
        _oSprite5x5.removeAllEventListeners();
        _oSprite7x7.removeAllEventListeners();
        
        s_oStage.removeAllChildren();
        s_oModeMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(!s_bTwoPlayerMode){
            _oScoreContainer.x = _pStartPosScore.x + iNewX;
            _oScoreContainer.y = _pStartPosScore.y - iNewY;
        }
        
    };
    
    this._onBut3x3 = function(){
        this.unload();

        s_oMain.gotoGame(3);
    };

    this._onBut5x5 = function(){
        this.unload();
        
        s_oMain.gotoGame(5);
    };

    this._onBut7x7 = function(){
        this.unload();

        s_oMain.gotoGame(7);
    };
    
    s_oModeMenu = this;
    
    this._init();
}

var s_oModeMenu = null;