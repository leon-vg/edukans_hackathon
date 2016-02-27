sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("edukans.Component", {

		metadata : {
			manifest: "json",
        	handleValidation  : true,
        	includes: ["css/customstyles.css"]
		},

		init : function () {
			
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			// create the views based on the url/hash
            this.getRouter().initialize();
            
            var oModelNewBox = new JSONModel();
            this.setModel(oModelNewBox, "newBox");
            
            var oModel = new JSONModel();
            this.setModel(oModel);
			
		}
	});

});