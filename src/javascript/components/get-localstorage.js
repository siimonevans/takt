function getLocalStorage() {

    const $timeList         = document.querySelectorAll('.time-list'),
        $timeListMeta       = document.querySelectorAll('.time-list-meta'),
        $completedTasks     = document.querySelectorAll('.task-area .completed-tasks');

    function getData() {

        if (localStorage.getItem('storageString')) {
            const data = JSON.parse(localStorage.getItem('storageString'));
            const arrayLength = data.length;

            if (arrayLength !== 0) {
                for (let i = 0; i < arrayLength; i++) {
                    let minutes = data[i].minutes;
                    let seconds = data[i].seconds;

                    if ( minutes == 0 ) {
                        $timeList[0].innerHTML += '<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>';
                    } else {
                        $timeList[0].innerHTML +='<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>';
                    }
                }
                
                $completedTasks[0].innerHTML = 'Completed tasks:';
                $timeListMeta[0].classList.add('time-list-meta--show');
            }
        } else {
            $completedTasks[0].innerHTML = 'No completed tasks';
            $timeListMeta[0].classList.remove('time-list-meta--show');
        }
    }

    function bindEvents() {
        if (document.querySelectorAll('.app--main')) {
            getData();
        }
    }

    bindEvents();

}
    
export default getLocalStorage;
