// ========
// MAINLOOP
// ========

// The mainloop is one big object with a fairly small public interface
// (e.g. init, iter, gameOver), and a bunch of private internal helper methods.
//
// The "private" members are identified as such purely by the naming convention
// of having them begin with a leading underscore. A more robust form of privacy,
// with genuine name-hiding *is* possible in JavaScript (via closures), but I 
// haven't adopted it here.
//
var g_main = {
    
    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms : null,
    _frameTimeDelta_ms : null,

};

// Perform one iteration of the mainloop
g_main.iter = function (frameTime) {
    
    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);
    
    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);
    
    // Diagnostics, such as showing current timer values etc.
    this._debugRender(g_ctx);
    
    // Request the next iteration if needed
    if (!this._isGameOver) this._requestNextIteration();
};

g_main._updateClocks = function (frameTime) {
    
    // First-time initialisation
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    
    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

g_main._iterCore = function (dt) {
    
    // Handle QUIT
    if (requestedQuit()) {
        this.gameOver();
        return;
    }
    
    gatherInputs();
    update(dt);
    render(g_ctx);
};

g_main._isGameOver = false;

g_main.gameOver = function () {
    this._isGameOver = true;
    console.log("gameOver: quitting...");
   
};

// Simple voluntary quit mechanism
//
var KEY_QUIT = 'Q'.charCodeAt(0);
function requestedQuit() {
    return g_keys[KEY_QUIT];
}

// Annoying shim for cross-browser compat
window.requestAnimationFrame = 
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    g_main.iter(frameTime);
}

g_main._requestNextIteration = function () {
    window.requestAnimationFrame(mainIterFrame);
};

// Mainloop-level debug-rendering

var TOGGLE_TIMER_SHOW = 'T'.charCodeAt(0);

g_main._doTimerShow = false;

g_main._debugRender = function (ctx) {
    
    if (eatKey(TOGGLE_TIMER_SHOW)) this._doTimerShow = !this._doTimerShow;
    
    if (!this._doTimerShow) return;
    
    var y = 350;
    ctx.fillText('FT ' + this._frameTime_ms, 50, y+10);
    ctx.fillText('FD ' + this._frameTimeDelta_ms, 50, y+20);
    ctx.fillText('UU ' + g_prevUpdateDu, 50, y+30); 
    ctx.fillText('FrameSync ON', 50, y+40);
};

g_main.init = function () {
    
    // Grabbing focus is good, but it sometimes screws up jsfiddle,
    // so it's a risky option during "development"
    //
    //window.focus(true);

    this._requestNextIteration();
};