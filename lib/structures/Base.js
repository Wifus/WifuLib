class Base {
    constructor(id){
        this.id = id;
        this.createdAt = new Date(Math.floor(this.id/4194304) + 1420070400000);
        this.createdAtFormatted = this.formatDate(this.createdAt);
    }

    formatDate(date){
        return `${date.toDateString()} ${date.toLocaleString("en-US", {hour: "numeric", minute: "2-digit"})}`;
    }

}

module.exports = Base;