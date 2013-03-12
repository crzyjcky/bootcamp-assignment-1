var app = app || {};

app.ProductCollection = Backbone.Collection.extend({
	model : app.ProductModel,
	url : "data/televisions.json",

	initialize : function() {
		this.sortKey = "name";
		
		//_.bindAll(this, "filterAndSort");
	},

	comparator : function(model1, model2) {

		var a = model1.get(this.sortKey);
		var b = model2.get(this.sortKey);

		if (a > b) {
			return 1;
		} else if (a < b) {
			return -1;
		} else {
			return 0;
		}

	},

	sortBy : function(name) {

		this.sortKey = name;
		this.sort();
	},

	filterByRange : function() {
		this.each(function(model, index) {
			console.log("filterByRange");
		});
	},
	
	// helper
	filterAndSort: function(range, type, brand, sort) {
		
		var filteredModels = this.models;
		var low = range[0];
		var high = range[1];
		
		filteredModels = _.filter(filteredModels, function(model) {
			return (model.get("size") >= low) 
				&& (model.get("size") <= high);
		});
		
		
		if (type !== "All") {
			filteredModels = _.filter(filteredModels, function(model) {
				return model.get("type") === type;
			});
		}
		
		if (brand !== "All") {
			filteredModels = _.filter(filteredModels, function(model) {
				return model.get("brand") === brand;
			});
		}
		
		filteredModels = _.sortBy(filteredModels, function(model) {
			return model.get(sort);
		});
		

		return filteredModels;
	}
	
});
