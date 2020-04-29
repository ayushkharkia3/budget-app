module.exports = class Budget {
    constructor(type, desc, date, amt) {
        this.id = Math.random().toString(36).slice(2);
        this.type = type;
        this.description = desc;
        this.date = date.substring(8) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
        this.amount = amt;
        this.addedOn = (new Date()).toString();

    }
}