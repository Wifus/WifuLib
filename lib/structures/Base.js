/**
 * Base class for Discord Objects
 * @abstract
 * @prop {String} id Object ID
 * @prop {Date} createdAt Date the object was created at
 * @prop {String} createdAtFormatted Formatted string of the createdAt date 
 */
class Base {
    constructor(id){
        this.id = id;
        this.createdAt = new Date(Math.floor(this.id/4194304) + 1420070400000);
        this.createdAtFormatted = this.formatDate(this.createdAt);
    }

    /**
     * Formats a Date object into the format:
     * Weekday (Short) Month (Short) Day (2 Digit) Year (Full) HH:MM (AM/PM)
     * @param {Date} date
     * @returns {String} String
     */
    formatDate(date){
        return `${date.toDateString()} ${date.toLocaleString("en-US", {hour: "numeric", minute: "2-digit"})}`;
    }

}

module.exports = Base;