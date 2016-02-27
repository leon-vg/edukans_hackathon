sap.ui.define([
	"edukans/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("edukans.controller.Main", {
		
		onInit: function() {
			
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
	        
		}
	});

});