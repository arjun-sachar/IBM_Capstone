'use strict';

const moment = require('moment');

module.exports = function(Activity) {
  Activity.loginCount = function(unique, callback) {
    // Set to 7 for one week
    const DAYS = 7;
    const dateTo = moment();
    const dateFrom = dateTo.subtract(DAYS, 'd');

    Activity.find({
      where: {
        name: 'login',
        date: {
          gte: dateFrom.toISOString(),
          lte: dateTo.toISOString(),
        },
      },
    }).then((activities) => {
      const data = [
        {
          x: [],
          y: [],
        },
      ];

      for (let i = 0; i <= DAYS; i++) {
        const usersLoggedIn = [];
        const currentDate = moment(dateFrom)
          .add(i, 'd')
          .format('ll');
        data[0].x.push(currentDate);
        data[0].y.push(
          activities.filter((act) => {
            if (
              moment(act.date).format('ll') == currentDate &&
              usersLoggedIn.indexOf(act.user_id) === -1
            ) {
              if (unique) {
                usersLoggedIn.push(act.user_id);
              }
              return true;
            }
            return false;
          }).length
        );
      }

      callback(null, data);
    });
  };
};
