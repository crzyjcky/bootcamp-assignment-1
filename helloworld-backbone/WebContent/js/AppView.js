var app = app || {};

app.AppView = Backbone.View.extend({
	el : "#app",
	template : _.template($("#app-template").html()),

	events : {
		"change #type-dropdown" : "onTypeDropdownChanged",
		"change #brand-dropdown" : "onBrandDropdownChanged",
		"change #sort-dropdown" : "onSortDropdownChanged",
		"click #clear-button" : "onClearButtonClicked",
		"change #animation-checkbox" : "onAnimationCheckboxChanged"
	},

	initialize : function() {
		_.bindAll(this, "onSliderChanged");
		_.bindAll(this, "onFetchSuccess");
		_.bindAll(this, "onCollectionReset");
		//_.bindAll(this, "filterAndSort");

		$slider = this.$el.find("#size-slider");
		$slider.slider({
			range: true,
			values: [0, 0],
			change : this.onSliderChanged
		});
		$typeDropdown = $("#type-dropdown");//.selectBoxIt();
		$brandDropdown = $("#brand-dropdown");//.selectBoxIt();
		$sortDropdown = $("#sort-dropdown");//.selectBoxIt();
		
		$productDisplayRack = this.$el.find("#product-display-rack");

		this.render();

		this.listenTo(this.collection, "add", this.onCollectionAdded);
		this.listenTo(this.collection, "reset", this.onCollectionReset);
		this.listenTo(this.collection, "sort", this.onCollectionSorted);

		this.collection.fetch({
			success : this.onFetchSuccess,
			error : this.onFetchError
		});
		
		
	},

	render : function() {

		return this;
	},

	sortByName : function() {

	//	console.log("sort by name");
	},

	// collection events
	onFetchSuccess : function(response, xhr) {
		//console.log("onFetchSuccess");

		//this.collection.sortBy("sku");

		//this.onFilterChanged();
	},

	onFetchError : function(errorResponse) {
		console.log("onFetchError");
	},

	onCollectionAdded : function(model, collection, options) {
		console.log("added");
	},

	onCollectionReset : function(collection, options) {
		
		$productDisplayRack.empty();
		collection.each(function(model, index) {
			var productView = new app.ProductView({
				model : model
			});
			$("#product-display-rack").append(productView.render().el);
			$("#" + model.cid + " .rating").raty({score: model.get("rating"), readOnly: true, width: 150});
		});
		
		$(".product")
		.hover(
				function(event) {
					$(this).addClass("product-hover");
				},
				function(event) {
					$(this).removeClass("product-hover");
				
				}
		)
		.on("click", (function(event) {
			$(this).toggleClass("product-selected");
		}));
		
		var brands = _.uniq(this.collection.pluck("brand"));
		var $brandDropdown = this.$el.find("#brand-dropdown");
		$.each(brands, function(i, brand) {
			$brandDropdown.append($("<option></option>").val(brand).html(brand));
		});
		
		var types = _.uniq(this.collection.pluck("type"));
		var $typeDropdown = this.$el.find("#type-dropdown");
		$.each(types, function(i, type) {
			$typeDropdown.append($("<option></option>").val(type).html(type));
		});

		
		var minSize = _.min(this.collection.pluck("size"));
		var maxSize = _.max(this.collection.pluck("size"));
		var $sizeSlider = $("#size-slider");
		$sizeSlider.slider("option", "range", true);
		$sizeSlider.slider("option", "min", minSize);
		$sizeSlider.slider("option", "max", maxSize);
		$sizeSlider.slider("option", "values", [minSize, maxSize]);

		$("#control-panel").fadeTo(0, 1.0);
		
		this.onFilterChanged();
	},

	doLayout: function(filteredModels, rejectedModels) {
		
		$.each(rejectedModels, function(i, model) {
			
			$("#" + model.cid).hide();
		});
		
		var isAnimationEnabled = $("#animation-checkbox").is(":checked");
		var animationDuration = isAnimationEnabled ? 600 : 0;
		
		var displayRackWidth = $("#product-display-rack").width();

		var PRODUCT_WIDTH = 250,
			PRODUCT_HEIGHT = 280;
			//models = filteredModels;
		
		var numProductPerRow = Math.floor(displayRackWidth / PRODUCT_WIDTH);

		var row = 0,
			col = 0;
		
		$.each(filteredModels, function(index, model) {
			col = index % numProductPerRow;
			row = Math.floor(index / numProductPerRow);//Math.ceil(index / numProductPerRow);
			
			var cid = model.cid;
			var $product = $("#" + cid);

			$product.css({"width": PRODUCT_WIDTH, "height": PRODUCT_HEIGHT});
			$product.show();
			
			/*
			$product.animate({
				"left" : col * PRODUCT_WIDTH +  "px", 
				"top" : row * PRODUCT_HEIGHT +  "px"}, 
				animationDuration); 
			*/
			var left = displayRackWidth / numProductPerRow;
			$product.animate({
				"left" : col * left +  "px", 
				"top" : row * PRODUCT_HEIGHT +  "px"}, 
				animationDuration); 

		});
		
		//$("#product-display-rack").height((row  + 1) * PRODUCT_HEIGHT);
		$("#product-display-rack").animate({height: (row  + 1) * PRODUCT_HEIGHT}, animationDuration);

		
	},
	
	onCollectionSorted : function(collection, options) {

	},

	// slider events
	onSliderChanged : function(event, ui) {

		this.onFilterChanged();
	},

	// native events
	onTypeDropdownChanged: function(event) {

		this.onFilterChanged();
	},

	onBrandDropdownChanged: function(event) {

		this.onFilterChanged();
	},
	
	onSortDropdownChanged: function(event) {

		this.onFilterChanged();
	},
	
	onClearButtonClicked: function(event) {
		
		var $sizeSlider = $("#size-slider");
		var $typeDropdown = $("#type-dropdown");
		var $brandDropdown = $("#brand-dropdown");
		var $sortDropdown = $("#sort-dropdown");
		
		$typeDropdown.val($typeDropdown.find("option:first").val());
		$brandDropdown.val($brandDropdown.find("option:first").val());
		$sortDropdown.val($sortDropdown.find("option:first").val());
		
		var sizeLow = $sizeSlider.slider("option", "min");
		var sizeHigh = $sizeSlider.slider("option", "max");
		
		$sizeSlider.slider("option", "values", [sizeLow, sizeHigh]);
		
		this.onFilterChanged();
	},
	
	onAnimationCheckboxChanged : function(event) {
		//$animationCheckbox = this.$el.find("#animation-checkbox");

	},

	// filter changed event
	onFilterChanged: function() {
		var $animationCheckbox = $("#animation-checkbox");
		//$animationCheckbox.is(":checked")
		
		var $sizeSlider = $("#size-slider");
		var $typeDropdown = $("#type-dropdown");
		var $brandDropdown = $("#brand-dropdown");
		var $sortDropdown = $("#sort-dropdown");
		
		var sizeLow = $sizeSlider.slider("values", 0)
		var sizeHigh = $sizeSlider.slider("values", 1);
		var brand = $brandDropdown.find("option:selected").val();
		var type = $typeDropdown.find("option:selected").val();
		var sort = $sortDropdown.find("option:selected").val();
		
		var filteredModels = this.collection.filterAndSort([sizeLow, sizeHigh], type, brand, sort);
		var rejectedModels = _.difference(this.collection.models, filteredModels);
	
		var $matchCount = $("#match-count"); 
		var matchCount = filteredModels.length;
		$matchCount.text(matchCount + " " + (matchCount === 0 ? "MATCH" : "MATCHES"));

		
		this.doLayout(filteredModels, rejectedModels);
	}
	

});