var app = app || {};

app.ProductView = Backbone.View.extend({
	tagName : "div",
	className : "product",
	template : _.template($("#product-template").html()),
	render : function() {
		this.$el.attr("id", this.model.cid)
		.css("display", "none")
		.html(this.template(this.model.toJSON()));

		return this;
	}
});
