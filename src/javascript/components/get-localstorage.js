import $ from '../globals';

function getLocalStorage() {

    function getData() {
        $('.time-list').text(localStorage.getItem(localStorage.key('storageString')));
    }

    function bindEvents() {
        $(window).on('load', () => getData());
    }

    bindEvents();

}
    
export default getLocalStorage;