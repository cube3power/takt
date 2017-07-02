import $ from '../globals';

function stopwatch() {

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
            $timerWrapper       = $('.timer-wrapper');

        let timerTime           = 0,
            interval            = null,
            isRunning           = false;

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                interval = setInterval(incrementTimer, 1000);
            }

            $controls.addClass('controls--running');
            $taskForm.addClass('task-form--show');
            $timerWrapper.addClass('timer-wrapper--running');
        }

        function stopTimer() {
            isRunning = false;
            clearInterval(interval);
            $timerWrapper.removeClass('timer-wrapper--running');
        }

        function resetTimer() {
            stopTimer();
            resetUI();
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

        // Remove items
        function deleteItem(item) {
            const data = JSON.parse(localStorage.getItem('storageString')),
                clickedItem = item.attr('data-name');

            $.each(data, function(i){
                if(data[i].title == clickedItem) {
                    data.splice(i,1);
                    localStorage.setItem('storageString', JSON.stringify(data));
                    return false;
                }
            });

            updateTimeList();
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

        // Update UI
        function updateTimeList() {
            $('.time-list').html('');

            if (localStorage.getItem('storageString')) {
                const data = JSON.parse(localStorage.getItem('storageString'));
                const arrayLength = data.length;

                for (var i = 0; i < arrayLength; i++) {
                    let totalTime = (data[i].time).split(':');
                    let minutes = totalTime[0];
                    let seconds = totalTime[1];

                    if ( minutes == 0 ) {
                        $('.time-list').append('<li><button data-name="'+ data[i].title +'"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ seconds +' seconds</span></div></li>');
                    } else {
                        $('.time-list').append('<li><button data-name="'+ data[i].title +'"></button><div>Task name: <span>' + data[i].title + '</span></div><div>Task project: <span>' + data[i].project + '</span></div><div>Task duration: <span>'+ minutes +' minutes and '+ seconds +' seconds</span></div></li>');
                    }
                }

                $('.task-area .completed-tasks').text('Completed tasks:');
                $('.button.create').show();
            } else {
                $('.task-area .completed-tasks').text('No existing tasks');
                $('.button.create').hide();
            }
        }

        // Save time value
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

        $('form').on('submit', function(e) {
            e.preventDefault();
            $('.current-task').show();
            $('.current-task__data').html('<div>' + $taskLabel.val() + '</div><div>' + $taskProject.val() + '</div>');
        });

        $('body').on('click', '.time-list li button', function () {
            var item = $(this);
            deleteItem(item);
        });
    }

    function bindEvents() {
        if ($('.app--main').length) {
            $(window).on('load', () => timer());
        }
    }

    bindEvents();
}
    
export default stopwatch;