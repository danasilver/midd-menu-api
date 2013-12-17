var models = require('./models.js'),
    Menu = models.Menu;

// Returns 'yyyy-mm-dd' in EST
function getTodayEST() {
    var todayUTC = new Date(),
        day = todayUTC.getDate().toString(),
        month = (todayUTC.getMonth() + 1).toString(),
        year = todayUTC.getYear().toString(),
        hoursUTC = todayUTC.getHours();

    // Move day back if before 5am UTC
    if (hoursUTC < 5) { day --; }

    // Pad month
    if (month.length < 2) { month = '0' + month; }

    // Pad day
    if (day.length < 2) { day = '0' + day; }

    var todayEST = year + '-' + month + '-' + day;

    return todayEST; 
}

exports.today = function(req, res) {
    Menu.findOne({date: getTodayEST()}, function(err, menu) {
        res.send(menu);
    });
}

exports.findDate = function(req, res) {
    var requestDate = req.params.date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(requestDate)) {
        var isFuture = (new Date() < new Date(requestDate.replace(/-/g, '/') + ' EST'));

        if (!isFuture) {
            Menu.findOne({date: req.params.date}, function(err, menu) {
                res.send(menu);
            });
        }
    } 
    else {
        res.send(404, 'Menu not found for ' + requestDate + '.');
    }
    
}
