const activityDb = require("../model/activityModel")

const trackActivity = async (userId, activity) => {
    try {
        if (userId && activity) {
            const newActivity = new activityDb({
                user: userId,
                activity: activity,
            })
            newActivity.save()
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = trackActivity