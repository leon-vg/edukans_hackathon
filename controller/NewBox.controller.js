sap.ui.define([
	"edukans/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("edukans.controller.NewBox", {
		
		onInit: function() {
			this.getRouter().getRoute("NewBox").attachMatched(this._onRouteMatched, this);
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},
		
		_onRouteMatched: function(oEvent) {
			var sId = oEvent.getParameter("arguments").id;
			this.id = sId;
			if (sId) {
				var oModelNewBox = this.getView().getModel("newBox");
				oModelNewBox.setProperty("/id", sId);
			}
		},
	
		onFail: function(message) {
			jQuery.sap.log.error("Failed because: " + message);
		},
	
		cameraOptions: function() {
			return {
				quality: 50,
				destinationType: navigator.camera.DestinationType.DATA_URL,
				correctOrientation: true,
				allowEdit: true,
				cameraDirection: Camera.Direction.FRONT,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 1024,
				targetHeight: 768
			};
		},
	
		onSelfie: function() {
			var oModelNewBox = this.getView().getModel("newBox");
			var oRouter = this.getRouter();
			var sId = this.id;
			navigator.camera.getPicture(function(imageData) {
	    		oModelNewBox.setProperty('/foto', imageData);
	    		oRouter.navTo("BoxForm", {id: sId});
			}, this.onFail, this.cameraOptions());
		},
		
		onSkip: function() {
			this.getRouter().navTo("BoxForm", {id: this.id});
		}
		
	});

});