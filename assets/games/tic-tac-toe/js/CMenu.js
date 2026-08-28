function CMenu(){
    var _pStartPosAudio;
    var _pStartPosBut1;
    var _pStartPosBut2;
    var _pStartPosInfo;
    var _pStartPosFullscreen;
    var _pStartPosDelete;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _oBg;
    var _oBut1Player;
    var _oBut2Players;
    var _oAudioToggle;
    var _oButInfo;
    var _oFade;
    var _oButFullscreen;
    var _oCreditsPanel;
    var _oButDelete;
    var _oMsgBox;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
		
	_pStartPosBut1 = {x:(CANVAS_WIDTH/2),y:CANVAS_HEIGHT -340};
        var oSprite = s_oSpriteLibrary.getSprite('but_box_1');
        _oBut1Player = new CTextButton(_pStartPosBut1.x,_pStartPosBut1.y,oSprite,TEXT_BUT1PLAYER,FONT_GAME,"#ffffff",60,s_oStage);
        _oBut1Player.addEventListener(ON_MOUSE_UP, this._onBut1Player, this);

	_pStartPosBut2 = {x:(CANVAS_WIDTH/2),y:CANVAS_HEIGHT -150};
        _oBut2Players = new CTextButton(_pStartPosBut2.x,_pStartPosBut2.y,oSprite,TEXT_BUT2PLAYERS,FONT_GAME,"#ffffff",60,s_oStage);
        _oBut2Players.addEventListener(ON_MOUSE_UP, this._onBut2Players, this);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            var iX = CANVAS_WIDTH - (oSprite.width/4) -10;
            _pStartPosAudio = {x: iX, y: (oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10}; 
        _oButInfo = new CGfxButton(_pStartPosInfo.x,_pStartPosInfo.y,oSprite,s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onCredits, this);


        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosInfo.x + oSprite.width/2 + 10,y:_pStartPosInfo.y};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        if(s_oLocalStorage.isDirty()){
            var oSprite = s_oSpriteLibrary.getSprite('but_delete');
            _pStartPosDelete = {x: (oSprite.height/2) + 10, y: CANVAS_HEIGHT - (oSprite.height/2) - 10}; 
            _oButDelete = new CGfxButton(_pStartPosDelete.x,_pStartPosDelete.y,oSprite,s_oStage);
            _oButDelete.addEventListener(ON_MOUSE_UP, this._onDelete, this);
        }
        

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 500).call(function(){_oFade.visible = false;});  
		
	this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        if(!s_oLocalStorage.isUsed()){
            _oMsgBox = new CMsgBox(TEXT_IOS_PRIVATE);
        }
    };
    
    this.unload = function(){
        _oBut1Player.unload(); 
        _oBut1Player = null;
        _oButInfo.unload();
        
        _oCreditsPanel = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
    
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        if(s_oLocalStorage.isDirty()){
            _oButDelete.unload();
        }
        
        s_oStage.removeAllChildren();
	s_oMenu = null;
    };
	
    this.refreshButtonPos = function(iNewX,iNewY){
        _oBut1Player.setPosition(_pStartPosBut1.x, _pStartPosBut1.y - iNewY );
	_oBut2Players.setPosition(_pStartPosBut2.x,_pStartPosBut2.y - iNewY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
        _oButInfo.setPosition(_pStartPosInfo.x + iNewX,iNewY + _pStartPosInfo.y);
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        if(s_oLocalStorage.isDirty()){
            _oButDelete.setPosition(_pStartPosDelete.x + iNewX, _pStartPosDelete.y - iNewY );
        }
    };
    
    this._onBut1Player = function(){
        s_oMain.pokiShowCommercial(()=>{
            s_oMenu.unload();
            s_oMain.gotoGameModeMenu(false);

            $(s_oMain).trigger("start_session");
        });
    };

    this._onBut2Players = function(){
        s_oMain.pokiShowCommercial(()=>{
            s_oMenu.unload();
            s_oMain.gotoGameModeMenu(true);

            $(s_oMain).trigger("start_session");
        });
    };
    
    this._onCredits = function(){
        _oCreditsPanel = new CCreditsPanel();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
        }
        
        sizeHandler();
    };
    
    this._onDelete = function(){
        var oPanel = new CAreYouSurePanel(s_oMenu.deleteSavings);
        oPanel.changeMessage(TEXT_SAVE_REMOVE, 50);
    };
    
    this.deleteSavings = function(){
        s_oLocalStorage.deleteData();
        s_oLocalStorage.resetData();
        _oButDelete.unload();
    };
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;