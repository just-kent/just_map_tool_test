sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/UpdateMethod"
], function(Controller) {
	"use strict";
	var oview1Model;
	var oview1Model2;
	return Controller.extend("xsa.just_map_tool_ui.controller.View1", {

		onInit: function(oEvent) {
			//1. Initialize Model
			oview1Model = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: "just_map_hdr.xsodata",
				defaultBindingMode: "TwoWay",
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});

			oview1Model2 = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: "just_map_hdr2.xsodata",
				defaultBindingMode: "TwoWay",
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});

			this.getView().setModel(oview1Model2, "just_map_hdr1");
			//	this.getView().setModel(oview1Model2, "just_map_hdr2");

			/*var oTable = this.getView().byId("just_map_list");
			oTable.setModel(oview1Model2, "just_map_hdr2");
			oTable.bindAggregation("columns", "just_map_hdr1>/just_map_hdr2Parameters(IP_TABLE_ID='10')/Results", function(index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().OBJ_ID
					})
				});
			});

			oTable.bindItems("just_map_hdr1>/just_map_data2", function(index, context) {
				var obj = context.getObject();
				var row = new sap.m.ColumnListItem();

				for (var k in obj) {
					if((typeof obj[k] === 'object') == false){
					row.addCell(new sap.m.Input({
						value: obj[k],
						editable: true
					}));
					}
				}

				return row;
			});*/

		},
		onTabIdSelect: function() {
			var tabid = this.getView().byId("i_tabid").getValue();
			var oTable = this.getView().byId("just_map_list");
			oTable.setModel(oview1Model2, "just_map_data");
			oTable.bindAggregation("columns", "just_map_hdr1>/just_map_hdr2Parameters(IP_TABLE_ID='" + tabid + "')/Results", function(index,
				context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().OBJ_ID
					})
				});
			});

			oTable.getBinding("columns").sort(new sap.ui.model.Sorter("OBJ_SEQ"));
			var la_filters = new Array(); // Don't normally do this but just for the example.

			var filterByTabId = new sap.ui.model.Filter({
				path: "TABLE_ID",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: tabid
			});
			la_filters.push(filterByTabId);

			//var list = sap.ui.getCore().byId("listid");

			//var binding = list.getBinding("items");

			//binding.filter(filters);

			oTable.getModel("just_map_data").read("/just_map_data", {
				filters: la_filters,
				success: function(oData, oResponse) {

					console.log("successfilter!!!");
					oTable.getModel("just_map_data").refresh(true);
					oTable.bindItems("just_map_hdr1>/just_map_data", function(index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();

						for (var k in obj) {
							if (((typeof obj[k] === 'object') == false) && ((k != 'TABLE_ID') && (k != 'SEQ_ID'))) {
								row.addCell(new sap.m.Input({
									value: obj[k],
									editable: true
								}));
							}
						}

						return row;
					});

					var binding = oTable.getBinding("items");
					binding.filter(la_filters);
				},
				error: function(oError) {
					console.log("error filter!!!");
				}
			});

		},
		handleSaveBtn: function(event) {
			oview1Model2.setUseBatch(true);
			var myTable = this.getView().byId("just_map_list");
			var tabModel = this.getView().byId("just_map_list").getModel("just_map_data");
			//tabModel.updateBindings();
			var aContexts = myTable.getItems().map(function(oItem) {
				return oItem.getBindingContext("just_map_hdr1").getPath(); // binding path
			});

			//iterate over the context array and change values in the model
			var ctxno = 0;
			aContexts.forEach(function(sPath) {
				var oEntry = {};
				var data_length = myTable.getItems()[ctxno].getCells().length;
				for (var i = 0; i < data_length; i++) {
					var newval = myTable.getItems()[ctxno].getCells()[i].mProperties.value;
					var fldno = i + 1;
					var fldname = "";
					if (fldno < 10) {
						fldname = "FLD_0";
					} else {
						fldname = "FLD_";
					}
					var fld = fldname + fldno;
					oEntry[fld] = newval;
					//oview1Model2.setProperty(sPath + fldname + fldno, newval);
				}
				oview1Model2.update(sPath, oEntry, {
					method: "POST",
					success: function(oData) {
						sap.m.MessageToast.show("success sent!");
					},
					error: function(oError) {
						sap.m.MessageToast.show("Error Saving Entries!!");
					}
				});
				//this.getView().byId("just_map_list").getItems()[0].getCells()[1].mProperties.value;
				ctxno = ctxno + 1;
			});
			/*oview1Model2.createEntry("just_map_data", {
					properties: {
						TABLE_ID : '0030',
						SEQ_ID :  '1',
						FLD_01 : 'MY01',
						FLD_02 : 'SERP',
						FLD_03 : 'MY'
					}
				});*/

			/*oview1Model2.setDeferredGroups(["myGroupId"]);
			oview1Model2.setChangeGroups({
				"EntityTypeName": {
					groupId: "myGroupId",
					changeSetId: "ID",
					single: true
				}
			});*/

			//var oModel = new sap.ui.model.odata.ODataModel(‘/MyBlogProject/services / post.xsodata / ’, false);

			//we create an object to be passed as a JSON object
			/*var oEntry = {};
				
			//we add to the JSON object the values of the columns of the row we want to update
			oEntry.TABLE_ID = "0020";
			oEntry.FLD_01 = "SG01";
			oEntry.FLD_02 = "SB";
			oEntry.FLD_03 = "";
			oEntry.FLD_04 = "";
			oEntry.FLD_05 = "";
			oEntry.FLD_06 = "";
			oEntry.FLD_07 = "";
			oEntry.FLD_08 = "";
			oEntry.FLD_09 = "";
			oEntry.FLD_10 = "";
			oEntry.FLD_11 = "";
			oEntry.FLD_12 = "";
			oEntry.FLD_13 = "";
			oEntry.FLD_14 = "";
			oEntry.FLD_15 = "";
			oEntry.SEQ_ID = "01";

			//we perform the update request using the update() method of the model. Here we have to specify the “ID” of the post we want to update
			oview1Model2.update("/just_map_data(TABLE_ID='0020',FLD_01='SG01',FLD_02='SG',FLD_03='',SEQ_ID='01')", oEntry, null, function() {
					alert("Success");
				},
				function() {
					alert("FAIL");
				});*/

			oview1Model2.submitChanges({
				//groupId: "myGroupId",
				success: function(oData, response) {
					sap.m.MessageToast.show("Success Saving Entries!");
				},
				error: function(oError) {
					sap.m.MessageToast.show("Error Saving Entries!!");
				}
			});
		}
	});
});