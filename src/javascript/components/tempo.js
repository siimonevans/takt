import $ from '../globals';

function tempo() {
    
    function timer() {
        const $startButton      = document.querySelector('[data-action="start"]'),
            $stopButton         = document.querySelector('[data-action="stop"]'),
            $resetButton        = document.querySelector('[data-action="reset"]'),
            $saveButton         = document.querySelector('[data-action="save"]'),
            $clearButton        = document.querySelector('[data-action="clear-all"]'),
            minutes             = document.querySelector('.minutes'),
            seconds             = document.querySelector('.seconds'),
            $controls           = $('.controls'),
            $taskLabel          = $('.task-label'),
            $taskProject        = $('.task-project'),
            $taskForm           = $('.task-form'),
            $timerWrapper       = $('.timer-wrapper'),
            $modal              = $('.modal'),
            $modalClose         = $('.modal__cancel'),
            $modalTitle         = $('.modal__title'),
            $modalProject       = $('.modal__project'),
            $modalSave          = $('.modal__save'),
            $modalForm          = $('.modal__form');

        let timerTime           = 0,
            interval            = null,
            isRunning           = false;

        // Run timer
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                interval = setInterval(incrementTimer, 1000);
                $taskLabel.focus();
                $('.loader').removeClass('loader--paused');
            }

            // Update UI
            $controls.addClass('controls--running');
            $taskForm.addClass('task-form--show');
            $timerWrapper.addClass('timer-wrapper--running');
        }

        // Stop timer
        function stopTimer() {
            isRunning = false;
            clearInterval(interval);

            // Update UI
            $timerWrapper.removeClass('timer-wrapper--running');
            $('.loader').addClass('loader--paused');

            document.title = 'Tempo';
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
                totalTime           = '' + numOfMinutes + ':' + numOfSeconds,
                label               = $taskLabel.val(),
                project             = $taskProject.val();

            addStoredItem(label, project, totalTime);
            updateTimeList();
            resetUI();
            resetTimer();
        }

        // Reset UI
        function resetUI() {
            $taskLabel.val('');
            $taskProject.val('');
            $taskForm.removeClass('task-form--show');
            $('.current-task__data').html('');
            $('.current-task').hide();
            $controls.removeClass('controls--running');
        }

        // Add tasks to localStorage
        // Save data in one long string for easier addition/removal/editing
        function addStoredItem(title, project, time) {
            const existingItems = JSON.parse(localStorage.getItem('storageString')) || [];
            const newItem = {
                title,
                project,
                time
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

        function populateModal(title, project) {
            $modalTitle.val(title);
            $modalProject.val(project);
            $modal.attr('data-name', title);
            showModal();
        }

        function showModal() {
            $modal.fadeIn();
        }

        function hideModal() {
            $modal.fadeOut();
        }

        // Prepare/populate modal
        function prepareModal(item) {  
            const data = JSON.parse(localStorage.getItem('storageString')),
                clickedItem = item.parent().attr('data-name');

            $.each(data, function(i) {
                if (data[i].title == clickedItem) {
                    populateModal(data[i].title, data[i].project, data[i].time);
                    localStorage.setItem('storageString', JSON.stringify(data));
                    return false;
                }
            });
        }

        // Save modal contents
        function saveModal() {
            const data = JSON.parse(localStorage.getItem('storageString')),
                currentItem = $modal.attr('data-name');

            $.each(data, function(i) {
                if (data[i].title == currentItem) {
                    data[i].title = $modalTitle.val();
                    data[i].project = $modalProject.val();
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
                    let totalTime = (data[i].time).split(':');
                    let minutes = totalTime[0];
                    let seconds = totalTime[1];

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
            $startButton.addEventListener('click', startTimer);
            $stopButton.addEventListener('click', stopTimer);
            $resetButton.addEventListener('click', resetTimer);
            $saveButton.addEventListener('click', saveTimer);
            $clearButton.addEventListener('click', clearData);

            // Set current task
            $taskForm.on('submit', function(e) {
                e.preventDefault();
                $('.current-task').show();
                $('.current-task__data').html('<div>' + $taskLabel.val() + '</div><div>' + $taskProject.val() + '</div>');
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
        if ($('.app--main').length) {
            $(window).on('load', () => timer());
        }
    }

    bindEvents();
}
    
export default tempo;