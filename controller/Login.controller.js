sap.ui.define([
	"edukans/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("edukans.controller.Login", {
		
		onInit: function() {
			this.getRouter().getRoute("Login").attachMatched(this._onRouteMatched, this);
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},
		
		_onRouteMatched: function() {
			
		},
		
		onSend: function() {
			var oRouter = this.getRouter();
			var oModel = this.getView().getModel();
			setTimeout(function() {
				oModel.setProperty("/user", "chantal@hetnet.nl");
				oModel.setProperty("/dozen", [
					{
						id: 1,
						naam: "Barbiepakket",
						status: "Onderweg naar bestemming"
					}
				]);
				oRouter.navTo("Start");
				MessageToast.show("Je bent ingelogd!", {
					closeOnBrowserNavigation: false
				});
			}, 500);
		}
		
	});

});