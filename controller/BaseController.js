sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("edukans.controller.BaseController", {

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Start", {}, true /*no history*/);
			}
		},
		
		// Barcode scanner
		
		openScanner: function(oReturnObject) {
			cordova.plugins.barcodeScanner.scan(
				function(result) {
					if (result.text) {
						if (typeof oReturnObject.success === "function") {
							oReturnObject.success(result.text);
						}
					} else {
						if (typeof oReturnObject.error === "function") {
							oReturnObject.error("geen text");
						}
					}
				},
				function(error) {
						if (typeof oReturnObject.error === "function") {
							oReturnObject.error(error);
						}
				}
			);
		}

	});

});