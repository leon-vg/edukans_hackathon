sap.ui.define([
	"edukans/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("edukans.controller.Start", {
		
		onInit: function() {
			this.getRouter().getRoute("Start").attachMatched(this._onRouteMatched, this);
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},
		
		_onRouteMatched: function() {
			
		},
		
		onNewBox: function() {
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("dialogNewBox", "edukans.fragment.DialogNewBox", this.getView().getController());
			}
			this.oDialog.open();
		},
		
		onDialogNewBoxConfirm: function() {
			var oRouter = this.getRouter();
			this.oDialog.close();
			this.openScanner({
				success: function(sText) {
					oRouter.navTo("NewBox", {id: sText});
				}
			});
		},
		
		onExistingAccount: function() {
			this.getRouter().navTo("Login");
		},
		
		onBoxPress: function(oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath().substr(7);
			this.getRouter().navTo("Box", {id: sPath});
		}
		
	});

});