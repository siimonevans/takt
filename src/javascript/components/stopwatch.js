import $ from '../globals';

function stopwatch() {

    function timer() {

        const $startButton      = document.querySelector('[data-action="start"]'),
            $stopButton         = document.querySelector('[data-action="stop"]'),
            $resetButton        = document.querySelector('[data-action="reset"]'),
            $saveButton         = document.querySelector('[data-action="save"]'),
            $clearButton        = document.querySelector('[data-action="clear-all"]'),
            minutes             = document.querySelector('.minutes'),
            seconds             = document.querySelector('.seconds');

        let timerTime           = 0,
            interval            = null,
            isRunning           = false;

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                interval = setInterval(incrementTimer, 1000);
            }

            $('.time-label').addClass('time-label--show');
        }

        function stopTimer() {
            isRunning = false;
            clearInterval(interval);
        }

        function resetTimer() {
            stopTimer();
            timerTime = 0;
            seconds.innerText = '00';
            minutes.innerText = '00';
        }

        // Clear time list
        function clearData() {
            localStorage.removeItem('storageString');
            updateTimeList();
        }

        // Add to localStorage
        function addStoredItem(title, time) {
            const existingItems = JSON.parse(localStorage.getItem('storageString')) || [];
            
            const newItem = {
                title,
                time
            };
    
            existingItems.push(newItem);
            localStorage.setItem('storageString', JSON.stringify(existingItems));
        }

        // Reset UI
        function resetUI() {
            $('.time-label').val('');
            $('.time-label').removeClass('time-label--show');
        }

        // Update UI
        function updateTimeList() {
            $('.time-list').html('');

            if (localStorage.getItem('storageString').length) {
                const data = JSON.parse(localStorage.getItem('storageString'));
                const arrayLength = data.length;

                for (var i = 0; i < arrayLength; i++) {
                    let totalTime = (data[i].time).split(':');
                    let minutes = totalTime[0];
                    let seconds = totalTime[1];

                    if ( minutes == 0 ) {
                        $('.time-list').append('<li><div>Task name: ' + data[i].title + '</div><div>Task duration: '+ seconds +' seconds</div></li>');
                    } else {
                        $('.time-list').append('<li><div>Task name: ' + data[i].title + '</div><div>Task duration: '+ minutes +' minutes and '+ seconds +' seconds</div></li>');
                    }
                }
            }
        }

        // Save time value
        function saveTimer() {
            const numOfMinutes      = Math.floor(timerTime / 60),
                numOfSeconds        = timerTime % 60,
                totalTime           = '' + numOfMinutes + ':' + numOfSeconds,
                label               = $('.time-label').val();

            addStoredItem(label, totalTime);
            updateTimeList();
            resetUI();
            resetTimer();
        }

        function incrementTimer() {
            const numOfMinutes = Math.floor(timerTime / 60),
                numOfSeconds = timerTime % 60;

            timerTime = timerTime + 1;
            seconds.innerText = numOfSeconds >= 10 ? numOfSeconds : '0' + numOfSeconds;
            minutes.innerText = numOfMinutes >= 10 ? numOfMinutes : '0' + numOfMinutes;
        }

        $startButton.addEventListener('click', startTimer);
        $stopButton.addEventListener('click', stopTimer);
        $resetButton.addEventListener('click', resetTimer);
        $saveButton.addEventListener('click', saveTimer);
        $clearButton.addEventListener('click', clearData);
    }

    function bindEvents() {
        $(window).on('load', () => timer());
    }

    bindEvents();
}
    
export default stopwatch;