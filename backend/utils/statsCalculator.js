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

async function findRelatedAlerts(alertId, distanceMeters = 2000, timeWindowMinutes = 30) {
    const mainAlert = await Alert.findById(alertId);
    if (!mainAlert) return [];
    
    const timeWindow = new Date(mainAlert.timestamp.getTime() - timeWindowMinutes * 60 * 1000);
    
    const relatedAlerts = await Alert.find({
        _id: { $ne: alertId }, // Exclude the current alert
        timestamp: { $gte: timeWindow },
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: mainAlert.location.coordinates
                },
                $maxDistance: distanceMeters
            }
        }
    }).sort({ timestamp: -1 });
    
    return relatedAlerts;
}

module.exports = { getAlertStats };
module.exports = { findRelatedAlerts };