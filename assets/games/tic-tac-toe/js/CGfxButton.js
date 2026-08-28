function CGfxButton(iXPos,iYPos,oSprite, oParentContainer){
    var _bDisable;
    var _iScale;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oButton;
    var _oParent;
    var _oTween;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    
    this._init =function(iXPos,iYPos,oSprite, oParentContainer){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _iScale = 1;
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        _oButton = createBitmap( oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oButton.cursor = "pointer";
        oParentContainer.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerMouseDown);
       _oButton.off("pressup" , _oListenerMouseUp); 
       
       oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("press_but",1,false);
        if(!_oTween){
            _oButton.scaleX = _iScale;
            _oButton.scaleY = _iScale;
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        if(!_oTween){
            _oButton.scaleX = 0.9*_iScale;
            _oButton.scaleY = 0.9*_iScale;
        }
        

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };

    this.enable = function(){
        _bDisable = false;
        
        _oButton.filters = [];

        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
        
        var matrix = new createjs.ColorMatrix().adjustSaturation(-100).adjustBrightness(40);
        _oButton.filters = [
                 new createjs.ColorMatrixFilter(matrix)
        ];
        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    this.pulseAnimation = function () {
        _oTween = createjs.Tween.get(_oButton).to({scaleX: _iScale*1.1, scaleY: _iScale*1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScale, scaleY: _iScale}, 650, createjs.Ease.quadIn).call(function () {
            _oParent.pulseAnimation();
        });
    };
    
    this.setClickable = function(){
        _bDisable = true;
    };
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iXPos,iYPos,oSprite, oParentContainer);
    
    _oParent = this;
    return this;
}