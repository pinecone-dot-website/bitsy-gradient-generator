"use strict";

let palette = require( './palette.js' );

let code = document.querySelector( '#output-code' ),
    controls = document.querySelector( '.controls' ),
    submit = document.querySelector( '#generate' );

let inputs = [];

// setup color inputs
document.querySelectorAll( '.color-group' ).forEach( ( el, i ) => {
    inputs[ i ] = new palette( el );
} )

// output code
let block = `<div class="palette-block"><span class="title">PAL <%= i %></span><span 
class="color" style="background-color:#<%= generated[0].hex %>"><%= generated[0].display %></span><span 
class="color" style="background-color:#<%= generated[1].hex %>"><%= generated[1].display %></span><span 
class="color" style="background-color:#<%= generated[2].hex %>"><%= generated[2].display %></span>

</div>`

submit.addEventListener( 'submit', ( e ) => {
    let html = '',
        range = controls.querySelectorAll( 'input' );

    e.preventDefault();

    for ( let i = range[ 0 ].value; i <= range[ 1 ].value; i++ ) {
        let percent = ( i - range[ 0 ].value ) / ( range[ 1 ].value - range[ 0 ].value );

        let generated = inputs[ 0 ].colors.map( ( el, i ) => {
            let g = gradient( hexToRgb( el ),
                hexToRgb( inputs[ 1 ].colors[ i ] ),
                percent );

            let color = {
                display: hexToRgb( g ),
                hex: g
            }

            return color;
        } );

        html += tmpl( block, {
            generated: generated,
            i: i
        } );
    }

    code.innerHTML = html;
} );

function gradient( rgb_start, rgb_end, percent = .5 ) {
    let cmyk_vals = [
        RGBtoCMYK( rgb_start ),
        RGBtoCMYK( rgb_end )
    ];

    let new_cmyk = [
        Math.round( ( cmyk_vals[ 0 ][ 0 ] * ( 1 - percent ) ) + ( cmyk_vals[ 1 ][ 0 ] * ( percent ) ) ),
        Math.round( ( cmyk_vals[ 0 ][ 1 ] * ( 1 - percent ) ) + ( cmyk_vals[ 1 ][ 1 ] * ( percent ) ) ),
        Math.round( ( cmyk_vals[ 0 ][ 2 ] * ( 1 - percent ) ) + ( cmyk_vals[ 1 ][ 2 ] * ( percent ) ) ),
        Math.round( ( cmyk_vals[ 0 ][ 3 ] * ( 1 - percent ) ) + ( cmyk_vals[ 1 ][ 3 ] * ( percent ) ) )
    ];

    let new_rgb = CMYKtoRGB( new_cmyk );
    new_rgb = rgbToHex( new_rgb );

    return new_rgb;
}

// based off https://johnresig.com/blog/javascript-micro-templating/
function tmpl( str, data ) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = new Function( "obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
        .replace( /[\r\t\n]/g, " " )
        .split( "<%" ).join( "\t" )
        .replace( /((^|%>)[^\t]*)'/g, "$1\r" )
        .replace( /\t=(.*?)%>/g, "',$1,'" )
        .split( "\t" ).join( "');" )
        .split( "%>" ).join( "p.push('" )
        .split( "\r" ).join( "\\'" ) +
        "');}return p.join('');" );

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
};

/**
 * 
 * @param string hex 
 * @return array
 */
function hexToRgb( hex ) {
    let parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

    let result = parsed ? [
        parseInt( parsed[ 1 ], 16 ),
        parseInt( parsed[ 2 ], 16 ),
        parseInt( parsed[ 3 ], 16 )
    ] : [];

    return result;
}

/**
 * 
 * @param object RGB 
 * @return array
 */
function RGBtoCMYK( RGB ) {
    let result = [];

    let r = RGB[ 0 ] / 255;
    let g = RGB[ 1 ] / 255;
    let b = RGB[ 2 ] / 255;

    result[ 3 ] = Math.min( 1 - r, 1 - g, 1 - b );
    result[ 0 ] = ( 1 - r - result[ 3 ] ) / ( 1 - result[ 3 ] );
    result[ 1 ] = ( 1 - g - result[ 3 ] ) / ( 1 - result[ 3 ] );
    result[ 2 ] = ( 1 - b - result[ 3 ] ) / ( 1 - result[ 3 ] );

    result[ 0 ] = Math.round( result[ 0 ] * 100 );
    result[ 1 ] = Math.round( result[ 1 ] * 100 );
    result[ 2 ] = Math.round( result[ 2 ] * 100 );
    result[ 3 ] = Math.round( result[ 3 ] * 100 );

    return result;
}

/**
 * 
 * @param array CMYK 
 * @return array
 */
function CMYKtoRGB( CMYK ) {
    let result = [];

    let c = CMYK[ 0 ] / 100;
    let m = CMYK[ 1 ] / 100;
    let y = CMYK[ 2 ] / 100;
    let k = CMYK[ 3 ] / 100;

    result[ 0 ] = 1 - Math.min( 1, c * ( 1 - k ) + k );
    result[ 1 ] = 1 - Math.min( 1, m * ( 1 - k ) + k );
    result[ 2 ] = 1 - Math.min( 1, y * ( 1 - k ) + k );

    result[ 0 ] = Math.round( result[ 0 ] * 255 );
    result[ 1 ] = Math.round( result[ 1 ] * 255 );
    result[ 2 ] = Math.round( result[ 2 ] * 255 );

    return result;
}

/**
 *   @param array
 *   @return string
 */
function rgbToHex( rgb_array ) {
    return rgb_array.map( ( v, i ) => {
        return Math.min( v, 255 ).toString( 16 ).padStart( 2, 0 );
    } ).join( '' );
}