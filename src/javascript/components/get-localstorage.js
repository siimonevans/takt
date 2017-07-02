import $ from '../globals';

function getLocalStorage() {

    function getData() {
        const data = JSON.parse(localStorage.getItem('storageString'));
        const arrayLength = data.length;
        
        for (var i = 0; i < arrayLength; i++) {
            let totalTime = (data[i].time).split(':');
            let minutes = totalTime[0];
            let seconds = totalTime[1];

            if ( minutes == 0 ) {
                $('.time-list').append('<li><button data-name="'+ data[i].title +'"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>');
            } else {
                $('.time-list').append('<li><button data-name="'+ data[i].title +'"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>');
            }
        }
    }

    function bindEvents() {
        $(window).on('load', () => getData());
    }

    bindEvents();

}
    
export default getLocalStorage;