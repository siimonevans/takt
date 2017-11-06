function takt() {
    
    function timer() {
        const $startButton      = document.querySelectorAll('.start'),
            $stopButton         = document.querySelectorAll('.stop'),
            $resetButton        = document.querySelectorAll('.cancel'),
            $saveButton         = document.querySelectorAll('.finish'),
            $clearButton        = document.querySelectorAll('.clear'),
            $controls           = document.querySelectorAll('.controls'),
            $taskLabel          = document.querySelectorAll('.task-label'),
            $taskProject        = document.querySelectorAll('.task-project'),
            $taskForm           = document.querySelectorAll('.task-form'),
            $timerWrapper       = document.querySelectorAll('.timer-wrapper'),
            $loader             = document.querySelectorAll('.loader'),
            $currentTask        = document.querySelectorAll('.current-task'),
            $currentTaskData    = document.querySelectorAll('.current-task__data'),
            $timeList           = document.querySelectorAll('.time-list'),
            $timeListMeta       = document.querySelectorAll('.time-list-meta'),
            $timerMinutes       = document.querySelectorAll('.timer .minutes'),
            $timerSeconds       = document.querySelectorAll('.timer .seconds'),
            $modal              = document.querySelectorAll('.modal'),
            $modalClose         = document.querySelectorAll('.modal__cancel'),
            $modalTitle         = document.querySelectorAll('.modal__title'),
            $modalProject       = document.querySelectorAll('.modal__project'),
            $modalSave          = document.querySelectorAll('.modal__save'),
            $modalForm          = document.querySelectorAll('.modal__form'),
            $modalMinutes       = document.querySelectorAll('.modal__minutes'),
            $modalSeconds       = document.querySelectorAll('.modal__seconds'),
            $completedTasks     = document.querySelectorAll('.task-area .completed-tasks'),
            minutes             = document.querySelectorAll('.minutes'),
            seconds             = document.querySelectorAll('.seconds'),
            mobileBreakpoint    = 650;

        let timerTime           = 0,
            interval            = null,
            isRunning           = false;

        // Run timer
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                interval = setInterval(incrementTimer, 1000);
                $loader[0].classList.remove('loader--paused');

                // Only focus input on tablet+
                if (window.innerWidth > mobileBreakpoint) {
                    $taskLabel[0].focus();
                }
            }

            // Update UI
            $controls[0].classList.add('controls--running');
            $taskForm[0].classList.add('task-form--show');
            $timerWrapper[0].classList.add('timer-wrapper--running');
        }

        // Stop timer
        function stopTimer() {
            isRunning = false;
            clearInterval(interval);

            // Update UI
            $timerWrapper[0].classList.remove('timer-wrapper--running');
            $loader[0].classList.add('loader--paused');

            document.title = 'Takt';
        }

        // Reset timer to zero
        function resetTimer() {
            stopTimer();
            resetUI();
            timerTime = 0;
            seconds[0].innerText = '00';
            minutes[0].innerText = '00';
        }

        // Increment timer
        function incrementTimer() {
            const numOfMinutes = Math.floor(timerTime / 60),
                numOfSeconds = timerTime % 60;

            timerTime = timerTime + 1;
            seconds[0].innerText = numOfSeconds >= 10 ? numOfSeconds : '0' + numOfSeconds;
            minutes[0].innerText = numOfMinutes >= 10 ? numOfMinutes : '0' + numOfMinutes;

            document.title = $timerMinutes[0].innerHTML + ':' + $timerSeconds[0].innerHTML;
        }

        // Get timer value
        function saveTimer() {
            const numOfMinutes      = Math.floor(timerTime / 60),
                numOfSeconds        = timerTime % 60,
                time                = '' + numOfMinutes + ':' + numOfSeconds,
                minutes             = numOfMinutes,
                seconds             = numOfSeconds,
                label               = $taskLabel[0].value,
                project             = $taskProject[0].value;

            addStoredItem(label, project, time, minutes, seconds);
            updateTimeList();
            resetUI();
            resetTimer();
        }

        // Reset UI
        function resetUI() {
            $taskLabel[0].value = '';
            $taskProject[0].value = '';
            $taskForm[0].classList.remove('task-form--show');
            $currentTaskData[0].innerHTML = '';
            $currentTask[0].style.display = 'none';
            $controls[0].classList.remove('controls--running');
        }

        // Add tasks to localStorage
        // Save data in one long string for easier addition/removal/editing
        function addStoredItem(title, project, time, minutes, seconds) {
            const existingItems = JSON.parse(localStorage.getItem('storageString')) || [];
            const newItem = {
                title,
                project,
                time,
                minutes,
                seconds
            };
    
            existingItems.push(newItem);
            localStorage.setItem('storageString', JSON.stringify(existingItems));
        }

        // Remove tasks from locaStorage
        function deleteItem(item) {
            const data = JSON.parse(localStorage.getItem('storageString')),
                clickedItem = item.closest('li').getAttribute('data-name');

            Array.prototype.forEach.call(data, function(el, i) {
                if (data[i].title == clickedItem) {
                    data.splice(i, 1);
                    localStorage.setItem('storageString', JSON.stringify(data));
                    return false;
                }
            });

            // Update task list to show localStorage data
            updateTimeList();
        }

        function populateModal(title, project, minutes, seconds) {
            $modalTitle[0].value = title;
            $modalProject[0].value = project;
            $modalMinutes[0].value = minutes;
            $modalSeconds[0].value = seconds;
            $modal[0].setAttribute('data-name', title);
            showModal();
        }

        function showModal() {
            $modal[0].style.display = 'block';
        }

        function hideModal() {
            $modal[0].style.display = 'none';
        }

        // Prepare/populate modal
        function prepareModal(item) {
            const data = JSON.parse(localStorage.getItem('storageString')),
                clickedItem = item.closest('li').getAttribute('data-name');

            Array.prototype.forEach.call(data, function(el, i) {
                if (data[i].title == clickedItem) {
                    populateModal(data[i].title, data[i].project, data[i].minutes, data[i].seconds);
                    localStorage.setItem('storageString', JSON.stringify(data));
                    return false;
                }
            });
        }

        // Save modal contents
        function saveModal() {
            const data = JSON.parse(localStorage.getItem('storageString')),
                currentItem = $modal[0].getAttribute('data-name');

            Array.prototype.forEach.call(data, function(el, i) {
                if (data[i].title == currentItem) {
                    data[i].title = $modalTitle[0].value;
                    data[i].project = $modalProject[0].value;
                    data[i].minutes = $modalMinutes[0].value;
                    data[i].seconds = $modalSeconds[0].value;
                    localStorage.setItem('storageString', JSON.stringify(data));
                    return false;
                }
            });

            // Update task list to show localStorage data
            updateTimeList();
            hideModal();
            return false;
        }

        // Remove all tasks from localStorage
        function clearData() {
            localStorage.removeItem('storageString');
            updateTimeList();
        }

        // Update UI
        function updateTimeList() {

            // Empty list contents
            $timeList[0].innerHTML = '';

            if (localStorage.getItem('storageString')) {
                const data = JSON.parse(localStorage.getItem('storageString'));
                const arrayLength = data.length;

                for (let i = 0; i < arrayLength; i++) {
                    let minutes = data[i].minutes;
                    let seconds = data[i].seconds;

                    if ( minutes == 0 ) {
                        $timeList[0].innerHTML += '<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>';
                    } else {
                        $timeList[0].innerHTML += '<li data-name="'+ data[i].title +'"><button class="edit-task"></button><button class="delete-task"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>';
                    }
                }

                $completedTasks[0].innerHTML = 'Completed tasks:';
                $timeListMeta[0].classList.add('time-list-meta--show');
            } else {
                $completedTasks[0].innerHTML = 'No completed tasks';
                $timeListMeta[0].classList.remove('time-list-meta--show');
            }
        }

        function eventHandler() {
            $startButton[0].addEventListener('click', startTimer);
            $stopButton[0].addEventListener('click', stopTimer);
            $resetButton[0].addEventListener('click', resetTimer);
            $saveButton[0].addEventListener('click', saveTimer);
            $clearButton[0].addEventListener('click', clearData);

            // Set current task
            $taskForm[0].addEventListener('submit', function(e) {
                e.preventDefault();
                $currentTask[0].style.display = 'block';
                $currentTaskData[0].innerHTML = '<div>' + $taskLabel[0].value + '</div><div>' + $taskProject[0].value + '</div>';
            });

            document.addEventListener('click', function(e) {
                if(e.target && e.target.className == 'delete-task') {
                    let item = e.target;
                    deleteItem(item);
                }
            });

            document.addEventListener('click', function(e) {
                if(e.target && e.target.className == 'edit-task') {
                    let item = e.target;
                    prepareModal(item);
                }
            });

            $modalClose[0].addEventListener('click', hideModal());
            $modalForm[0].addEventListener('submit', function(e) {
                e.preventDefault();
                saveModal();
            });
            $modalSave[0].addEventListener('click', function(e) {
                e.preventDefault();
                saveModal();
            });
        }

        eventHandler();
    }

    function bindEvents() {
        document.addEventListener('DOMContentLoaded', function () {
            if (document.querySelectorAll('.app--main')) {
                timer();
            }
        });
    }

    bindEvents();
}
    
export default takt;
