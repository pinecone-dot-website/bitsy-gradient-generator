"use strict";

/**
 *  returns an array of startColor, colors between according to steps, and endColor
 *  @param string hex color
 *  @param string hex color
 *  @param int
 *  @return 
 */
function getGradient( startColor, endColor, steps ) {
    var gradient = [];

    var startColorRgb = hexToRgb( startColor );
    var endColorRgb = hexToRgb( endColor );

    ramp.push( [ startColorRgb.r, startColorRgb.g, startColorRgb.b ] );

    var rInc = Math.round( ( endColorRgb.r - startColorRgb.r ) / ( steps + 1 ) );
    var gInc = Math.round( ( endColorRgb.g - startColorRgb.g ) / ( steps + 1 ) );
    var bInc = Math.round( ( endColorRgb.b - startColorRgb.b ) / ( steps + 1 ) );

    for ( var i = 0; i < steps; i++ ) {
        startColorRgb.r += rInc;
        startColorRgb.g += gInc;
        startColorRgb.b += bInc;

        ramp.push( [ startColorRgb.r, startColorRgb.g, startColorRgb.b ] );
    }

    ramp.push( [ endColorRgb.r, endColorRgb.g, endColorRgb.b ] );
    console.log( 'ramp', ramp );

    return ramp;
}

