import $ from '../globals';

function jsDemo() {

    const $testVar = 'JavaScript is working';

    function jQueryCheck() {
        if (window.jQuery) {  
            console.log('jQuery is available');
        }
    }

    function bindEvents() {
        
        // Check for JS
        $(window).on('load', () => {
            console.log($testVar);
        });

        // Check for jQuery
        $(window).on('load', () => jQueryCheck());
    }

    bindEvents();

}
    
export default jsDemo;