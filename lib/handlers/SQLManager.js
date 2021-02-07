const mysql2 = require("mysql2");
const {LOGIN: {DB}} = require("../../secret");

class SQLManager{
	constructor(){
		this.connection = mysql2.createPool(DB);
	}

	async query(query, variables = []){
		const pool = this.connection;
		return new Promise((resolve, reject) => {
			pool.query(query, variables, function(err, rows) {
				if(err) reject(err);
				resolve(rows);
			});
		});
	}

}

module.exports = SQLManager;