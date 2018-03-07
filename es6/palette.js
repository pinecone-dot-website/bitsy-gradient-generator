module.exports = class palette {
    /**
     * 
     * @param {*} el 
     */
    constructor( el ) {
        this.colors = [];
        this.inputs = [];

        el.querySelectorAll( 'input' ).forEach( ( el, i ) => {
            el.addEventListener( 'change', this.parseInput.bind( this, i ) );

            this.inputs[ i ] = el;

            this.parseInput( i, { target: el } );
        } );
    }

    /**
     * 
     * @param {*} i 
     * @param {*} el 
     */
    parseInput( i, el ) {
       this.colors[ i ] = el.target.value;
        
        el.target.parentNode.style.backgroundColor = el.target.value;
       

        console.log( this.colors[ i ]);
    }
};