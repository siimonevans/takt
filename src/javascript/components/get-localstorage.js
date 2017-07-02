import $ from '../globals';

function getLocalStorage() {

    function getData() {

        if (localStorage.getItem('storageString')) {
            const data = JSON.parse(localStorage.getItem('storageString'));
            const arrayLength = data.length;

            if (arrayLength !== 0) {
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
                
                $('.task-area .completed-tasks').text('Completed tasks:');
                $('.button.create').show();
            }
        } else {
            $('.task-area .completed-tasks').text('No existing tasks');
        }
    }

    function bindEvents() {
        $(window).on('load', () => getData());
    }

    bindEvents();

}
    
export default getLocalStorage;