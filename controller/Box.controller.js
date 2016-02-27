sap.ui.define([
	"edukans/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("edukans.controller.Box", {
		
		onInit: function() {
			this.getRouter().getRoute("Box").attachMatched(this._onRouteMatched, this);
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},
		
		_onRouteMatched: function(oEvent) {
			
			// Bind view aan de geselecteerde storing
			var sPath = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/dozen/" + sPath);
			
		}
		
	});

});