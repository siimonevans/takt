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
                $('.time-list').append('<li><button data-name="'+ data[i].title +'">Delete</button><div>Task name: ' + data[i].title + '</div><div>Task duration: '+ seconds +' seconds</div></li>');
            } else {
                $('.time-list').append('<li><button data-name="'+ data[i].title +'">Delete</button><div>Task name: ' + data[i].title + '</div><div>Task duration: '+ minutes +' minutes and '+ seconds +' seconds</div></li>');
            }
        }
    }

    function bindEvents() {
        $(window).on('load', () => getData());
    }

    bindEvents();

}
    
export default getLocalStorage;