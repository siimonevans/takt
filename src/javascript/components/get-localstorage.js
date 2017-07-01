import $ from '../globals';

function getLocalStorage() {

    function getData() {
        var data = JSON.parse(localStorage.getItem('storageString'));

        var arrayLength = data.length;
        for (var i = 0; i < arrayLength; i++) {
            $('.time-list').append('<li><div>title: ' + data[i].title + '</div><div>time: ' + data[i].time + '</div></li>');
        }
    }

    function bindEvents() {
        $(window).on('load', () => getData());
    }

    bindEvents();

}
    
export default getLocalStorage;