"use strict";

module.exports = class Base {
    /**
     * Base class for Discord Objects
     * @abstract
     * @arg {*} id 
     */
    constructor(id){
        /**@type {String} */
        this.id = id;
        /**@type {Date} */
        this.createdAt = new Date(Math.floor(id/4194304) + 1420070400000);
        /**@type {String} */
        this.createdAtFormatted = this.formatDate(this.createdAt);
    }

    /**
     * Get a date in the format: Wkd M Day YYYY HH:MM AM/PM
     * @arg {Date} date
     * @returns {String}
     */
    formatDate(date){
        return `${date.toDateString()} ${date.toLocaleString("en-US", {hour: "numeric", minute: "2-digit"})}`;
    }

}