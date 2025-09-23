const Alert = require('../models/Alert');

async function getAlertStats(query = {}) {
    const { groupBy, startDate, endDate } = query;
    let matchStage = {};

    //Date Filter
    if (startDate || endDate) {
        matchStage.timestamp = {};
        if (startDate) matchStage.timestamp.$gte = new Date(startDate);
        if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const pipeline = [{ $match: matchStage }];

    //Group by time period if specified
    if (groupBy) {
        let dateFormat = "%Y-%m-%d";
        if (groupBy === 'week') dateFormat = "%Y-%U"; 
        if (groupBy === 'month') dateFormat = "%Y-%m";

        pipeline.push({
            $group: {
                _id: { $dateToString: { format: dateFormat, date: "$timestamp" } },
                count: { $sum: 1 }
            }
        }, { $sort: { _id: 1 } });
    }

    return await Alert.aggregate(pipeline);
            
}

module.exports = { getAlertStats };