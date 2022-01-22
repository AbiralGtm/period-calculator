$(document).ready(function () {
    //Set default date as today
    document.getElementById('period_start_date').valueAsDate = new Date();

    //Perform calculation after form submission
    $('#calculate').on('click', function () {
        $('#print').show();
        $('#results').show();
        var period_start_date = document.getElementById('period_start_date').value;
        var period_length = document.getElementById('period_length').value;
        var period_cycle = document.getElementById('period_cycle').value;

        var fertileFromDate = fertileFrom(period_start_date, period_cycle)
        var fertileToDate = fertileTo(period_start_date, period_cycle)
        var nextPeriodStartDate = nextEstimatedPeriodStart(period_start_date, period_cycle)
        var nextPeriodEndDate = nextEstimatedPeriodEnd(nextPeriodStartDate, period_length)
        calculate_one_year(period_start_date, period_length, period_cycle);
        if (fertileFromDate && fertileToDate) {
            document.getElementById('fertile-info').innerHTML = "<h3>Your next most fertile period is from <strong>" + fertileFromDate + "</strong> to <strong>" + fertileToDate+"</strong></h3>";
        }
        if (nextPeriodStartDate && nextPeriodEndDate) {
            document.getElementById('next-period-info').innerHTML = "<h3>Your next period date is <strong>" + nextPeriodStartDate + "</strong> and ends on <strong>" + nextPeriodEndDate+"</strong></h3>";
        }

        $('#print').on('click', function () {
            var w = document.getElementById("results").offsetWidth;
            var h = document.getElementById("results").offsetHeight;
            html2canvas(document.getElementById('results')).then(function (canvas) {
                const contentDataURL = canvas.toDataURL('image/jpeg',1)
                //Set doc size
                var doc = new jsPDF('L', 'px', [w+20, h+20]);

                //set image height similar to doc size
                doc.addImage(contentDataURL, 'JPG', 10,10,w,h);
                doc.save('period-calendar.pdf');
            });
        })
    });

    //Calculate Ovulation Period Start Date
    function fertileFrom(period_start_date, period_cycle) {
        period_cycle = parseInt(period_cycle);
        var from_date = new Date(period_start_date);
        if (period_cycle === 28) {
            from_date = moment(from_date).add(12, 'days').format('MMMM D, YYYY')
        } else {
            from_date = moment(from_date).add(period_cycle - 28 + 12, 'days').format('MMMM D, YYYY')
        }
        return from_date
    }

    //Calculate Ovulation Period End Date
    function fertileTo(period_start_date, period_cycle) {
        period_cycle = parseInt(period_cycle);
        var to = new Date(period_start_date);
        if (period_cycle === 28) {
            to = moment(to).add(16, 'days').format('MMMM D, YYYY');
        } else {
            to = moment(to).add(period_cycle - 28 + 16, 'days').format('MMMM D, YYYY');
        }
        return to
    }

    //Calculate next estimated period date
    function nextEstimatedPeriodStart(period_start_date, period_cycle) {
        period_cycle = parseInt(period_cycle);
        period_start_date = new Date(period_start_date);
        let next_date = moment(period_start_date).add(period_cycle, 'days').format('MMMM D, YYYY');
        return next_date;
    }

    function nextEstimatedPeriodEnd(period_start_date, period_length) {
        period_length = parseInt(period_length);
        period_start_date = new Date(period_start_date);
        let end_date = moment(period_start_date).add(period_length - 1, 'days').format('MMMM D, YYYY');
        return end_date;
    }

    function calculate_one_year(period_start_date, period_length, period_cycle) {
        let start_date = period_start_date;
        let tbody = "";
        for (let i = 1; i <= 12; i++) {
            let fertile_from_date = fertileFrom(start_date, period_cycle);
            let fertile_to_date = fertileTo(start_date, period_cycle);
            start_date = nextEstimatedPeriodStart(start_date, period_cycle);
            let end_date = nextEstimatedPeriodEnd(start_date, period_length);
            tbody = tbody + '<tr>' +
                '<td>' + start_date + '</td>' +
                '<td>' + end_date + '</td>' +
                '<td>' + fertile_from_date + ' to ' + fertile_to_date + '</td>' +
                '</tr>'
        }
        document.getElementById('period_table_body').innerHTML = tbody;
    }

    function pxTomm(px) {
        return Math.floor(px / $('#my_mm').height());
    }
});
