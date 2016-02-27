sap.ui.define([
	"edukans/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("edukans.controller.BoxForm", {
		
		onInit: function() {
			this.getRouter().getRoute("BoxForm").attachMatched(this._onRouteMatched, this);
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},
		
		_onRouteMatched: function(oEvent) {
			
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
			navigator.camera.getPicture(function(imageData) {
	    		oModelNewBox.setProperty('/foto', imageData);
			}, this.onFail, this.cameraOptions());
		},
		
		onSend: function() {
			
		}
		
	});

});