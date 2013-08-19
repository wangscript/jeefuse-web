$(function(){
	var w = $("#first-content").outerWidth(true);
	var mainheight = document.documentElement.clientHeight;
	var gridpm = 58; //GridHead，toolbar，footer,gridmargin
	var h = mainheight - gridpm-$("#header").outerHeight(true);
    var option = {
        height: h, 
        width: w,
        url: ctx+'/system/security/gsysResource/listOutJson.vhtml',
        colModel: [
		   { display: '名称',name: 'name',width: 116, sortable: true, align: 'left'}
		   ,{ display: '描述',name: 'descript',width: 256, sortable: true, align: 'left'}
		   ,{ display: '值',name: 'value',width: 256, sortable: true, align: 'left'}
		   ,{ display: '类型',name: 'type',width: 116, sortable: true, align: 'left',process:formatResourceType}
		],      
 		sortname: "id",
		sortorder: "desc",
		searchparam:searchparamsCall,
		//title: '数据例表',
		minColToggle: 1, 
		showTableToggleBtn: false,
		autoload: true,
		resizable: false, 
		showcheckbox: true,
		usepager: true,
		indexId:'id',
		showseq:true,
		gridClass: "bbit-grid",
        rowhandler: gridContextmenu,
		rowbinddata: false,
		onRowDblclick:onRowDblclick
    };
    //search params
    function searchparamsCall(){
		var params=$("#firstSearchForm").serializeArray();
     	return params;
	}
	//format
	
	function formatResourceType(value, row) {
		return ResourceTypeJson[value];
	}

    grid = $("#dataGrid").flexigrid(option);
	
	newWin=$('#new-win').window({
   		width:goolov.winWidth(560),
		height:goolov.winHeight(360),
		closed:true,
		minimizable:false,
		maximizable:false,
		resizable:false
		//modal:true
	});
	editWin=$('#edit-win').window({
		width:goolov.winWidth(560),
		height:goolov.winHeight(360),
		closed:true,
		minimizable:false,
		maximizable:false,
		resizable:false
		//modal:true
	});
	importExcelWin=$('#importExcelWin').window({
		width:goolov.winWidth(560),
		height:goolov.winHeight(320),
		closed:true,
		minimizable:false,
		maximizable:false,
		resizable:false
		//modal:true
	});
});
var grid;

/******contenxtmenu*****/
var menu = {
		width : 150,
		items : [ {
			text : "新增",
			icon : ctx+"/resources/style/default/contextmenu/images/view.png",
			alias : "contextmenu-add",
			action : gridContextmenuClick
		}, {
			text : "编辑",
			icon : ctx+"/resources/style/default/contextmenu/images/edit.png",
			alias : "contextmenu-edit",
			action : gridContextmenuClick
		},  {
			text : "删除所选记录",
			icon : ctx+"/resources/style/default/contextmenu/images/rowdelete.png",
			alias : "contextmenu-deleteSels",
			action : gridContextmenuClick
		},  {
			text : "删除所有记录",
			icon : ctx+"/resources/style/default/contextmenu/images/rowdelete.png",
			alias : "contextmenu-deleteAll",
			action : gridContextmenuClick
		},{
			text : "刷新",
			icon : ctx+"/resources/style/default/contextmenu/images/table_refresh.png",
			alias : "contextmenu-refresh",
			action : gridContextmenuClick
		}]
	};
function gridContextmenuClick(target) {
	var id = $(target).attr("id").substr(3);
	//var ch = $(target).attr("ch").substr(3);
	//var cell = ch.split("_FG$SP_");
	var rowIdx = $(target).attr("seq");
	var cmd = this.data.alias;
	switch(cmd){
		case 'contextmenu-add':
			openNewWin();
			break;
		case 'contextmenu-edit':
			var title = 'GsysResource管理>编辑 (序号:' + rowIdx + ')';
			var url = ctx + '/system/security/gsysFunction/edit.vhtml?id=' + id;
			openEditWin({title : title,url : url});
			break;
		case 'contextmenu-deleteSels':
			delData();
			break;
		case 'contextmenu-deleteAll':
			delAllData();
			break;
		default:
			grid.flexReload();
	}
};
function gridContextmenu(row) {
	$(row).contextmenu(menu);
} 

