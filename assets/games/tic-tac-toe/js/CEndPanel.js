function CEndPanel(iWinner){

    var _oSprPanel;
    var _oButReplay;
    var _oBackPanel;
    var _oFade;
    var _oScoreContainer;
    var _oListener;
    var _oHeaderContainer;
    
    this._init = function(iWinner){
        
        _oBackPanel = new createjs.Shape();
        _oBackPanel.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oBackPanel.alpha = 0.7;
        _oListener = _oBackPanel.on("click", function(){});
        s_oStage.addChild(_oBackPanel);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oSprPanel = createBitmap(oSprite);
        _oSprPanel.regX = oSprite.width/2;
        _oSprPanel.regY = oSprite.height/2;
        _oSprPanel.x = CANVAS_WIDTH/2;
        _oSprPanel.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oSprPanel);

        _oHeaderContainer = new createjs.Container();
        _oHeaderContainer.x = CANVAS_WIDTH/2;
        _oHeaderContainer.y = (CANVAS_HEIGHT/2) - 320;
        s_oStage.addChild(_oHeaderContainer);

        var oSprWinner = createBitmap(s_oSpriteLibrary.getSprite('tokenX'));
        var oTextWin = new createjs.Text(TEXT_PL1_VICTORY, "100px "+FONT_GAME, "White");
        oTextWin.textBaseline = "alphabetic";
        oTextWin.textAlign = "center";
        _oHeaderContainer.addChild(oSprWinner);
        _oHeaderContainer.addChild(oTextWin);
        
        var iPointsEarned;
        switch(iWinner){
            case X_WINS:{
                    oTextWin.text = TEXT_PL1_VICTORY;
                    oTextWin.x = 70;
                    
                    oSprWinner.image = s_oSpriteLibrary.getSprite('tokenX');
                    oSprWinner.x = -390;
                    oSprWinner.y = -90;
                    
                    iPointsEarned = POINTS_EARNED.win;
                    break;
            }
            case O_WINS:{
                    oTextWin.text = TEXT_PL2_VICTORY;
                    oTextWin.x = 70;
                    
                    oSprWinner.image = s_oSpriteLibrary.getSprite('tokenO');
                    oSprWinner.x = -390;
                    oSprWinner.y = -90;
                    
                    iPointsEarned = POINTS_EARNED.lose;
                    break;
            }
            case DRAW:{
                    oTextWin.text = TEXT_DRAW;
                    
                    _oHeaderContainer.removeChild(oSprWinner);
                    
                    iPointsEarned = POINTS_EARNED.draw;
                    break;
            }
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_box_2');
        _oButReplay = new CTextButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 340,oSprite,TEXT_PLAYAGAIN,FONT_GAME,"#008df0",60,s_oStage);
        _oButReplay.addEventListener(ON_MOUSE_UP, this._onButPlayAgain, this);

        if(s_bTwoPlayerMode){
            var oSprite = s_oSpriteLibrary.getSprite('msg_box_small');
            _oSprPanel.image = oSprite;
            _oSprPanel.regX = oSprite.width/2;
            _oSprPanel.regY = oSprite.height/2;
            
            _oHeaderContainer.y = (CANVAS_HEIGHT/2) - 180;

            _oButReplay.setPosition(_oButReplay.getX(), CANVAS_HEIGHT/2 + 200);
        } else {
            var oSprite = s_oSpriteLibrary.getSprite('star_white');
            _oScoreContainer = new createjs.Container();
            _oScoreContainer.x = CANVAS_WIDTH/2 - 50;
            _oScoreContainer.y = CANVAS_HEIGHT/2 + 20;
            s_oStage.addChild(_oScoreContainer);

            var oStar = createBitmap(oSprite);
            oStar.regX = oSprite.width/2;
            oStar.regY = oSprite.height/2;
            _oScoreContainer.addChild(oStar);

            

            var oScoreText = new createjs.Text(s_iTotalScore, "70px " + FONT_GAME, "#FFFFFF");
            oScoreText.x = oSprite.width/2 +10;
            oScoreText.y = 0;
            oScoreText.textBaseline = "middle";
            oScoreText.textAlign = "left";
            _oScoreContainer.addChild(oScoreText);

            var iNewScore = iPointsEarned + s_iTotalScore;

            var oRolling = new CRollingText(oScoreText, iNewScore, 1000, false);
            oRolling.addValueAnimation(0, 0, _oScoreContainer, iPointsEarned);
            
            s_iTotalScore += iPointsEarned;
            
            s_oLocalStorage.saveData();
            
            $(s_oMain).trigger("save_score", s_iTotalScore);
            $(s_oMain).trigger("share_event", s_iTotalScore);
        }


        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
		
        $(s_oMain).trigger("end_game",[iWinner]);
        
		
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){
            _oFade.visible = false;
        });  
    };
    
    this.unload = function(){
        _oButReplay.unload(); 
        _oButReplay = null;
        
        $(s_oMain).trigger("show_interlevel_ad");
        _oBackPanel.off("click", _oListener);
        
        s_oStage.removeChild(_oHeaderContainer);
        s_oStage.removeChild(_oSprPanel);
        s_oStage.removeChild(_oScoreContainer);
        s_oStage.removeChild(_oFade);
    };
    
    this._onButPlayAgain = function(){
        this.unload();
        s_oGame.unload();
    };
    
    this._init(iWinner);
}