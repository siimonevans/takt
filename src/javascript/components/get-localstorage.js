import $ from '../globals';

function getLocalStorage() {

    function getData() {

        if (localStorage.getItem('storageString')) {
            const data = JSON.parse(localStorage.getItem('storageString'));
            const arrayLength = data.length;

            if (arrayLength !== 0) {
                for (var i = 0; i < arrayLength; i++) {
                    let minutes = data[i].minutes;
                    let seconds = data[i].seconds;

                    if ( minutes == 0 ) {
                        $('.time-list').append('<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>');
                    } else {
                        $('.time-list').append('<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>');
                    }
                }
                
                $('.task-area .completed-tasks').text('Completed tasks:');
                $('.button.create').show();
                $('.time-list-meta').addClass('time-list-meta--show');
            }
        } else {
            $('.task-area .completed-tasks').text('No completed tasks');
            $('.time-list-meta').removeClass('time-list-meta--show');
        }
    }

    function bindEvents() {
        if ($('.app--main').length) {
            $(window).on('load', () => getData());
        }
    }

    bindEvents();

}
    
export default getLocalStorage;