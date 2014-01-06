var request = require('request'),
    scraper = require('./scraper'),
    Menu = require('./models/Menu');

// Returns 'yyyy-mm-dd' in EST
function getDateEST(dateObjUTC) {
    var day = dateObjUTC.getDate().toString(),
        month = (dateObjUTC.getMonth() + 1).toString(),
        year = dateObjUTC.getFullYear().toString(),
        hoursUTC = dateObjUTC.getHours();

    // Move day back if before 5am UTC
    if (hoursUTC < 5) { day --; }

    // Pad month
    if (month.length < 2) { month = '0' + month; }

    // Pad day
    if (day.length < 2) { day = '0' + day; }

    var dateEST = year + '-' + month + '-' + day;

    return dateEST; 
}

exports.getDateEST = getDateEST;

// Private utility function to get menu from any date
// and respond to a request
function getAnyDateMenu(date, req, res) {
    var payload = {
        'field_day_value[value][date]': date,
        'view_name': 'menus_test',
        'view_display_id': 'page',
        'view_args': '',
        'view_path': 'dining',
        'view_base_path': 'dining',
        'view_dom_id': '56a3964e9d683783129d622f9a79b171',
        'pager_element': '0',
        'ajax_html_ids[]': 'skip-link',
        'ajax_html_ids[]': 'midd_search_query',
        'ajax_html_ids[]': 'midd_search_submit',
        'ajax_html_ids[]': 'midd_ajax_search_url',
        'ajax_html_ids[]': 'midd_wordmark',
        'ajax_html_ids[]': 'midd_navigation',
        'ajax_html_ids[]': 'midd_content',
        'ajax_html_ids[]': 'navigation',
        'ajax_html_ids[]': 'nav_dining',
        'ajax_html_ids[]': 'nav_retail',
        'ajax_html_ids[]': 'nav_comment',
        'ajax_html_ids[]': 'views-exposed-form-menus-test-page',
        'ajax_html_ids[]': 'edit-field-day-value-wrapper',
        'ajax_html_ids[]': 'edit-field-day-value-value-wrapper',
        'ajax_html_ids[]': 'edit-field-day-value-value',
        'ajax_html_ids[]': 'edit-field-day-value-value',
        'ajax_html_ids[]': 'edit-field-day-value-value-datepicker-popup-0',
        'ajax_html_ids[]': 'edit-submit-menus-test',
        'ajax_html_ids[]': 'midd_footer',
        'ajax_html_ids[]': 'midd_footer_panel',
        'ajax_html_ids[]': 'ui-datepicker-div',
        'ajax_page_state[theme]': 'middsatellite',
        'ajax_page_state[theme_token]': '-sLphxibd9eikzNUq_vyU5IvCdJNRFnzwSkydIx0hYI',
        'ajax_page_state[css][modules/system/system.base.css]': '1',
        'ajax_page_state[css][modules/system/system.menus.css]': '1',
        'ajax_page_state[css][modules/system/system.messages.css]': '1',
        'ajax_page_state[css][modules/system/system.theme.css]': '1',
        'ajax_page_state[css][misc/ui/jquery.ui.core.css]': '1',
        'ajax_page_state[css][misc/ui/jquery.ui.theme.css]': '1',
        'ajax_page_state[css][misc/ui/jquery.ui.datepicker.css]': '1',
        'ajax_page_state[css][sites/all/modules/date/date_popup/themes/jquery.timeentry.css]': '1',
        'ajax_page_state[css][modules/comment/comment.css]': '1',
        'ajax_page_state[css][sites/all/modules/date/date_api/date.css]': '1',
        'ajax_page_state[css][sites/all/modules/date/date_popup/themes/datepicker.1.7.css]': '1',
        'ajax_page_state[css][modules/field/theme/field.css]': '1',
        'ajax_page_state[css][modules/node/node.css]': '1',
        'ajax_page_state[css][modules/search/search.css]': '1',
        'ajax_page_state[css][modules/user/user.css]': '1',
        'ajax_page_state[css][sites/all/modules/views/css/views.css]': '1',
        'ajax_page_state[css][sites/all/modules/ctools/css/ctools.css]': '1',
        'ajax_page_state[css][sites/all/themes/middsatellite/system.menus.css]': '1',
        'ajax_page_state[css][sites/all/themes/middsatellite/system.messages.css]': '1',
        'ajax_page_state[css][sites/all/themes/middsatellite/system.theme.css]': '1',
        'ajax_page_state[css][sites/all/themes/middsatellite/css/styles.css]': '1',
        'ajax_page_state[css][sites/all/themes/middsatellite/css/meal-menus.css]': '1',
        'ajax_page_state[js][misc/jquery.js]': '1',
        'ajax_page_state[js][misc/jquery.once.js]': '1',
        'ajax_page_state[js][misc/drupal.js]': '1',
        'ajax_page_state[js][misc/ui/jquery.ui.core.min.js]': '1',
        'ajax_page_state[js][misc/jquery.cookie.js]': '1',
        'ajax_page_state[js][misc/jquery.form.js]': '1',
        'ajax_page_state[js][misc/ui/jquery.ui.datepicker.min.js]': '1',
        'ajax_page_state[js][sites/all/modules/date/date_popup/jquery.timeentry.pack.js]': '1',
        'ajax_page_state[js][misc/ajax.js]': '1',
        'ajax_page_state[js][sites/all/modules/date/date_popup/date_popup.js]': '1',
        'ajax_page_state[js][sites/all/modules/views/js/base.js]': '1',
        'ajax_page_state[js][misc/progress.js]': '1',
        'ajax_page_state[js][sites/all/modules/views/js/ajax_view.js]': '1'
    }
    request({
        method: 'POST',
        url: 'http://menus.middlebury.edu/views/ajax',
        form: payload,
        json: true
    }, function(err, request_res, body) {
        if (!err && request_res.statusCode == 200) {
            var menu = scraper.parseMenu(date, body[2].data);

            res.send(menu);
        }
    });
}

exports.today = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Menu.findOne({date: getDateEST(new Date())}, {'_id': 0, '__v': 0}, function(err, result) {
        if (result != null) {
            res.send(result);
        }
        else {
            // Err, menu not in database for today
            getAnyDateMenu(getDateEST(new Date()), req, res);
        }
    });
}

exports.findDate = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var requestDate = req.params.date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(requestDate)) {
        var isFuture = (new Date() < new Date(requestDate.replace(/-/g, '/') + ' EST'));

        if (!isFuture) {
            Menu.findOne({date: req.params.date}, {'_id': 0, '__v': 0}, function(err, result) {
                if (result != null) {
                    res.send(result);
                }
                else {
                    // Menu not in database
                    getAnyDateMenu(requestDate, req, res);
                }
            });
        }
        else {
            // Future date
            getAnyDateMenu(requestDate, req, res);   
        }
    }
    else {
        res.send(404, 'Menu not found for ' + requestDate + '.\n' + 'Proper format is `/yyyy-mm-dd`.');
    }
    
}
