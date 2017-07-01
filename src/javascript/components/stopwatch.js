import $ from '../globals';

function stopwatch() {

    function timer() {

        const $startButton      = document.querySelector('[data-action="start"]'),
            $stopButton         = document.querySelector('[data-action="stop"]'),
            $resetButton        = document.querySelector('[data-action="reset"]'),
            $saveButton         = document.querySelector('[data-action="save"]'),
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

        // Add to localStorage
        function addStoredItem(title, time) {
            var existingItems = JSON.parse(localStorage.getItem('storageString')) || [];
            
            var newItem = {
                'title': name,
                'time': time
            };
    
            existingItems.push(newItem);
            localStorage.setItem('storageString', JSON.stringify(existingItems));
        }

        // Update UI
        function updateTimeList() {
            $('.time-list').text(localStorage.getItem(localStorage.key('storageString')));
        }

        // Save time value
        function saveTimer() {
            const numOfMinutes      = Math.floor(timerTime / 60),
                numOfSeconds        = timerTime % 60,
                totalTime           = '' + numOfMinutes + ':' + numOfSeconds;

            addStoredItem('time', totalTime);
            updateTimeList();
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
    }

    function bindEvents() {
        $(window).on('load', () => timer());
    }

    bindEvents();
}
    
export default stopwatch;