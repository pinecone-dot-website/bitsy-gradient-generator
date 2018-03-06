module.exports = class palette {
    constructor( el ) {
        this.colors = [];
        this.inputs = [];

        el.querySelectorAll( 'input' ).forEach( ( el, i ) => {
            el.addEventListener( 'change', this.parseInput.bind( this, i ) );

            this.inputs[ i ] = el;

            this.parseInput( i, { target: el } );
        } );
    }

    parseInput( i, e ) {
        this.colors[ i ] = e.target.value;
        e.target.parentNode.style.backgroundColor = e.target.value;
    }
};