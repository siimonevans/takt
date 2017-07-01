import $ from '../globals';

function stopwatch() {

    function timer() {

        const $startButton = document.querySelector('[data-action="start"]'),
            $stopButton = document.querySelector('[data-action="stop"]'),
            $resetButton = document.querySelector('[data-action="reset"]'),
            $saveButton = document.querySelector('[data-action="save"]'),
            minutes = document.querySelector('.minutes'),
            seconds = document.querySelector('.seconds');

        let timerTime = 0,
            interval,
            isRunning = false;

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

        function saveTimer() {

            const numOfMinutes = Math.floor(timerTime / 60),
                numOfSeconds = timerTime % 60;

            let totalTime = '' + numOfMinutes + ' : ' + numOfSeconds;

            function addItem(title, time) {
                var oldItems = JSON.parse(localStorage.getItem('storageString')) || [];
                
                var newItem = {
                    'title': name,
                    'time': time
                };
                
                oldItems.push(newItem);
                
                localStorage.setItem('storageString', JSON.stringify(oldItems));
            }

            console.log(JSON.parse(localStorage.getItem('storageString')));
            addItem('time', totalTime);
            $('.time-list').text(localStorage.getItem(localStorage.key('storageString')));
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