/******Add new data window  *******/
var newWin;
function newData(){
	openNewWin();
}
function openNewWin(title,url){
	newWin.window({zIndex:$.fn.window.defaults.zIndex++});
	newWin.window('open');
	newWin.window('setTitle',title?title:'GsysResource管理>新增');
	goolov.loadIFrame("new-win-content",url?url:ctx+'/system/security/gsysResource/input.vhtml');
}
function closeNewWin(){
	newWin.window('close');
}
function closeNewWinAndRefresh(){
	closeNewWin();
	refresh();
}
/******Edit data window  *******/
var editWin;
function onRowDblclick(target){
	var id = $(target).attr("id").substr(3);
	var rowIdx=$(target).attr("seq");
	var title='GsysResource管理>编辑 (序号:'+rowIdx+')';
	var url=ctx+'/system/security/gsysResource/edit.vhtml?id='+id;
	openEditWin(title,url);
}
function editData(){
	var ids=grid.getCheckedRows();
	var selCount=ids.length;
	if (selCount== 0) {
		goolov.msgbox.show('请先选择修改的记录,或双击需要编辑的行.');
		return;
	}
	if(selCount>1){
		goolov.msgbox.show('一次只能选择修改一项记录.');
		return;
	}
	var id=ids[0];
	var rowtr=$('#row' + id, grid)[0];
	var rowIdx=$(rowtr).attr("seq");
	var title='GsysResource管理>编辑 (序号:'+rowIdx+')';
	var url=ctx+'/system/security/gsysResource/edit.vhtml?id='+ids[0];
	openEditWin(title,url);
}
function openEditWin(title,url){
	editWin.window({zIndex:$.fn.window.defaults.zIndex++});
	editWin.window('open');
	editWin.window('setTitle',title);
	goolov.loadIFrame("edit-win-content",url);
}
function closeEditWin(){
	editWin.window('close');
}
function closeEditWinAndRefresh(){
	closeEditWin();
	refresh();
}
/******del data   *******/
function delData(){
	var ids=grid.getCheckedRows();
	var selCount=ids.length;
	if (selCount== 0) {
		goolov.msgbox.show('请先选择删除的记录.');
		return;
	}
	goolov.msgbox.confirm('删除确认','您确认删除这'+selCount+'项记录吗?删除后将不可恢复!',function(r){
		if(r){
			$.ajax({
					type : 'post',
					url : ctx+'/system/security/gsysResource/deleteOutJson.vhtml',
					data : {id:ids.join(',')},
					dataType:'json',
					beforeSend :function() {
						goolov.growl.waiting('正在删除中!请稍后...');
					},
					success : function(result) {
						goolov.growl.unwaiting();
						if (result&&result.success) {
							goolov.growl.success(result.message);
							refresh();
						}else if(result&&result.message){
							goolov.msgbox.error(result.message);
						}else{
							goolov.msgbox.error();
						}
					},
					error:function(request,status,errorThrown) {
						goolov.growl.unwaiting();
						goolov.msgbox.error();
					}
				});
		}
	});
}
/******del all data   *******/
function delAllData(){
		goolov.msgbox.confirm('删除确认','您确认这删除所有记录吗?删除后将不可恢复!',function(r){
		if(r){
			$.ajax({
					type : 'get',
					url : ctx+'/system/security/gsysResource/deleteAllOutJson.vhtml',
					dataType:'json',
					beforeSend :function() {
						goolov.growl.waiting('正在删除中!请稍后...');
					},
					success : function(result) {
						goolov.growl.unwaiting();
						if (result&&result.success) {
							goolov.growl.success(result.message);
							refresh();
						}else if(result&&result.message){
							goolov.msgbox.error(result.message);
						}else{
							goolov.msgbox.error();
						}
					},
					error:function(request,status,errorThrown) {
						goolov.growl.unwaiting();
						goolov.msgbox.error();
					}
				});
		}
	});
}
/******add row data   *******/
function addRowData(row){
	var indexId=grid.getIndexId();
	var rowtr=$('#row' + row[indexId], grid);
	if (rowtr.length==0) {
		grid.flexAddRowData(row);		
	}else{
		grid.flexEditRowData(rowtr[0],row);
	}
}
/******edit row data  *******/
function editRowData(row){
	grid.flexEditRowData(row);
}
/******refresh data *******/
function refresh(){
	grid.flexReload();
}
/******reset clear data *******/
function clear(){
	//$("form:first")[0].reset();
	document.getElementById('firstSearchForm').reset();
	grid.flexReload({newp: 1});
}
/******search*******/
function firstSearch(){
	grid.flexReload();
}
/******export excel*******/
function exportExcel(){
	var paramSerialize=grid.getParamsString();
	location.href=ctx+'/system/security/gsysResource/exportExcelFile.vhtml?'+paramSerialize;
}
/******import excel window*******/
var importExcelWin;
function openImportExcelWin(title,url){
	importExcelWin.window({zIndex:$.fn.window.defaults.zIndex++});
	importExcelWin.window('open');
	importExcelWin.window('setTitle',title?title:'GsysResource 导入Excel文件数据');
	goolov.loadIFrame("new-win-content",url?url:ctx+'/system/security/gsysResource/importExcelFile.vhtml');
}
function closeImportExcel(){
	importExcelWin.window('close');
}
function closeImportExcelWinAndRefresh(){
	closeImportExcel();
	refresh();
}
function importExcel(){
	openImportExcelWin();
}
