function timesheet() {

    const $timeList         = document.querySelectorAll('.time-list'),
        $completedTasks     = document.querySelectorAll('.task-area .completed-tasks');

    function getData() {

        if (localStorage.getItem('storageString')) {
            const data = JSON.parse(localStorage.getItem('storageString'));
            const arrayLength = data.length;

            if (arrayLength !== 0) {
                for (let i = 0; i < arrayLength; i++) {
                    let totalTime = (data[i].time).split(':');
                    let minutes = totalTime[0];
                    let seconds = totalTime[1];

                    if (minutes == 0) {
                        $timeList.innerHTML = '<li><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>';
                    } else {
                        $timeList.innerHTML = '<li><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>';
                    }
                }
                
                $completedTasks[0].innerHTML = 'Completed tasks:';
            }
        } else {
            $completedTasks[0].innerHTML = 'No existing tasks';
        }
    }

    function bindEvents() {
        if (document.querySelectorAll('.app--main')) {
            getData();
        }
    }

    bindEvents();

}
    
export default timesheet;