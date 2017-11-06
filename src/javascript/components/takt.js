import $ from '../globals';

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
            $modal              = document.querySelectorAll('.modal'),
            $modalClose         = $('.modal__cancel'),
            $modalTitle         = $('.modal__title'),
            $modalProject       = $('.modal__project'),
            $modalSave          = $('.modal__save'),
            $modalForm          = $('.modal__form'),
            $modalMinutes       = $('.modal__minutes'),
            $modalSeconds       = $('.modal__seconds'),
            minutes             = $('.minutes'),
            seconds             = $('.seconds'),
            mobileBreakpoint    = 650;

        let timerTime           = 0,
            interval            = null,
            isRunning           = false;

        // Run timer
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                interval = setInterval(incrementTimer, 1000);
                $('.loader').removeClass('loader--paused');

                // Only focus input on tablet+
                if ($(window).width() > mobileBreakpoint) {
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
            $('.loader').addClass('loader--paused');

            document.title = 'Takt';
        }

        // Reset timer to zero
        function resetTimer() {
            stopTimer();
            resetUI();
            timerTime = 0;
            seconds.innerText = '00';
            minutes.innerText = '00';
        }

        // Increment timer
        function incrementTimer() {
            const numOfMinutes = Math.floor(timerTime / 60),
                numOfSeconds = timerTime % 60;

            timerTime = timerTime + 1;
            seconds.innerText = numOfSeconds >= 10 ? numOfSeconds : '0' + numOfSeconds;
            minutes.innerText = numOfMinutes >= 10 ? numOfMinutes : '0' + numOfMinutes;

            document.title = $('.timer .minutes').text() + ':' + $('.timer .seconds').text();
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
            $('.current-task__data').html('');
            $('.current-task').hide();
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
                clickedItem = item.parent().attr('data-name');

            $.each(data, function(i) {
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
            $modalTitle.val(title);
            $modalProject.val(project);
            $modalMinutes.val(minutes);
            $modalSeconds.val(seconds);
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
                clickedItem = item.closest('li')[0].getAttribute('data-name');

            $.each(data, function(i) {
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

            $.each(data, function(i) {
                if (data[i].title == currentItem) {
                    data[i].title = $modalTitle.val();
                    data[i].project = $modalProject.val();
                    data[i].minutes = $modalMinutes.val();
                    data[i].seconds = $modalSeconds.val();
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
            $('.time-list').html('');

            if (localStorage.getItem('storageString')) {
                const data = JSON.parse(localStorage.getItem('storageString'));
                const arrayLength = data.length;

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
            } else {
                $('.task-area .completed-tasks').text('No completed tasks');
                $('.button.create').hide();
                $('.time-list-meta').removeClass('time-list-meta--show');
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
                $('.current-task').show();
                $('.current-task__data').html('<div>' + $taskLabel[0].value + '</div><div>' + $taskProject[0].value + '</div>');
            });

            // Remove task
            $(document).on('click', '.time-list li .delete-task', function () {
                var item = $(this);
                deleteItem(item);
            });

            // Edit task
            $(document).on('click', '.time-list li .edit-task', function () {
                var item = $(this);
                prepareModal(item);
            });

            $modalClose.on('click', () => hideModal());
            $modalForm.on('submit', () => saveModal());
            $modalSave.on('click', () => saveModal());
        }

        eventHandler();
    }

    function bindEvents() {
        document.addEventListener('DOMContentLoaded', function () {
            if ($('.app--main').length) {
                $(window).on('load', () => timer());
            }
        });
    }

    bindEvents();
}
    
export default takt;