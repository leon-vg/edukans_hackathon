/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./MessageBox','./Dialog','./library','sap/ui/core/Control','sap/ui/unified/FileUploaderParameter',"sap/ui/unified/FileUploader",'sap/ui/core/format/FileSizeFormat','./ObjectAttribute','./ObjectStatus',"./UploadCollectionItem","sap/ui/core/HTML","./BusyIndicator","./CustomListItem","./Link","./CustomListItemRenderer","sap/ui/core/HTMLRenderer","./LinkRenderer","./ObjectAttributeRenderer","./ObjectStatusRenderer","./TextRenderer","./DialogRenderer"],function(q,M,D,L,C,F,a,b,O,c,U,H,B,d,f){"use strict";var g=C.extend("sap.m.UploadCollection",{constructor:function(i,s){var I;if(s&&s.instantUpload===false){I=s.instantUpload;delete s.instantUpload;}else if(i&&i.instantUpload===false){I=i.instantUpload;delete i.instantUpload;}try{C.apply(this,arguments);if(I===false){this.bInstantUpload=I;this._oFormatDecimal=b.getInstance({binaryFilesize:false,maxFractionDigits:1,maxIntegerDigits:3});}}catch(e){this.destroy();throw e;}},metadata:{library:"sap.m",properties:{fileType:{type:"string[]",group:"Data",defaultValue:null},maximumFilenameLength:{type:"int",group:"Data",defaultValue:null},maximumFileSize:{type:"float",group:"Data",defaultValue:null},mimeType:{type:"string[]",group:"Data",defaultValue:null},multiple:{type:"boolean",group:"Behavior",defaultValue:false},noDataText:{type:"string",group:"Behavior",defaultValue:null},sameFilenameAllowed:{type:"boolean",group:"Behavior",defaultValue:false},showSeparators:{type:"sap.m.ListSeparators",group:"Appearance",defaultValue:sap.m.ListSeparators.All},uploadEnabled:{type:"boolean",group:"Behavior",defaultValue:true},uploadUrl:{type:"string",group:"Data",defaultValue:"../../../upload"},instantUpload:{type:"boolean",group:"Behavior",defaultValue:true},numberOfAttachmentsText:{type:"string",group:"Appearance",defaultValue:null}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.UploadCollectionItem",multiple:true,singularName:"item"},headerParameters:{type:"sap.m.UploadCollectionParameter",multiple:true,singularName:"headerParameter"},parameters:{type:"sap.m.UploadCollectionParameter",multiple:true,singularName:"parameter"}},events:{change:{parameters:{documentId:{type:"string"},files:{type:"object[]"}}},fileDeleted:{parameters:{documentId:{type:"string"},item:{type:"sap.m.UploadCollectionItem"}}},filenameLengthExceed:{parameters:{documentId:{type:"string"},files:{type:"object[]"}}},fileRenamed:{parameters:{documentId:{type:"string"},fileName:{type:"string"},item:{type:"sap.m.UploadCollectionItem"}}},fileSizeExceed:{parameters:{documentId:{type:"string"},fileSize:{type:"string"},files:{type:"object[]"}}},typeMissmatch:{parameters:{documentId:{type:"string"},fileType:{type:"string"},mimeType:{type:"string"},files:{type:"object[]"}}},uploadComplete:{parameters:{readyStateXHR:{type:"string"},response:{type:"string"},status:{type:"string"},files:{type:"object[]"}}},uploadTerminated:{parameters:{fileName:{type:"string"},getHeaderParameter:{type:"function",parameters:{headerParameterName:{type:"string"}}}}},beforeUploadStarts:{parameters:{fileName:{type:"string"},addHeaderParameter:{type:"function",parameters:{headerParameter:{type:"sap.m.UploadCollectionParameter"}}},getHeaderParameter:{type:"function",parameters:{headerParameterName:{type:"string"}}}}}}}});g._uploadingStatus="uploading";g._displayStatus="display";g._toBeDeletedStatus="toBeDeleted";g._pendingUploadStatus="pendingUploadStatus";g._placeholderCamera='sap-icon://camera';g.prototype.init=function(){g.prototype._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._headerParamConst={requestIdName:"requestId"+q.now(),fileNameRequestIdName:"fileNameRequestId"+q.now()};this._requestIdValue=0;this._iFUCounter=0;this._oList=new sap.m.List(this.getId()+"-list");this._oList.addStyleClass("sapMUCList");this._cAddItems=0;this._iUploadStartCallCounter=0;this.aItems=[];this._aDeletedItemForPendingUpload=[];this._aFileUploadersForPendingUpload=[];};g.prototype.setFileType=function(e){if(!e){return this;}if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change fileType at runtime.");}else{var h=e.length;for(var i=0;i<h;i++){e[i]=e[i].toLowerCase();}this.setProperty("fileType",e);if(this._getFileUploader().getFileType()!==e){this._getFileUploader().setFileType(e);}}return this;};g.prototype.setMaximumFilenameLength=function(m){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change maximumFilenameLength at runtime.");}else{this.setProperty("maximumFilenameLength",m,true);if(this._getFileUploader().getMaximumFilenameLength()!==m){this._getFileUploader().setMaximumFilenameLength(m);}}return this;};g.prototype.setMaximumFileSize=function(m){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change maximumFileSize at runtime.");}else{this.setProperty("maximumFileSize",m,true);if(this._getFileUploader().getMaximumFileSize()!==m){this._getFileUploader().setMaximumFileSize(m);}}return this;};g.prototype.setMimeType=function(m){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change mimeType at runtime.");}else{this.setProperty("mimeType",m);if(this._getFileUploader().getMimeType()!==m){this._getFileUploader().setMimeType(m);}return this;}};g.prototype.setMultiple=function(m){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change multiple at runtime.");}else{this.setProperty("multiple",m);if(this._getFileUploader().getMultiple()!==m){this._getFileUploader().setMultiple(m);}return this;}};g.prototype.setNoDataText=function(n){this.setProperty("noDataText",n);if(this._oList.getNoDataText()!==n){this._oList.setNoDataText(n);}return this;};g.prototype.setShowSeparators=function(s){this.setProperty("showSeparators",s);if(this._oList.getShowSeparators()!==s){this._oList.setShowSeparators(s);}return this;};g.prototype.setUploadEnabled=function(u){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change uploadEnabled at runtime.");}else{this.setProperty("uploadEnabled",u);if(this._getFileUploader().getEnabled()!==u){this._getFileUploader().setEnabled(u);}}return this;};g.prototype.setUploadUrl=function(u){if(!this.getInstantUpload()){q.sap.log.info("As property instantUpload is false it is not allowed to change uploadUrl at runtime.");}else{this.setProperty("uploadUrl",u);if(this._getFileUploader().getUploadUrl()!==u){this._getFileUploader().setUploadUrl(u);}}return this;};g.prototype.setInstantUpload=function(i){q.sap.log.error("It is not supported to change the behavior at runtime.");return this;};g.prototype.upload=function(){if(this.getInstantUpload()){q.sap.log.error("Not a valid API call. 'instantUpload' should be set to 'false'.");}var e=this._aFileUploadersForPendingUpload.length;for(var i=0;i<e;i++){this._iUploadStartCallCounter=0;this._aFileUploadersForPendingUpload[i].upload();}};g.prototype.onBeforeRendering=function(){this._RenderManager=this._RenderManager||sap.ui.getCore().createRenderManager();var i,e;h.bind(this)();if(!this.getInstantUpload()){this._getListHeader(this.aItems.length);this._clearList();this._fillList(this.aItems);this._oList.setHeaderToolbar(this.oHeaderToolbar);return;}if(this.aItems.length>0){e=this.aItems.length;var u=[];for(i=0;i<e;i++){if(this.aItems[i]&&this.aItems[i]._status===g._uploadingStatus&&this.aItems[i]._percentUploaded!==100){u.push(this.aItems[i]);}else if(this.aItems[i]&&this.aItems[i]._status!==g._uploadingStatus&&this.aItems[i]._percentUploaded===100&&this.getItems().length===0){u.push(this.aItems[i]);}}if(u.length===0){this.aItems=[];this.aItems=this.getItems();}}else{this.aItems=this.getItems();}this._getListHeader(this.aItems.length);this._clearList();this._fillList(this.aItems);this._oList.setAggregation("headerToolbar",this.oHeaderToolbar,true);if((sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9)&&this.aItems.length>0&&this.aItems[0]._status===g._uploadingStatus){this._oFileUploader.setEnabled(false);}else{if(this.sErrorState!=="Error"){if(this.getUploadEnabled()!==this._oFileUploader.getEnabled()){this._oFileUploader.setEnabled(this.getUploadEnabled());}}else{this._oFileUploader.setEnabled(false);}}function h(){if(this.bInstantUpload===false){this.setProperty("instantUpload",this.bInstantUpload,true);delete this.bInstantUpload;}}};g.prototype.onAfterRendering=function(){var t=this,T,i;if(!this.getInstantUpload()){T=this.oHeaderToolbar.getContent().length;if(this._aFileUploadersForPendingUpload.length){for(i=2;i<T-1;i++){this.oHeaderToolbar.getContent()[i].$().hide();}}return;}for(i=0;i<this._oList.aDelegates.length;i++){if(this._oList.aDelegates[i]._sId&&this._oList.aDelegates[i]._sId==="UploadCollection"){this._oList.aDelegates.splice(i,1);}}if(this.aItems||(this.aItems===this.getItems())){if(this.editModeItem){var $=q.sap.byId(this.editModeItem+"-ta_editFileName-inner");if($){var I=this.editModeItem;if(!sap.ui.Device.os.ios){$.focus(function(){$.selectText(0,$.val().length);});}$.focus();this._oList.addDelegate({onclick:function(e){sap.m.UploadCollection.prototype._handleClick(e,t,I);}});this._oList.aDelegates[this._oList.aDelegates.length-1]._sId="UploadCollection";}}else if(this.sFocusId){sap.m.UploadCollection.prototype._setFocus2LineItem(this.sFocusId);this.sFocusId=null;}else if(this.sDeletedItemId){sap.m.UploadCollection.prototype._setFocusAfterDeletion(this.sDeletedItemId,t);this.sDeletedItemId=null;}}};g.prototype.exit=function(){var i,p;if(this._oList){this._oList.destroy();this._oList=null;}if(this._oFileUploader){this._oFileUploader.destroy();this._oFileUploader=null;}if(this.oHeaderToolbar){this.oHeaderToolbar.destroy();this.oHeaderToolbar=null;}if(this.oNumberOfAttachmentsLabel){this.oNumberOfAttachmentsLabel.destroy();this.oNumberOfAttachmentsLabel=null;}if(this._RenderManager){this._RenderManager.destroy();}if(this._aFileUploadersForPendingUpload){p=this._aFileUploadersForPendingUpload.length;for(i=0;i<p;i++){this._aFileUploadersForPendingUpload[i].destroy();this._aFileUploadersForPendingUpload[i]=null;}this._aFileUploadersForPendingUpload=null;}};g.prototype._getListHeader=function(I){var o,n,t,i;n=this._getNumberOfAttachmentsTitle(I);if(!this.oHeaderToolbar){if(!!this._oFileUploader&&!this.getInstantUpload()){this._oFileUploader.destroy();}o=this._getFileUploader();this.oHeaderToolbar=new sap.m.Toolbar(this.getId()+"-toolbar",{content:[n,new sap.m.ToolbarSpacer(),o]});this.oHeaderToolbar.addStyleClass("sapMUCListHeader");}else if(!this.getInstantUpload()){var p=this._aFileUploadersForPendingUpload.length;for(i=p-1;i>=0;i--){if(this._aFileUploadersForPendingUpload[i].getId()==this._oFileUploader.getId()){o=this._getFileUploader();t=this.oHeaderToolbar.getContent().length;this.oHeaderToolbar.insertAggregation("content",o,t,true);break;}}}};g.prototype._mapItemToListItem=function(i){if(!i){return null;}var I,s,e,o,l,h,$,j,k,t=this;I=i.getId();s=i._status;e=i.getFileName();if(s===g._uploadingStatus){o=new sap.m.BusyIndicator(I+"-ia_indicator",{visible:true}).addStyleClass("sapMUCloadingIcon");}else{k=this._createIcon(i,I,e,t);}h=I+"-container";$=q.sap.byId(h);if(!!$){$.remove();$=null;}j=new sap.ui.core.HTML({content:"<span id="+h+" class= sapMUCTextButtonContainer> </span>",afterRendering:function(E){t._renderContent(i,h,t);}});l=new sap.m.CustomListItem(I+"-cli",{content:[o,k,j]});l._status=s;l.addStyleClass("sapMUCItem");return l;};g.prototype._renderContent=function(I,s,t){var e,i,A,S,p,h,j,r,k;p=I._percentUploaded;h=I.getAllAttributes();j=I.getStatuses();e=I.getId();A=h.length;S=j.length;k=I._status;r=t._RenderManager;r.write('<div class="sapMUCTextContainer ');if(k==="Edit"){r.write('sapMUCEditMode ');}r.write('" >');r.renderControl(this._getFileNameControl(I,t));if(k===g._uploadingStatus&&!(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9)){r.renderControl(this._createProgressLabel(e,p));}else{if(A>0){r.write('<div class="sapMUCAttrContainer">');for(i=0;i<A;i++){h[i].addStyleClass("sapMUCAttr");r.renderControl(h[i]);if((i+1)<A){r.write('<div class="sapMUCSeparator">&nbsp&#x00B7&#160</div>');}}r.write('</div>');}if(S>0){r.write('<div class="sapMUCStatusContainer">');for(i=0;i<S;i++){j[i].detachBrowserEvent("hover");r.renderControl(j[i]);if((i+1)<S){r.write('<div class="sapMUCSeparator">&nbsp&#x00B7&#160</div>');}}r.write('</div>');}}r.write('</div>');this._renderButtons(r,I,k,e,t);r.flush(q.sap.byId(s)[0],true);};g.prototype._renderButtons=function(r,I,s,e,t){var h,j;h=this._getButtons(I,s,e,t);if(!!h){j=h.length;}if(j>0){r.write('<div class="sapMUCButtonContainer">');for(var i=0;i<j;i++){if((i+1)<j){h[i].addStyleClass("sapMUCFirstButton");}r.renderControl(h[i]);}r.write('</div>');}};g.prototype._getFileNameControl=function(i,t){var e,o,h,s,j,I,S,m,v,k,l,V;j=i.getFileName();I=i.getId();S=i._status;if(S!=="Edit"){e=true;if(this.sErrorState==="Error"||!q.trim(i.getUrl())){e=false;}o=sap.ui.getCore().byId(I+"-ta_filenameHL");if(!o){o=new sap.m.Link(I+"-ta_filenameHL",{enabled:e,press:function(E){sap.m.UploadCollection.prototype._triggerLink(E,t);}}).addStyleClass("sapMUCFileName");o.setModel(i.getModel());o.setText(j);}else{o.setModel(i.getModel());o.setText(j);o.setEnabled(e);}return o;}else{h=t._splitFilename(j);m=t.getMaximumFilenameLength();v="None";k=false;s=h.name;if(i.errorState==="Error"){k=true;v="Error";s=i.changedFileName;if(s.length===0){V=this._oRb.getText("UPLOADCOLLECTION_TYPE_FILENAME");}else{V=this._oRb.getText("UPLOADCOLLECTION_EXISTS");}}l=sap.ui.getCore().byId(I+"-ta_editFileName");if(!l){l=new sap.m.Input(I+"-ta_editFileName",{type:sap.m.InputType.Text,fieldWidth:"75%",valueState:v,valueStateText:V,showValueStateMessage:k,description:h.extension}).addStyleClass("sapMUCEditBox");l.setModel(i.getModel());l.setValue(s);}else{l.setModel(i.getModel());l.setValueState(v);l.setFieldWidth("75%");l.setValueStateText(V);l.setValue(s);l.setDescription(h.extension);l.setShowValueStateMessage(k);}if((m-h.extension.length)>0){l.setProperty("maxLength",m-h.extension.length,true);}return l;}};g.prototype._createProgressLabel=function(i,p){var P;P=sap.ui.getCore().byId(i+"-ta_progress");if(!P){P=new sap.m.Label(i+"-ta_progress",{text:this._oRb.getText("UPLOADCOLLECTION_UPLOADING",[p])}).addStyleClass("sapMUCProgress");}else{P.setText(this._oRb.getText("UPLOADCOLLECTION_UPLOADING",[p]));}return P;};g.prototype._createIcon=function(i,I,s,t){var T,e,o;T=i.getThumbnailUrl();if(T){o=new sap.m.Image(I+"-ia_imageHL",{src:sap.m.UploadCollection.prototype._getThumbnail(T,s),decorative:false,alt:this._getAriaLabelForPicture(i)}).addStyleClass("sapMUCItemImage");}else{e=sap.m.UploadCollection.prototype._getThumbnail(undefined,s);o=new sap.ui.core.Icon(I+"-ia_iconHL",{src:e,decorative:false,useIconTooltip:false,alt:this._getAriaLabelForPicture(i)}).addStyleClass("sapMUCItemIcon");if(e===g._placeholderCamera){o.addStyleClass("sapMUCItemPlaceholder");}}if(this.sErrorState!=="Error"&&q.trim(i.getProperty("url"))){o.attachPress(function(E){sap.m.UploadCollection.prototype._triggerLink(E,t);});}return o;};g.prototype._getButtons=function(i,s,I,t){var e,o,h,j,k,E,l;e=[];if(!this.getInstantUpload()){j="deleteButton";k=this._createDeleteButton(I,j,i,this.sErrorState,t);e.push(k);return e;}if(s==="Edit"){o=sap.ui.getCore().byId(I+"-okButton");if(!o){o=new sap.m.Button({id:I+"-okButton",text:this._oRb.getText("UPLOADCOLLECTION_OKBUTTON_TEXT"),type:sap.m.ButtonType.Transparent}).addStyleClass("sapMUCOkBtn");}h=sap.ui.getCore().byId(I+"-cancelButton");if(!h){h=new sap.m.Button({id:I+"-cancelButton",text:this._oRb.getText("UPLOADCOLLECTION_CANCELBUTTON_TEXT"),type:sap.m.ButtonType.Transparent}).addStyleClass("sapMUCCancelBtn");}e.push(o);e.push(h);return e;}else if(s===g._uploadingStatus&&!(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9)){j="terminateButton";k=this._createDeleteButton(I,j,i,this.sErrorState,t);e.push(k);return e;}else{E=i.getEnableEdit();if(this.sErrorState==="Error"){E=false;}l=sap.ui.getCore().byId(I+"-editButton");if(!l){if(i.getVisibleEdit()){l=new sap.m.Button({id:I+"-editButton",icon:"sap-icon://edit",type:sap.m.ButtonType.Standard,enabled:E,visible:i.getVisibleEdit(),tooltip:this._oRb.getText("UPLOADCOLLECTION_EDITBUTTON_TEXT"),press:[i,this._handleEdit,this]}).addStyleClass("sapMUCEditBtn");e.push(l);}}else if(!i.getVisibleEdit()){l.destroy();l=null;}else{l.setEnabled(E);l.setVisible(i.getVisibleEdit());e.push(l);}j="deleteButton";if(i.getVisibleDelete()){k=this._createDeleteButton(I,j,i,this.sErrorState,t);e.push(k);}else{k=sap.ui.getCore().byId(I+"-"+j);if(!!k){k.destroy();k=null;}}return e;}};g.prototype._createDeleteButton=function(i,s,I,e,t){var E,o;E=I.getEnableDelete();if(e==="Error"){E=false;}o=sap.ui.getCore().byId(i+"-"+s);if(!o){o=new sap.m.Button({id:i+"-"+s,icon:"sap-icon://sys-cancel",type:sap.m.ButtonType.Standard,enabled:E,tooltip:this._oRb.getText("UPLOADCOLLECTION_TERMINATEBUTTON_TEXT"),visible:I.getVisibleDelete()}).addStyleClass("sapMUCDeleteBtn");if(s==="deleteButton"){o.setTooltip(this._oRb.getText("UPLOADCOLLECTION_DELETEBUTTON_TEXT"));o.attachPress(function(h){this._handleDelete(h,t);}.bind(t));}else if(s==="terminateButton"){o.attachPress(function(h){this._handleTerminate.bind(this)(h,I);}.bind(t));}}else{o.setEnabled(E);o.setVisible(I.getVisibleDelete());}return o;};g.prototype._fillList=function(i){var t=this;var m=i.length-1;q.each(i,function(I,o){if(!o._status){o._status=g._displayStatus;}if(!o._percentUploaded&&o._status===g._uploadingStatus){o._percentUploaded=0;}var l=t._mapItemToListItem(o);if(I===0&&m===0){l.addStyleClass("sapMUCListSingleItem");}else if(I===0){l.addStyleClass("sapMUCListFirstItem");}else if(I===m){l.addStyleClass("sapMUCListLastItem");}else{l.addStyleClass("sapMUCListItem");}t._oList.addAggregation("items",l,true);});};g.prototype._clearList=function(){if(this._oList){this._oList.destroyAggregation("items",true);}};g.prototype._getNumberOfAttachmentsTitle=function(i){var n=i||0;var t;if(this.getNumberOfAttachmentsText()){t=this.getNumberOfAttachmentsText();}else{t=this._oRb.getText("UPLOADCOLLECTION_ATTACHMENTS",[n]);}if(!this.oNumberOfAttachmentsTitle){this.oNumberOfAttachmentsTitle=new sap.m.Title(this.getId()+"-numberOfAttachmentsTitle",{text:t});}else{this.oNumberOfAttachmentsTitle.setText(t);}return this.oNumberOfAttachmentsTitle;};g.prototype._handleDelete=function(e,o){var p=e.getParameters();var I=o.getAggregation("items");var s=p.id.split("-deleteButton")[0];var h=null;var j="";var k;var m;o.sDeletedItemId=s;for(var i=0;i<I.length;i++){if(I[i].sId===s){h=i;break;}}if(q.sap.byId(o.sId).hasClass("sapUiSizeCompact")){j="sapUiSizeCompact";}if(o.editModeItem){sap.m.UploadCollection.prototype._handleOk(e,o,o.editModeItem,true);if(o.sErrorState==="Error"){return this;}}if(!!I[h]){k=I[h].getFileName();if(!k){m=this._oRb.getText("UPLOADCOLLECTION_DELETE_WITHOUT_FILENAME_TEXT");}else{m=this._oRb.getText("UPLOADCOLLECTION_DELETE_TEXT",k);}o._oItemForDelete=I[h];o._oItemForDelete._iLineNumber=h;sap.m.MessageBox.show(m,{title:this._oRb.getText("UPLOADCOLLECTION_DELETE_TITLE"),actions:[sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],onClose:o._onCloseMessageBoxDeleteItem.bind(o),dialogId:"messageBoxDeleteFile",styleClass:j});}};g.prototype._onCloseMessageBoxDeleteItem=function(A){this._oItemForDelete._status=g._toBeDeletedStatus;if(A===sap.m.MessageBox.Action.OK){if(this.getInstantUpload()){this.fireFileDeleted({documentId:this._oItemForDelete.getDocumentId(),item:this._oItemForDelete});}else{this._aDeletedItemForPendingUpload.push(this._oItemForDelete);this.aItems.splice(this._oItemForDelete._iLineNumber,1);this.removeAggregation("items",this._oItemForDelete,false);}}};g.prototype._handleTerminate=function(e,I){var o,h;o=new sap.m.List({items:[new sap.m.StandardListItem({title:I.getFileName(),icon:this._getIconFromFilename(I.getFileName())})]});h=new sap.m.Dialog({id:this.getId()+"deleteDialog",title:this._oRb.getText("UPLOADCOLLECTION_TERMINATE_TITLE"),content:[new sap.m.Text({text:this._oRb.getText("UPLOADCOLLECTION_TERMINATE_TEXT")}),o],buttons:[new sap.m.Button({text:this._oRb.getText("UPLOADCOLLECTION_OKBUTTON_TEXT"),press:[j,this]}),new sap.m.Button({text:this._oRb.getText("UPLOADCOLLECTION_CANCELBUTTON_TEXT"),press:function(){h.close();}})],afterClose:function(){h.destroy();}}).open();function j(){var A=false;for(var i=0;i<this.aItems.length;i++){if(this.aItems[i]._status===g._uploadingStatus&&this.aItems[i]._requestIdName===I._requestIdName){this.aItems[i]._status=g._toBeDeletedStatus;A=true;break;}else if(I.getFileName()===this.aItems[i].getFileName()&&this.aItems[i]._status===g._displayStatus){this.aItems[i]._status=g._toBeDeletedStatus;this.fireFileDeleted({documentId:this.aItems[i].getDocumentId(),item:this.aItems[i]});break;}}if(A){this._getFileUploader().abort(this._headerParamConst.fileNameRequestIdName,this._encodeToAscii(I.getFileName())+this.aItems[i]._requestIdName);}h.close();this.invalidate();}};g.prototype._handleEdit=function(e,I){var i,s=I.getId(),h=this.aItems.length;if(this.editModeItem){sap.m.UploadCollection.prototype._handleOk(e,this,this.editModeItem,false);}if(this.sErrorState!=="Error"){for(i=0;i<h;i++){if(this.aItems[i].getId()===s){this.aItems[i]._status="Edit";break;}}I._status="Edit";this.editModeItem=e.getSource().getId().split("-editButton")[0];this.invalidate();}};g.prototype._handleClick=function(e,o,s){if(e.target.id.lastIndexOf("editButton")<0){if(e.target.id.lastIndexOf("cancelButton")>0){sap.m.UploadCollection.prototype._handleCancel(e,o,s);}else if(e.target.id.lastIndexOf("ia_imageHL")<0&&e.target.id.lastIndexOf("ia_iconHL")<0&&e.target.id.lastIndexOf("deleteButton")<0&&e.target.id.lastIndexOf("ta_editFileName-inner")<0){if(e.target.id.lastIndexOf("cli")>0){o.sFocusId=e.target.id;}sap.m.UploadCollection.prototype._handleOk(e,o,s,true);}}};g.prototype._handleOk=function(e,o,s,t){var T=true;var E=document.getElementById(s+"-ta_editFileName-inner");var n;var S=s.split("-").pop();var h=o.aItems[S].getProperty("fileName");var i=g.prototype._splitFilename(h);var I=sap.ui.getCore().byId(s+"-ta_editFileName");var j=o.aItems[S].errorState;var k=o.aItems[S].changedFileName;if(E!==null){n=E.value.replace(/^\s+/,"");}var l=e.srcControl?e.srcControl.getId().split("-"):e.oSource.getId().split("-");l=l.slice(0,3);o.sFocusId=l.join("-")+"-cli";if(n&&(n.length>0)){o.aItems[S]._status=g._displayStatus;if(i.name!==n){if(!o.getSameFilenameAllowed()){if(sap.m.UploadCollection.prototype._checkDoubleFileName(n+i.extension,o.aItems)){I.setProperty("valueState","Error",true);o.aItems[S]._status="Edit";o.aItems[S].errorState="Error";o.aItems[S].changedFileName=n;o.sErrorState="Error";T=false;if(j!=="Error"||k!==n){o.invalidate();}}else{I.setProperty("valueState","None",true);o.aItems[S].errorState=null;o.aItems[S].changedFileName=null;o.sErrorState=null;o.editModeItem=null;if(t){o.invalidate();}}}if(T){o._oItemForRename=o.aItems[S];o._onEditItemOk.bind(o)(n+i.extension);}}else{o.sErrorState=null;o.aItems[S].errorState=null;o.editModeItem=null;if(t){o.invalidate();}}}else if(E!==null){o.aItems[S]._status="Edit";o.aItems[S].errorState="Error";o.aItems[S].changedFileName=n;o.sErrorState="Error";if(j!=="Error"||k!==n){o.aItems[S].invalidate();}}};g.prototype._onEditItemOk=function(n){if(this._oItemForRename){this._oItemForRename.setFileName(n);this.fireFileRenamed({documentId:this._oItemForRename.getProperty("documentId"),fileName:n,item:this._oItemForRename});}delete this._oItemForRename;};g.prototype._handleCancel=function(e,o,s){var S=s.split("-").pop();o.aItems[S]._status=g._displayStatus;o.aItems[S].errorState=null;o.aItems[S].changedFileName=sap.ui.getCore().byId(s+"-ta_editFileName").getProperty("value");o.sFocusId=o.editModeItem+"-cli";o.sErrorState=null;o.editModeItem=null;o.invalidate();};g.prototype._onChange=function(e){if(e){var t=this;var r,h,i,s,I,S,j,A;this._cAddItems=0;if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9){var n=e.getParameter("newValue");if(!n){return;}s=n.split(/\" "/)[0];if(s.length===0){return;}}else{h=e.getParameter("files").length;if(h===0){return;}this._oFileUploader.removeAllAggregation("headerParameters",true);this.removeAllAggregation("headerParameters",true);}this._oFileUploader.removeAllAggregation("parameters",true);this.removeAllAggregation("parameters",true);if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9){var o={name:e.getParameter("newValue")};var p={files:[o]};this.fireChange({getParameter:function(l){if(l==="files"){return[o];}},getParameters:function(){return p;},mParameters:p,files:[o]});}else{this.fireChange({getParameter:function(l){if(l){return e.getParameter(l);}},getParameters:function(){return e.getParameters();},mParameters:e.getParameters(),files:e.getParameter("files")});}var P=this.getAggregation("parameters");if(P){q.each(P,function(l,m){var u=new sap.ui.unified.FileUploaderParameter({name:m.getProperty("name"),value:m.getProperty("value")});t._oFileUploader.addParameter(u);});}if(!this.getInstantUpload()){S=g._pendingUploadStatus;}else{S=g._uploadingStatus;}if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9){I=new sap.m.UploadCollectionItem({fileName:s});I._status=S;I._internalFileIndexWithinFileUploader=1;if(!this.getInstantUpload()){I.setAssociation("fileUploader",this._oFileUploader,true);this.insertItem(I);this._aFileUploadersForPendingUpload.push(this._oFileUploader);}else{I._percentUploaded=0;}this.aItems.unshift(I);this._cAddItems++;}else{this._requestIdValue=this._requestIdValue+1;r=this._requestIdValue.toString();var k=this.getAggregation("headerParameters");if(!this.getInstantUpload()){this._aFileUploadersForPendingUpload.push(this._oFileUploader);}for(i=0;i<h;i++){I=new sap.m.UploadCollectionItem({fileName:e.getParameter("files")[i].name});I._status=S;I._internalFileIndexWithinFileUploader=i+1;I._requestIdName=r;if(!this.getInstantUpload()){I.setAssociation("fileUploader",this._oFileUploader,true);j=this._oFormatDecimal.format(e.getParameter("files")[i].size);A=new O({text:j});I.insertAggregation("attributes",A,true);this.insertItem(I);}else{I._percentUploaded=0;}this.aItems.unshift(I);this._cAddItems++;}if(k){q.each(k,function(l,m){t._oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({name:m.getProperty("name"),value:m.getProperty("value")}));});}t._oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({name:this._headerParamConst.requestIdName,value:r}));}}};g.prototype._onFilenameLengthExceed=function(e){var o={name:e.getParameter("fileName")};var h=[o];this.fireFilenameLengthExceed({getParameter:function(p){if(p){return e.getParameter(p);}},getParameters:function(){return e.getParameters();},mParameters:e.getParameters(),files:h});};g.prototype._onFileSizeExceed=function(e){var o;if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9){var s=e.getParameter("newValue");o={name:s};var p={newValue:s,files:[o]};this.fireFileSizeExceed({getParameter:function(P){if(P==="files"){return[o];}else if(P==="newValue"){return s;}},getParameters:function(){return p;},mParameters:p,files:[o]});}else{o={name:e.getParameter("fileName"),fileSize:e.getParameter("fileSize")};this.fireFileSizeExceed({getParameter:function(P){if(P){return e.getParameter(P);}},getParameters:function(){return e.getParameters();},mParameters:e.getParameters(),files:[o]});}};g.prototype._onTypeMissmatch=function(e){var o={name:e.getParameter("fileName"),fileType:e.getParameter("fileType"),mimeType:e.getParameter("mimeType")};var h=[o];this.fireTypeMissmatch({getParameter:function(p){if(p){return e.getParameter(p);}},getParameters:function(){return e.getParameters();},mParameters:e.getParameters(),files:h});};g.prototype._onUploadTerminated=function(e){var i;var r=this._getRequestId(e);var s=e.getParameter("fileName");var h=this.aItems.length;for(i=0;i<h;i++){if(this.aItems[i]===s&&this.aItems[i]._requestIdName===r&&this.aItems[i]._status===g._uploadingStatus){this.aItems.splice(i,1);this.removeItem(i);break;}}this.fireUploadTerminated({fileName:s,getHeaderParameter:this._getHeaderParameterWithinEvent.bind(e)});};g.prototype._onUploadComplete=function(e){if(e){var i,r,u,h,j=l();r=this._getRequestId(e);u=e.getParameter("fileName");if(!u){var k=(e.getSource().getProperty("value")).split(/\" "/);u=k[0];}h=this.aItems.length;for(i=0;i<h;i++){if(!r){if(this.aItems[i].getProperty("fileName")===u&&this.aItems[i]._status===g._uploadingStatus&&j){this.aItems[i]._percentUploaded=100;this.aItems[i]._status=g._displayStatus;break;}else if(this.aItems[i].getProperty("fileName")===u&&this.aItems[i]._status===g._uploadingStatus){this.aItems.splice(i,1);}}else if(this.aItems[i].getProperty("fileName")===u&&this.aItems[i]._requestIdName===r&&this.aItems[i]._status===g._uploadingStatus&&j){this.aItems[i]._percentUploaded=100;this.aItems[i]._status=g._displayStatus;break;}else if(this.aItems[i].getProperty("fileName")===u&&this.aItems[i]._requestIdName===r&&this.aItems[i]._status===g._uploadingStatus){this.aItems.splice(i,1);break;}}this.fireUploadComplete({getParameter:e.getParameter,getParameters:e.getParameters,mParameters:e.getParameters(),files:[{fileName:e.getParameter("fileName")||u,responseRaw:e.getParameter("responseRaw"),reponse:e.getParameter("response"),status:e.getParameter("status"),headers:e.getParameter("headers")}]});}function l(){var R=e.getParameter("status").toString()||"200";if(R[0]==="2"||R[0]==="3"){return true;}else{return false;}}};g.prototype._onUploadProgress=function(e){if(e){var i,u,p,P,r,h,o,I,$;u=e.getParameter("fileName");r=this._getRequestId(e);P=Math.round(e.getParameter("loaded")/e.getParameter("total")*100);if(P===100){P=P-1;}p=this._oRb.getText("UPLOADCOLLECTION_UPLOADING",[P]);h=this.aItems.length;for(i=0;i<h;i++){if(this.aItems[i].getProperty("fileName")===u&&this.aItems[i]._requestIdName==r&&this.aItems[i]._status===g._uploadingStatus){o=sap.ui.getCore().byId(this.aItems[i].getId()+"-ta_progress");if(!!o){o.setText(p);this.aItems[i]._percentUploaded=P;I=this.aItems[i].getId();$=q.sap.byId(I+"-ia_indicator");$.attr("aria-valuenow",P);break;}}}}};g.prototype._getRequestId=function(e){var h;h=e.getParameter("requestHeaders");if(!h){return null;}for(var j=0;j<h.length;j++){if(h[j].name===this._headerParamConst.requestIdName){return h[j].value;}}};g.prototype._getFileUploader=function(){var t=this,u=this.getInstantUpload();if(!u||!this._oFileUploader){var s=(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9)?false:true;this._iFUCounter=this._iFUCounter+1;this._oFileUploader=new sap.ui.unified.FileUploader(this.getId()+"-"+this._iFUCounter+"-uploader",{buttonOnly:true,buttonText:" ",enabled:this.getUploadEnabled(),fileType:this.getFileType(),icon:"sap-icon://add",iconFirst:false,style:"Transparent",maximumFilenameLength:this.getMaximumFilenameLength(),maximumFileSize:this.getMaximumFileSize(),mimeType:this.getMimeType(),multiple:this.getMultiple(),name:"uploadCollection",uploadOnChange:u,sameFilenameAllowed:true,uploadUrl:this.getUploadUrl(),useMultipart:false,sendXHR:s,change:function(e){t._onChange(e);},filenameLengthExceed:function(e){t._onFilenameLengthExceed(e);},fileSizeExceed:function(e){t._onFileSizeExceed(e);},typeMissmatch:function(e){t._onTypeMissmatch(e);},uploadAborted:function(e){t._onUploadTerminated(e);},uploadComplete:function(e){t._onUploadComplete(e);},uploadProgress:function(e){if(t.getInstantUpload()){t._onUploadProgress(e);}},uploadStart:function(e){t._onUploadStart(e);}});var T=this._oFileUploader.getTooltip();if(!T&&!sap.ui.Device.browser.msie){this._oFileUploader.setTooltip(" ");}}return this._oFileUploader;};g.prototype._onUploadStart=function(e){var r={},i,R,p,s,G;this._iUploadStartCallCounter++;p=e.getParameter("requestHeaders").length;for(i=0;i<p;i++){if(e.getParameter("requestHeaders")[i].name===this._headerParamConst.requestIdName){R=e.getParameter("requestHeaders")[i].value;break;}}s=e.getParameter("fileName");r={name:this._headerParamConst.fileNameRequestIdName,value:this._encodeToAscii(s)+R};e.getParameter("requestHeaders").push(r);var h=this._aDeletedItemForPendingUpload.length;for(i=0;i<h;i++){if(this._aDeletedItemForPendingUpload[i].getAssociation("fileUploader")===e.oSource.sId&&this._aDeletedItemForPendingUpload[i].getFileName()===s&&this._aDeletedItemForPendingUpload[i]._internalFileIndexWithinFileUploader===this._iUploadStartCallCounter){e.getSource().abort(this._headerParamConst.fileNameRequestIdName,this._encodeToAscii(s)+R);return;}}this.fireBeforeUploadStarts({fileName:s,addHeaderParameter:j,getHeaderParameter:k.bind(this)});if(q.isArray(G)){for(var i=0;i<G.length;i++){if(e.getParameter("requestHeaders")[i].name===G[i].getName()){e.getParameter("requestHeaders")[i].value=G[i].getValue();}}}else if(G instanceof sap.m.UploadCollectionParameter){for(var i=0;i<e.getParameter("requestHeaders").length;i++){if(e.getParameter("requestHeaders")[i].name===G.getName()){e.getParameter("requestHeaders")[i].value=G.getValue();break;}}}function j(u){var r={name:u.getName(),value:u.getValue()};e.getParameter("requestHeaders").push(r);}function k(l){G=this._getHeaderParameterWithinEvent.bind(e)(l);return G;}};g.prototype._getIconFromFilename=function(s){var e=this._splitFilename(s).extension;if(q.type(e)==="string"){e=e.toLowerCase();}switch(e){case'.bmp':case'.jpg':case'.jpeg':case'.png':return g._placeholderCamera;case'.csv':case'.xls':case'.xlsx':return'sap-icon://excel-attachment';case'.doc':case'.docx':case'.odt':return'sap-icon://doc-attachment';case'.pdf':return'sap-icon://pdf-attachment';case'.ppt':case'.pptx':return'sap-icon://ppt-attachment';case'.txt':return'sap-icon://document-text';default:return'sap-icon://document';}};g.prototype._getThumbnail=function(t,s){if(t){return t;}else{return this._getIconFromFilename(s);}};g.prototype._triggerLink=function(e,o){var l=null;var i;if(o.editModeItem){sap.m.UploadCollection.prototype._handleOk(e,o,o.editModeItem,true);if(o.sErrorState==="Error"){return this;}o.sFocusId=e.getParameter("id");}i=e.oSource.getId().split("-");l=i[i.length-2];sap.m.URLHelper.redirect(o.aItems[l].getProperty("url"),true);};g.prototype.onkeydown=function(e){switch(e.keyCode){case q.sap.KeyCodes.F2:sap.m.UploadCollection.prototype._handleF2(e,this);break;case q.sap.KeyCodes.ESCAPE:sap.m.UploadCollection.prototype._handleESC(e,this);break;case q.sap.KeyCodes.DELETE:sap.m.UploadCollection.prototype._handleDEL(e,this);break;case q.sap.KeyCodes.ENTER:sap.m.UploadCollection.prototype._handleENTER(e,this);break;default:return;}e.setMarked();};g.prototype._setFocusAfterDeletion=function(e,o){if(!e){return;}var l=o.aItems.length;var s=null;if(l===0){var h=q.sap.byId(o._oFileUploader.sId);var i=h.find(":button");q.sap.focus(i);}else{var j=e.split("-").pop();if((l-1)>=j){s=e+"-cli";}else{s=o.aItems.pop().sId+"-cli";}sap.m.UploadCollection.prototype._setFocus2LineItem(s);}};g.prototype._setFocus2LineItem=function(s){if(!s){return;}var $=q.sap.byId(s);q.sap.focus($);};g.prototype._handleENTER=function(e,o){var t;var l;var h;if(o.editModeItem){t=e.target.id.split(o.editModeItem).pop();}else{t=e.target.id.split("-").pop();}switch(t){case"-ta_editFileName-inner":case"-okButton":sap.m.UploadCollection.prototype._handleOk(e,o,o.editModeItem,true);break;case"-cancelButton":e.preventDefault();sap.m.UploadCollection.prototype._handleCancel(e,o,o.editModeItem);break;case"-ia_iconHL":case"-ia_imageHL":var i=o.editModeItem.split("-").pop();sap.m.URLHelper.redirect(o.aItems[i].getProperty("url"),true);break;case"ia_iconHL":case"ia_imageHL":case"cli":l=e.target.id.split(t)[0]+"ta_filenameHL";h=sap.ui.getCore().byId(l);if(h.getEnabled()){i=e.target.id.split("-")[2];sap.m.URLHelper.redirect(o.aItems[i].getProperty("url"),true);}break;default:return;}};g.prototype._handleDEL=function(e,o){if(!o.editModeItem){var h=q.sap.byId(e.target.id);var i=h.find("[id$='-deleteButton']");var j=sap.ui.getCore().byId(i[0].id);j.firePress();}};g.prototype._handleESC=function(e,o){if(o.editModeItem){o.sFocusId=o.editModeItem+"-cli";o.aItems[o.editModeItem.split("-").pop()]._status=g._displayStatus;sap.m.UploadCollection.prototype._handleCancel(e,o,o.editModeItem);}};g.prototype._handleF2=function(e,o){var h=sap.ui.getCore().byId(e.target.id);var i=q.sap.byId(e.target.id);if(h!==undefined){if(h._status===g._displayStatus){i=q.sap.byId(e.target.id);var j=i.find("[id$='-editButton']");var E=sap.ui.getCore().byId(j[0].id);if(E.getEnabled()){if(o.editModeItem){sap.m.UploadCollection.prototype._handleClick(e,o,o.editModeItem);}if(o.sErrorState!=="Error"){E.firePress();}}}else{sap.m.UploadCollection.prototype._handleClick(e,o,o.editModeItem);}}else if(e.target.id.search(o.editModeItem)===0){sap.m.UploadCollection.prototype._handleOk(e,o,o.editModeItem,true);}};g.prototype._getFileNames=function(s){if(this.getMultiple()&&!(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<=9)){return s.substring(1,s.length-2).split(/\" "/);}else{return s.split(/\" "/);}};g.prototype._checkDoubleFileName=function(s,I){if(I.length===0||!s){return false;}var l=I.length;s=s.replace(/^\s+/,"");for(var i=0;i<l;i++){if(s===I[i].getProperty("fileName")){return true;}}return false;};g.prototype._splitFilename=function(s){var r={};var n=s.split(".");if(n.length==1){r.extension="";r.name=n.pop();return r;}r.extension="."+n.pop();r.name=n.join(".");return r;};g.prototype._getAriaLabelForPicture=function(i){var t;t=(i.getAriaLabelForPicture()||i.getFileName());return t;};g.prototype._getHeaderParameterWithinEvent=function(h){var u=[];var r=this.getParameter("requestHeaders");var p=r.length;if(r&&h){for(i=0;i<p;i++){if(r[i].name===h){return new sap.m.UploadCollectionParameter({name:r[i].name,value:r[i].value});}}}else{if(r){for(var i=0;i<p;i++){u.push(new sap.m.UploadCollectionParameter({name:r[i].name,value:r[i].value}));}}return u;}};g.prototype._encodeToAscii=function(v){var e="";for(var i=0;i<v.length;i++){e=e+v.charCodeAt(i);}return e;};return g;},true);
