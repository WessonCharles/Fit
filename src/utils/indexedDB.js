/**indexDB
 *
 */

	var dbName = "fit";
	var dbVersion = 1.0;
	var fitDB = {};
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

	if ('webkitIndexedDB' in window) {
		window.IDBTransaction = window.webkitIDBTransaction;
		window.IDBKeyRange = window.webkitIDBKeyRange;
	}

	fitDB.indexedDB = {};
	fitDB.indexedDB.db = null;

	fitDB.indexedDB.onerror = function (e) {
		console.log(e);
	};

	fitDB.indexedDB.open = function (callback) {
		var request = indexedDB.open(dbName, dbVersion);
		request.onsuccess = function (e) {
			console.log("success our DB: " + dbName + " is open and ready for work");
			fitDB.indexedDB.db = e.target.result;
			var db = fitDB.indexedDB.db;
			console.log(db)
			if (db.setVersion) {
				console.log("in old setVersion: " + db.setVersion);
				if (db.version != dbVersion) {
					var req = db.setVersion(dbVersion);
					req.onsuccess = function () {
						if (db.objectStoreNames.contains("fit")) {
							db.deleteobjectStore("plans");
						}

						var store = db.createObjectStore("fit", {keyPath: "timeStamp"});
						var trans = req.result;
						trans.oncomplete = function (e) {
							console.log("== oncomplete transaction ==");
							fitDB.indexedDB.getallfit();
						}
					};
				}
				else {
					fitDB.indexedDB.getallfit(callback);
				}
			} else {
				fitDB.indexedDB.getallfit(callback);
				// fitDB.indexedDB.getallfit();
			}
		}

		request.onupgradeneeded = function (e) {
			console.log("running onupgradeneeded");
			var thisDB = e.target.result;
			if (!thisDB.objectStoreNames.contains("plans")) {
				thisDB.createObjectStore("plans");
			}
		}

		request.onfailure = function (e) {
			console.error("could not open our DB! Err:" + e);
		}


		request.onerror = function (e) {
			console.error("Well... How should I put it? We have some issues with our DB! Err:" + e);
		}

		request.oncomplete = function (e) {
			console.log("== oncomplete transaction ==");
			fitDB.indexedDB.getallfit();
		}
	};

	fitDB.indexedDB.addfit = function (datatext,callback) {
		var db = fitDB.indexedDB.db;
		if (db) {
			var trans = db.transaction(['plans'], "readwrite");
			var store = trans.objectStore("plans");
			var key = datatext.tpid;
			var data = {};
			for (var i in datatext) {
				data[i] = datatext[i];
			}
			var request = store.add(data, key);

			request.onsuccess = function (e) {
				callback();
			};

			request.onerror = function (e) {
				console.error("Error Adding an item: ", e);
			};
		}
	};

	fitDB.indexedDB.updatefit = function (id,datatext,callback) {
		var db = fitDB.indexedDB.db;
		var trans = db.transaction(["plans"], "readwrite");
		var store = trans.objectStore("plans");
	
		var request = store.get(Number(id));

		request.onsuccess = function (e) {
			var obj = e.target.result;
			if (!obj)obj = {};
			delete datatext["id"];
			for (var i in datatext) {
				obj[i] = datatext[i];
			}
			store.put(obj, Number(id));
			callback(obj);
		};
	}

	fitDB.indexedDB.deletefit = function (id) {
		var db = fitDB.indexedDB.db;

		var request = db.transaction("plans", "readwrite").objectStore("plans").openCursor();
		request.onsuccess = function(event) {
		    var cursor = event.target.result;
		    if (cursor) {
		        if (cursor.key == id) {
		            var deleteRequest = cursor.delete(); //请求删除此项
		            deleteRequest.onerror = function () {
		                // body...
		            };
		            deleteRequest.onsuccess = function () {
		                toastr.success("删除成功","成功");
		            };
		        }else{
		        	cursor.continue();
		        }
		    }
		};


		request.onerror = function (e) {
			console.error("Error deleteing: ", e);
		};
	};

	fitDB.indexedDB.getallfit = function (callback) {

		var db = fitDB.indexedDB.db;
		var trans = db.transaction(["plans"], "readwrite");
		var store = trans.objectStore("plans");

		// Get everything in the store;
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = store.openCursor(keyRange);
		var datas = [];
		cursorRequest.onsuccess = function (e) {
			var result = e.target.result;
			
			if (!result){
				console.log("结束游标");
				callback(datas);
				return;
			}
			datas.push(result.value);

			result.continue();
		};

		cursorRequest.onerror = fitDB.indexedDB.onerror;
	};

	fitDB.indexedDB.getfitbyid = function (id,callback) {
		var db = fitDB.indexedDB.db;
		var trans = db.transaction(["plans"], "readwrite");
		var store = trans.objectStore("plans");

		var request = store.get(Number(id));
		request.onsuccess = function (e) {
			var obj = e.target.result;
			callback(obj);
		};
	}

export default fitDB
	


