function CRollingText(oScoreText, iScore, iTime, bFormatTime) {

    var _oTweenText = null;

    var _oValue;

    this._init = function (oScoreText, iScore, iTime) {

        _oValue = {value: oScoreText.text};

        _oTweenText = createjs.Tween.get(_oValue, {override: true}).to({value: iScore}, iTime, createjs.Ease.sineOut).addEventListener("change", function () {
            if(!bFormatTime){
                oScoreText.text = Math.floor(_oValue.value);
            } else {
                oScoreText.text = formatTime(_oValue.value);
            }
            
        }).call(function () {
            createjs.Tween.removeTweens(_oTweenText);
        });
    };

    this.addValueAnimation = function(iX, iY, oContainer, iValueToShow){
        var oValueText = new createjs.Text("+"+iValueToShow, "70px " + FONT_GAME, "#FFFFFF");
        oValueText.x = oScoreText.x;
        oValueText.y = oScoreText.y;
        oValueText.textBaseline = "middle";
        oValueText.textAlign = "left";
        oContainer.addChild(oValueText);
        
        createjs.Tween.get(oValueText).to({y: - 100}, 1000, createjs.Ease.sineOut);
        createjs.Tween.get(oValueText).wait(600).to({alpha: 0}, 900);
    };

    this._init(oScoreText, iScore, iTime);

    return this;
}