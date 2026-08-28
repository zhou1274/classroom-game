(() => {
  const noop = () => {};
  const ok = () => Promise.resolve();
  window.PokiSDK = {
    init: ok,
    initWithVideoHB: ok,
    customEvent: noop,
    commercialBreak: ok,
    rewardedBreak: () => Promise.resolve(false),
    displayAd: noop,
    destroyAd: noop,
    getLeaderboard: () => Promise.resolve({}),
    getSharableURL: () => Promise.resolve(""),
    getURLParam: () => "",
    disableProgrammatic: noop,
    gameLoadingStart: noop,
    gameLoadingFinished: noop,
    gameInteractive: noop,
    roundStart: noop,
    roundEnd: noop,
    muteAd: noop,
    setDebug: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    gameLoadingProgress: noop,
    happyTime: noop,
    setPlayerAge: noop,
    togglePlayerAdvertisingConsent: noop,
    logError: noop,
    sendHighscore: noop,
    setDebugTouchOverlayController: noop,
    isAdBlocked: () => false
  };
})();
